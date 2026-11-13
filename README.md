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
- How much rain is expected in the next hour and the next 24 hours (Open-Meteo, with the Weather Service as fallback).
- A log for each storm drain of when neighbors cleared it, with a way to thank them; and a "the water is gone" button on water reports.
- An address box and "Use my location" to open the map on your own block. The spot is remembered in your browser only.
- A form for bugs and ideas, read daily.
- Weather alerts and rain chance (National Weather Service), next high tide (NOAA), and rain radar.

## Three pages

- **Storms & flooding** (`index.html`, the main link): flood risk, reports and storm drains only.
- **Plan a walk** (`walk.html`): tap a start and an end to get a walking route, what neighbors have photographed along it (iNaturalist), the street trees you will pass, any stretch inside the flood zone, short detours worth taking, and the driest time to go.
- **Mission Creek Today** (`today.html`): the neighborhood home page, with the weather, the best time for a walk, recent sightings, and links to the other two.

## Help improve it

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a spot in your neighborhood takes one small edit to `cities/sf/past-storms.json`, or you can fill in an issue form with no coding at all.

## How it is built

One static engine page (`index.html`) with Leaflet, plus one settings folder per city under `cities/`, published with GitHub Pages. Neighbor reports are stored in Supabase; notes and photos are checked automatically before they appear.
