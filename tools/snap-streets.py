#!/usr/bin/env python3
"""Redraw the hand-drawn past-storm lines on the city's real street centerlines.

For each line shape that names a "street", fetch that street's active segments
from DataSF (dataset 3psu-pn9h) inside the old line's box and replace the points
with the real geometry. Run:  python3 tools/snap-streets.py   (then validate.mjs)
"""
import json, math, sys, urllib.parse, urllib.request
SRC = "https://data.sf.gov/resource/3psu-pn9h.json"
PATH = "cities/sf/past-storms.json"

def segments(street, box, pad=0.003):
    s, w, n, e = box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad
    q = {"$select": "cnn,f_st,t_st,line", "$limit": "500",
         "$where": "streetname='%s' AND active='true' AND within_box(line, %f, %f, %f, %f)" % (street, n, w, s, e)}
    with urllib.request.urlopen(SRC + "?" + urllib.parse.urlencode(q), timeout=30) as r:
        return json.load(r)

def chain(rows, box):
    """Keep whole blocks whose middle falls inside the old line's span (plus ~45 m), in order along the street."""
    ew = (box[3] - box[1]) * math.cos(math.radians(box[0])) >= (box[2] - box[0])
    k = 0 if ew else 1                      # index into [lon, lat]
    lo, hi = (box[1], box[3]) if ew else (box[0], box[2])
    slack, cross = 0.0003, 0.0009           # along the street; and sideways, to drop a far-off namesake
    mid_other = (box[0] + box[2]) / 2 if ew else (box[1] + box[3]) / 2
    pts = set()
    for r in rows:
        c = r["line"]["coordinates"]
        m = [(c[0][0] + c[-1][0]) / 2, (c[0][1] + c[-1][1]) / 2]
        if not (lo - slack <= m[k] <= hi + slack) or abs(m[1 - k] - mid_other) > cross: continue
        for lon, lat in c: pts.add((round(lat, 5), round(lon, 5)))
    out = []
    for p in sorted(pts, key=lambda p: p[1 - k]):   # drop points closer than ~12 m to the last one kept
        if not out or math.hypot((p[0] - out[-1][0]) * 111320, (p[1] - out[-1][1]) * 88000) > 12: out.append(p)
    while len(out) > 20: out = out[::2] + ([out[-1]] if len(out) % 2 == 0 else [])
    return [list(p) for p in out]

d = json.load(open(PATH)); changed = 0
for a in d["areas"]:
    for sh in a["shapes"]:
        if sh["type"] != "line" or not sh.get("street"): continue
        lats = [p[0] for p in sh["points"]]; lons = [p[1] for p in sh["points"]]
        box = (min(lats), min(lons), max(lats), max(lons))
        new = chain(segments(sh["street"], box), box)
        if len(new) < 2: print("NO MATCH:", a["name"], sh["street"]); continue
        print("%-45s %-16s %d pts  %s .. %s" % (a["name"][:45], sh["street"], len(new), new[0], new[-1]))
        sh["points"] = new; changed += 1
json.dump(d, open(PATH, "w"), indent=2, ensure_ascii=False); open(PATH, "a").write("\n")
print("redrawn:", changed)
