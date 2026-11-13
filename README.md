# SF neighborhood flood map

A volunteer-made map to help San Francisco neighbors get through storms: where water tends to collect, what has been reported, and which storm drains to check.

**Open the map:** https://christinebuilds.github.io/mission-flood-map/

This is not an official city service or a warning system. In an emergency call 9-1-1. Report flooding to the city at 3-1-1.

## What it shows

- The city's 100-year storm flood risk zone (SFPUC, via DataSF).
- Places that flooded in past storms, from news reports, each with its source link.
- Recent flooding, drain and sewage-backup cases reported to SF311 (DataSF, refreshed nightly).
- City storm drains, with a rule-of-thumb flag for the ones to check first.
- Neighbor reports: "water here", "I cleared this drain", "needs clearing", with optional photos.
- Wildlife neighbors photographed in the last 30 days (iNaturalist), with photos, and the city's street trees with California natives marked (DataSF). Zoom in to see them.
- Weather alerts and rain chance (National Weather Service), next high tide (NOAA), and rain radar.

## Help improve it

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a spot in your neighborhood takes one small edit to `data/past-storms.json`, or you can fill in an issue form with no coding at all.

## How it is built

One static page (`index.html`) with Leaflet, published with GitHub Pages. Neighbor reports are stored in Supabase; notes and photos are checked automatically before they appear.
