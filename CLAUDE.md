# Rules for AI coding agents

This file is for Claude Code, Cursor, Copilot and any other AI coding agent working on My Neighborhood Map. People are welcome to follow it too. `AGENTS.md` points here.

The live site is https://christinebuilds.github.io/neighborhood-map/. Neighbors use it on their phones, often in a storm. Small, careful changes beat big clever ones.

## How the project is built

- **No build step.** Plain HTML, CSS and JavaScript with Leaflet in `vendor/`. Do not add npm packages, bundlers, frameworks, TypeScript or a `package.json` to the site. Test-only tools (Playwright) stay on your own computer.
- `index.html` is the whole app: one `<style>` block, the page markup, then one `<script>`. Inside the script, `start(CITY)` runs the flood layers and `nature(FL)` runs trees, wildlife, the weather strip and the walk planner.
- City settings live in `cities/sf/city.json` and `cities/sf/past-storms.json`. Change a link, phone number or note there, not in `index.html`.
- Publishing: `.github/workflows/publish.yml` copies a fixed list of files to the `gh-pages` branch. If you add a file the page needs, add it to that `cp` line.
- When you change a page, update `version.txt` (format `2026-11-13 13:48 PT`, Pacific time) so phones offer the update.
- San Francisco is the only city. Other cities are on hold; do not add city folders.

## Run and test

```
python3 -m http.server 8931      # then open http://localhost:8931/
node tools/validate.mjs          # must pass before every PR
```

- **Test on a phone-size screen with real taps.** Use Playwright with the `iPhone 13` device (`devices['iPhone 13']`, touch on) and `page.tap()` / `locator.tap()`, not only `click()`. Set `timezoneId: "America/Los_Angeles"` so sunrise and times read correctly.
- **Never post real rows to Supabase while testing.** The page writes neighbor reports, thanks and feedback to Supabase (`bfluyofnayvfevojofuu.supabase.co`). In every test, mock those calls first:

  ```js
  await page.route('**/*.supabase.co/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  ```

  Do not tap Send / Report / Thanks against the live database, and never use the Supabase dashboard or an API key to write data.
- Mock other feeds with `page.route` too when a test needs fixed data (weather, iNaturalist, routing), so tests don't break when the weather changes.
- Check both tabs (Nature & walks, Storms & flooding), and any pop-up or sheet you touched.

## Rules for changes

1. **Keep the safety wording.** The page must keep saying "Not an official service" and "Emergency: 9-1-1" (with the `tel:911` link where it has one), and that flooding goes to the city at 3-1-1. The lines are in the footer, in `#safety` on the flood tab, and on `flood.html`. Do not soften, shorten or remove them, on any page.
2. **Keep element IDs stable.** The script finds everything with `document.getElementById(...)`. Renaming or removing an ID (e.g. `#bLayers`, `#layerPanel`, `#sheet`, `#fbSheet`, `#fbTop`, `#safety`, `#walkCard`, `#radarNote`) silently breaks features. Add new IDs; don't rename old ones. Search the whole file for an ID before touching it.
3. **Keep pop-ups compact.** Cards and pop-ups must fit a phone screen without covering the map: a few short lines, small photo, one or two buttons. Reuse the existing `CARD` options and `cardpop` style.
4. **Plain-language UI text.** Short sentences a busy parent can read in a storm. No jargon ("geolocation", "API", "layer toggle"), no "AI" or "moderated" in what neighbors see. Say what to do next when something fails ("Radar didn't load. Try again in a few minutes.").
5. **Keep the moderation flow.** Notes and photos from neighbors stay hidden until the automatic check approves them. Show any neighbor text with `textContent` or the page's `esc()`, never as raw HTML.
6. **Keep the visual split** between official data, past-storm estimates and live neighbor reports.
7. **One feature per pull request**, with **before and after phone screenshots** and a few lines on how you tested. Say `Closes #<issue>`.
8. **No secrets in the repo.** No API keys, tokens or passwords in code, commits or issues. The Supabase publishable (anon) key already in the page is meant to be public; row-level security protects the data. Anything else secret belongs in a Supabase function's settings, which only Christine manages.
9. **Database changes** go in a new file in `supabase/migrations/` and are applied by Christine. Never apply them yourself.

## Privacy

- No names of private people and no home addresses in data files, issues, screenshots or test fixtures. Use cross streets.
- **A person's location stays on their device.** The page keeps the chosen spot in this browser only (`localStorage`, keys starting `fm_`). Never send or store someone's own location or address in Supabase or any new service. A neighbor report carries only the spot being reported (a drain or a street spot the neighbor chose), never where the person is or lives. Public weather lookups already receive rounded coordinates; don't add new places that receive them without asking first.
- Don't add analytics, trackers, ads or third-party scripts.
- Photos: keep the existing shrink step that drops location data from the file before upload.

## Before you open a PR

- [ ] `node tools/validate.mjs` passes.
- [ ] Tested at iPhone 13 size with real taps, both tabs.
- [ ] Supabase calls were mocked; no real rows were posted.
- [ ] No element IDs renamed or removed.
- [ ] Safety wording unchanged; new text is plain language.
- [ ] Pop-ups still compact.
- [ ] `version.txt` updated if a page changed.
- [ ] Before/after phone screenshots in the PR.

Christine reviews and merges every pull request. Nothing reaches the live site without her.
