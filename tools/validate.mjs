// Checks data/past-storms.json. Run with: node tools/validate.mjs
import { readFileSync } from "node:fs";

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const isStr = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max && !/[<>]/.test(v);
// San Francisco city limits, with a little margin.
const inCity = (p) => Array.isArray(p) && p.length === 2 && p[0] >= 37.70 && p[0] <= 37.84 && p[1] >= -122.53 && p[1] <= -122.35;

let data;
try {
  data = JSON.parse(readFileSync(new URL("../data/past-storms.json", import.meta.url), "utf8"));
} catch (e) {
  console.error("data/past-storms.json is not valid JSON: " + e.message);
  process.exit(1);
}
if (!Array.isArray(data.areas)) fail("file", "needs an \"areas\" list");

(data.areas || []).forEach((a, i) => {
  const w = `areas[${i}] (${a && a.name ? a.name : "no name"})`;
  if (!isStr(a.name, 80)) fail(w, "name must be text, 80 characters or fewer, with no < or >");
  if (!["repeat", "reported"].includes(a.tier)) fail(w, "tier must be \"repeat\" or \"reported\"");
  if (!isStr(a.about, 300)) fail(w, "about must be text, 300 characters or fewer");
  if (!Array.isArray(a.shapes) || a.shapes.length === 0) fail(w, "needs at least one shape");
  (a.shapes || []).forEach((s, j) => {
    const ws = `${w} shapes[${j}]`;
    if (s.type === "circle") {
      if (!inCity(s.center)) fail(ws, "center must be [latitude, longitude] inside San Francisco");
      if (!(s.radius_m >= 20 && s.radius_m <= 300)) fail(ws, "radius_m must be between 20 and 300");
    } else if (s.type === "line") {
      if (!Array.isArray(s.points) || s.points.length < 2 || s.points.length > 20) fail(ws, "points needs 2 to 20 [latitude, longitude] pairs");
      else if (!s.points.every(inCity)) fail(ws, "every point must be [latitude, longitude] inside San Francisco");
      if (!(s.width_m >= 15 && s.width_m <= 80)) fail(ws, "width_m must be between 15 and 80");
    } else fail(ws, "type must be \"circle\" or \"line\"");
  });
  if (!Array.isArray(a.events) || a.events.length === 0) fail(w, "needs at least one event with a source link");
  (a.events || []).forEach((e, j) => {
    const we = `${w} events[${j}]`;
    if (!isStr(e.when, 60)) fail(we, "when must be text, e.g. \"Dec 31, 2022\" or \"Date not shown\"");
    if (!isStr(e.text, 400)) fail(we, "text must be 400 characters or fewer, in your own words");
    if (!isStr(e.src, 60)) fail(we, "src must name the source, e.g. \"KQED\"");
    if (typeof e.url !== "string" || !/^https:\/\/[^\s"<>]+$/.test(e.url)) fail(we, "url must be an https:// link to the report");
  });
});

if (errors.length) {
  console.error("Problems found:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`OK: ${data.areas.length} areas checked.`);
