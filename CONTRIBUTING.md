# How to help with My Neighborhood Map

My Neighborhood Map is a free, open-source map made by neighbors in San Francisco. It has two views on one map: **Nature & walks** (trees in season, wildlife sightings, the weather and a walk planner) and **Storms & flooding** (storm drains, flood reports, past flooding and the city's flood zone).

The map is in **public beta**. You do not need permission to help, and you do not need to be a programmer. First-time contributors are very welcome, including people who code with AI tools like Claude Code or Cursor.

## Help without code

- **On the map:** tap **Beta** or **💬 Feedback** at the top, or **💬 Report a problem or share an idea** at the bottom (or open [the map's feedback form](https://christinebuilds.github.io/neighborhood-map/#feedback) directly). It is anonymous and a volunteer reads every note. This is the best place for "this looked wrong on my phone".
- **On GitHub:** [open an issue](https://github.com/christinebuilds/neighborhood-map/issues/new/choose) and pick **Something is broken**, **Feature idea** or **Suggest a spot that floods**. Plain words are fine.
- **Add a spot that floods:** use the **Suggest a spot that floods** form. Give the cross streets and, if you can, a link to a news report. Someone will add it to the map.

## Help with code

1. Pick a task from the [features wishlist](https://github.com/christinebuilds/neighborhood-map/issues?q=is%3Aissue+is%3Aopen+label%3Awishlist). New here? Start with a [good first issue](https://github.com/christinebuilds/neighborhood-map/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). Each one says why neighbors want it, what done looks like, where in the code to start and how to test it.
2. Comment **"I'll take this"** so two people don't build the same thing. If you stop, say so; an issue with no progress for two weeks is open again.
3. Fork the repository, make a branch, and build it.
4. If you use an AI coding tool, point it at [CLAUDE.md](CLAUDE.md) first. It holds the project rules (they are good rules for people too).
5. Open a pull request that says `Closes #<issue number>` and fill in the template.

Have an idea that isn't on the list? Open a **Feature idea** issue first so we can talk about it before you build.

### Run it on your computer

There is no build step and nothing to install for the site itself:

```
python3 -m http.server 8931
```

Open http://localhost:8931/ and edit `index.html` or the files in `cities/sf/`. Reload to see changes.

### Local test checklist

Before you open a pull request:

- [ ] `node tools/validate.mjs` passes (it checks the city files; the same check runs on every pull request).
- [ ] You tried the change at phone size (iPhone 13 in Playwright or your browser's phone view) with real taps, on both tabs.
- [ ] You did **not** send real reports, thanks or feedback to the live database while testing. In Playwright, mock Supabase with `page.route` (see CLAUDE.md).
- [ ] No element IDs were renamed or removed (the script finds everything by ID).
- [ ] The safety wording is unchanged: "Not an official service" and "Emergency: 9-1-1".
- [ ] New words on the page are short and plain.
- [ ] Pop-ups still fit on a phone.
- [ ] You have before and after phone screenshots for the pull request.

## How a pull request gets reviewed

- Christine reviews every pull request and merges it. **Nothing reaches the live site without her.**
- An automatic check runs `node tools/validate.mjs` and tells you in plain words if a data file is off.
- She may ask for changes or smaller pieces. One feature per pull request makes this quick.
- Once merged into `main`, the site updates itself within a few minutes.

## Add a spot yourself

San Francisco's past-storm areas live in `cities/sf/past-storms.json`.

1. Open that file on GitHub and tap the pencil icon. GitHub makes your own copy.
2. Copy an existing area and change it. Each area has:
   - `name`: the streets, e.g. `"17th & Folsom"`.
   - `tier`: `"repeat"` if several reports describe flooding there, otherwise `"reported"`.
   - `about`: one sentence on why water collects there.
   - `shapes`: a `circle` (`center`, `radius_m`) for an intersection, or a `line` (`points`, `width_m`) along a street. Coordinates are `[latitude, longitude]`. To get them, long-press the spot in a maps app.
   - `events`: one entry per report, with `when`, `text` (your own words, not copied), `src` and an `https://` `url`.
3. Tap **Propose changes**, then **Create pull request**.

### Rules for the data

- Every area needs at least one source link. No source, no pin.
- Write what the source says. Do not guess depths or dates.
- No names of private people and no home addresses.
- Mark a location as approximate in `about` when the report is vague.

## Please keep these as they are

Unless you discuss it in an issue first:

- The wording that says this is a volunteer map and not an official warning system.
- The moderation flow. Notes and photos must stay hidden until the automatic check approves them.
- The clear visual split between official data, past-storm estimates and live reports.
- Privacy: a person's own location stays in their browser.

## Code structure

`index.html` is the engine. `cities/sf/city.json` holds everything local: map bounds, data sources, links and wording, so change a link or a note there, not in `index.html`. The map library is in `vendor/`. San Francisco is the only city for now; other cities are on hold.

## Who can merge

Maintainers listed in `MAINTAINERS.md` can review and merge. Today that is Christine.

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).
