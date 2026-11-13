# How to help with My Neighborhood Map

My Neighborhood Map is a free, open-source map made by neighbors. It has two views on one map: **Nature & walks** (trees in season, wildlife sightings, the weather and a walk planner) and **Storms & flooding** (storm drains, flood reports, past flooding and the city's flood zone).

You do not need permission to help, and you do not need to be a programmer. First-time contributors are very welcome.

## Share an idea or report a bug

- **On the map:** scroll to the bottom and tap **💬 Report a problem or share an idea**. It is anonymous and a volunteer reads every note.
- **On GitHub:** [open an issue](https://github.com/christinebuilds/neighborhood-map/issues/new/choose). Say what you expected, what happened, and which phone or browser you used. A screenshot helps.

## Bring the map to your city

Everything local lives in one folder, `cities/<id>/`. See "Change the code" below, or open an issue and we will help you set it up.

## Add a spot that floods (no coding)

Open a new issue with the **Suggest a spot that floods** form. Give the cross streets and, if you can, a link to a news report. Someone will add it to the map.

## Add a spot yourself

Each city has its own folder under `cities/`. San Francisco's past-storm areas live in `cities/sf/past-storms.json`.

1. Open that file on GitHub and tap the pencil icon. GitHub makes your own copy.
2. Copy an existing area and change it. Each area has:
   - `name`: the streets, e.g. `"17th & Folsom"`.
   - `tier`: `"repeat"` if several reports describe flooding there, otherwise `"reported"`.
   - `about`: one sentence on why water collects there.
   - `shapes`: a `circle` (`center`, `radius_m`) for an intersection, or a `line` (`points`, `width_m`) along a street. Coordinates are `[latitude, longitude]`. To get them, long-press the spot in a maps app.
   - `events`: one entry per report, with `when`, `text` (your own words, not copied), `src` and an `https://` `url`.
3. Tap **Propose changes**, then **Create pull request**.

A check runs on every pull request and tells you in plain words if something is off.

## Rules for the data

- Every area needs at least one source link. No source, no pin.
- Write what the source says. Do not guess depths or dates.
- No names of private people and no home addresses.
- Mark a location as approximate in `about` when the report is vague.

## Change the code

The site has two parts. `index.html` is the engine and is the same for every city. `cities/<id>/city.json` holds everything local: map bounds, data sources, links and wording. The map library is in `vendor/`. There is no build step: open `index.html` through any local web server, e.g. `python3 -m http.server`, and edit.

Please keep these as they are unless you discuss it in an issue first:

- The wording that says this is a volunteer map and not an official warning system.
- The moderation flow. Notes and photos must stay hidden until the automatic check approves them.
- The clear visual split between official data, past-storm estimates and live reports.

## City settings

`cities/sf/city.json` sets San Francisco's map bounds, weather point, tide station, open data sources (311 reports, storm drains, flood zone), links and the notes on reading the rain. Change a link or a note there, not in `index.html`.

Other cities are on hold for now. The engine opens a city with `?city=<id>` and defaults to `sf`.

## Who can merge

Maintainers listed in `MAINTAINERS.md` can review and merge. Any one maintainer's approval is enough. When a change lands on `main`, the site updates itself within a few minutes.

Want to look after your own neighborhood? Open an issue saying so and an existing maintainer can add you.
