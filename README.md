# My Neighborhood Map

My Neighborhood Map: an engine for neighborhood maps, one folder per city. San Francisco is the first city.

It is one page with two views of your own block:

- **Nature & walks** (the front door): find your address and the page names your neighborhood. A day strip shows sunrise, sunset, rain hour by hour, temperature and the best two hours for a walk. The map shows street trees (a density picture when zoomed out, single trees when zoomed in) and wildlife neighbors photographed nearby (iNaturalist). Tap a tree or sighting for a small card and "Walk here" for a walking route, what you will pass, and short detours. A seasonal walk (fall colors, blossom) paints the trees in season.
- **Storms & flooding**: the city's flood zone, places that flooded in past storms (with sources), 311 flooding and drain cases, storm drains with a rule-of-thumb flag for which to check first, and neighbor reports ("water here", "I cleared this drain", "needs clearing", "the water is gone"). Each drain keeps a log of clearings and a way to thank the neighbor. Rain amounts, alerts, the next high tide and live rain radar sit alongside.

This is not an official city service or a warning system. In an emergency call 9-1-1. Report flooding to the city at 3-1-1.

## Pages and links

- `index.html` is the map. `#flood` opens the Storms & flooding view, `#walk` starts planning a walk, `#feedback` opens the bug and idea form.
- `flood.html` is a short landing page titled "SF Flood Map", the link to share for flooding.
- `today.html` and `walk.html` only redirect to the map, so old links keep working.
- `version.txt` holds the build time. The page shows it in the footer and offers to update when a newer one is published.

## Cities

Everything local lives in `cities/<id>/`: `city.json` (bounds, data sources, phone numbers, notes) and `past-storms.json`. The engine loads `cities/sf/` by default; add `?city=<id>` to the address to load another folder. San Francisco is the only city for now.

## Help improve it

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a spot in your neighborhood takes one small edit to `cities/sf/past-storms.json`, or you can fill in an issue form with no coding at all.

## How it is built

One static engine page (`index.html`) with Leaflet and no build step, plus one settings folder per city under `cities/`, published with GitHub Pages. All links between pages are relative, so the site works under any repository name. Neighbor reports are stored in Supabase; notes and photos are checked automatically before they appear.
