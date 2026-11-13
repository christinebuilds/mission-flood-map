> **Status (13 Nov 2026):** Step 1 (engine and city-file split) is done. Everything else here is queued and on hold: no other cities until Christine says so.

# Flood map: plan for scaling beyond San Francisco

Researched 13 Nov 2026. Research only; nothing was changed.

**Labels.** "Confirmed" means I opened the page or data today. "Docs only" means I read the official documentation but the live data refused automated access. "Not checked" means I could not open it.

## 1. Recommended next three steps

1. **Split the site into "engine" and "city file".** Move everything SF-specific into one config file (`cities/sf.json`). The map looks the same afterwards, and every later city becomes cheap.
2. **Launch Oakland as city two.** It has the best data outside SF: open service requests with a category named "Storm Drains - Clogged (Flooding)". Use FEMA flood zones. Find one Oakland parent to own it before launch.
3. **Ask SF311 for an Open311 API key.** It is the only route to same-day SF reports. While waiting, add the national radar-rainfall layer (no key needed).

## 2. Bay Area by city

| City | Flooding reports (311) | Storm drain inventory | Flood zones | Adopt-a-drain |
|---|---|---|---|---|
| **Oakland** | **Yes.** [Socrata quth-gb8e](https://data.oaklandca.gov/resource/quth-gb8e.json). Has "Storm Drains - Clogged (Flooding)" (5,751 rows) and "Pooling Water". Newest row was 8 Nov, so about 5 days behind. Confirmed. Coordinates field not checked. | Only a [2014 CSV](https://data.openoakland.org/dataset/storm-drains) from OpenOakland. Confirmed, stale. A current city layer may exist on ArcGIS. Not checked. | FEMA only. | [Yes](https://www.oaklandca.gov/Community/Volunteer-Opportunities/Adopt-A-Drain), with a [priority drain map](https://oakgis.maps.arcgis.com/apps/instant/interactivelegend/index.html?appid=cd7c074556e04ffaa9a91f6626747e20). No download offered. Confirmed. |
| **Berkeley** | Unknown. The [portal](https://data.cityofberkeley.info/) refused automated access. Not checked. Residents report by phone (311). | No download found. About 9,000 drains shown on the adopt-a-drain hub. | FEMA only. | [Yes](https://berkeleyca.gov/community-recreation/volunteering/adopt-drain), on an [ArcGIS hub](https://adopt-a-storm-drain-berkeley.hub.arcgis.com/). Confirmed. |
| **San Jose** | [311 CSV](https://data.sanjoseca.gov/dataset/311-service-request-data), updated daily, CC0. Confirmed it exists. Categories and coordinates not checked. City says to phone in flooding (408-794-1900), so flood rows may be few. | **Yes.** [Storm Inlets](https://data.sanjoseca.gov/dataset/storm-inlets), GeoJSON and ArcGIS REST, CC BY. Confirmed. | FEMA only. | [Yes](https://www.sanjoseca.gov/your-government/departments-offices/environmental-services/our-creeks-rivers-bay/adopt-a-storm-drain), with a map. Confirmed. |
| **San Mateo (city)** | Nothing usable found. | Only inside the adopt-a-drain map. No download found. | FEMA only. | [Yes](https://www.cityofsanmateo.org/adoptadrain), with [map](https://experience.arcgis.com/experience/f1191d24853a4b6ca88e0ce43528bac5) showing high-priority drains. Confirmed. |
| **South San Francisco** | Nothing usable found. | Only inside the adopt map. | FEMA only. | [Yes](https://www.ssfca.gov/Departments/Public-Works/Storm-Preparation-Tips/Adopt-a-Storm-Drain/Adopt-a-Storm-Drain-Form). Confirmed. |
| **Daly City** | Nothing usable. The [iHelp app](https://www.dalycity.org/DocumentCenter/View/4664/iHelp-Informational-Sheet) has a public map but no data feed. Confirmed. | Nothing found. | FEMA only. | None found. |
| **Marin County** | No county-wide data found. San Rafael takes non-urgent drain reports through [SeeClickFix](https://www.cityofsanrafael.org/storms). Confirmed. | Nothing found. County GIS not checked. | FEMA only. County GIS not checked. | None found. |

Plain summary: outside SF, only Oakland has confirmed open flooding reports, and only San Jose has a confirmed, current drain inventory. I found no street-flooding model like SFPUC's anywhere else. Daly City, South San Francisco and San Mateo would launch with national layers plus neighbor reports only.

One caveat on FEMA zones (my understanding, not checked today): they map creek and coastal flooding, not backed-up storm drains. Label them differently from SF's layer.

## 3. Multi-city design

**One site, one database, one config file per city.** Open with `?city=oakland`. Each city file holds:

- Name, map bounds, start zoom.
- NOAA tide station ID. Leave empty for inland cities.
- Weather point (lat, lon) for the forecast, and the state code for alerts.
- Adapters: reports, drains, flood zone, adopt-a-drain link. Each can be "none".
- Local phone numbers for reporting.
- Maintainer names.

**Adapter types to write once:** Socrata (SF, Oakland), ArcGIS REST (San Jose drains, FEMA), CSV download (San Jose 311), Open311, SeeClickFix.

**Works everywhere in the US**

- [National Weather Service API](https://www.weather.gov/documentation/services-web-api): alerts, hourly forecast, station readings. No key. Confirmed.
- [NOAA tides](https://api.tidesandcurrents.noaa.gov/api/prod/): no key. Confirmed.
- [FEMA flood hazard layer](https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS): REST, WMS, WFS. Detail shows only when zoomed in. Some areas have no digital map. Confirmed.
- [USGS stream gauges](https://api.waterdata.usgs.gov/docs/): a key raises limits. Docs confirmed.
- Radar and 1-hour rainfall tiles from [Iowa Mesonet](https://mesonet.agron.iastate.edu/ogc/). Confirmed.
- [Open311](https://wiki.open311.org/GeoReport_v2/Servers): few cities. SF is the only Bay Area one listed. Confirmed.
- [SeeClickFix API](https://dev.seeclickfix.com/): covers many smaller cities. 20 requests a minute. Licence is non-commercial, share-alike. Docs only.
- First Street: link out only. The site now sits behind MSCI terms and full reports need a paid unlock. Confirmed.

**Must stay local:** past-storm areas from news, drain inventories, adopt-a-drain links, phone numbers, local flood models, and a human who knows the streets.

**Same-day SF reports.** SF's [Open311 API](https://mobile311.sfgov.org/open311) is live but needs a key. Docs only; I could not see the data. The [open dataset](https://datasf.gitbook.io/datasf-dataset-explainers/311-cases) refreshes once a day. Keep the key inside the Supabase function, never in the page.

**Live rain for the Bay Area**

- NWS station readings: up to 20 minutes late. Confirmed.
- Radar 1-hour rainfall tiles: easiest add. Confirmed.
- [Valley Water gauges](https://alert.valleywater.org/) (Santa Clara County): has a documented API. Confirmed.
- [Marin flood district gauges](https://flooddistrict.marincounty.gov/weather-gauges): rain and stream, offered "as-is". Page confirmed; data site blocks bots.
- [OneShoreline](https://oneshoreline.org/?p=455) (San Mateo County): public dashboard, no feed stated. Dashboard not checked.
- [AQPI radar](https://cw3e.ucsd.edu/aqpi/): partners only. Confirmed.
- Alameda County: nothing confirmed.

## 4. Costs and risks

- **Hosting.** [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) allows 1 GB and about 100 GB a month. Enough. Confirmed.
- **Database.** [Supabase free](https://supabase.com/pricing): 500 MB database, 1 GB photos, and projects pause after one week without activity. A dry fortnight could switch reports off just before a storm. Pro is $25 a month and does not pause. Confirmed.
- **Moderation.** The cheapest Claude model is listed at $0.10 in and $0.50 out per million tokens ([pricing](https://platform.claude.com/docs/en/about-claude/pricing), confirmed). My estimate: well under a cent per photo, a few dollars per big storm. I did not check which model the function uses.
- **Abuse.** Cost is not the risk. Spam, false "water here" pins and bad photos are. Add rate limits, auto-expiry of reports after a day or two, a "report this" button, a kill switch per city and a hard spending cap.
- **Photos.** 1 GB is roughly 3,000 phone photos (my estimate). Shrink on upload; delete after 30 days.
- **Privacy.** No accounts today. Accounts are being planned for saved walks only (private, optional); reporting stays anonymous. Strip location data from photos. Reject faces, plates and house numbers. Do not store IP addresses beyond short-lived rate limiting. Snap pins to the street, not a home. Never re-publish 311 free text; SF removes it for privacy.
- **Maintainers.** One named parent per city, listed in the city file and as code owner for it. If a city has no maintainer for a season, show a "not maintained" banner or hide it. Christine keeps the engine only.
- **Not an official tool.** Put it on the map itself, not just the README. Suggested wording: "Made by neighbors. Not a warning system. Data can be late or wrong. No pin does not mean no flooding. Emergency: 9-1-1. Official alerts: weather.gov." Show the age of every layer.
- **Feeds break.** Add a weekly automatic check that each feed still answers.

## 5. Open questions for Christine

1. Is there an Oakland parent ready to own city two?
2. One shared link with a city picker, or one link per city?
3. Are you willing to pay about $25 a month in storm season?
4. Should cities with no local data launch at all, or wait?
5. Will you ask Berkeley, San Mateo and SSF public works for their drain layers? Their adopt-a-drain maps show the data exists.
6. Is the SeeClickFix non-commercial, share-alike licence acceptable?

## Sources

- SF Open311: https://mobile311.sfgov.org/open311
- SF 311 dataset explainer: https://datasf.gitbook.io/datasf-dataset-explainers/311-cases
- Open311 server list: https://wiki.open311.org/GeoReport_v2/Servers
- Oakland service requests: https://data.oaklandca.gov/resource/quth-gb8e.json
- Oakland Adopt a Drain: https://www.oaklandca.gov/Community/Volunteer-Opportunities/Adopt-A-Drain
- OpenOakland storm drains (2014): https://data.openoakland.org/dataset/storm-drains
- Berkeley open data portal: https://berkeleyca.gov/your-government/public-records/open-data-portal
- Berkeley Adopt a Drain: https://berkeleyca.gov/community-recreation/volunteering/adopt-drain
- San Jose 311 data: https://data.sanjoseca.gov/dataset/311-service-request-data
- San Jose storm inlets: https://data.sanjoseca.gov/dataset/storm-inlets
- San Jose Adopt a Storm Drain: https://www.sanjoseca.gov/your-government/departments-offices/environmental-services/our-creeks-rivers-bay/adopt-a-storm-drain
- San Mateo Adopt-a-Drain: https://www.cityofsanmateo.org/adoptadrain
- South San Francisco Adopt a Storm Drain: https://www.ssfca.gov/Departments/Public-Works/Storm-Preparation-Tips/Adopt-a-Storm-Drain/Adopt-a-Storm-Drain-Form
- Daly City iHelp: https://www.dalycity.org/DocumentCenter/View/4664/iHelp-Informational-Sheet
- San Rafael storms: https://www.cityofsanrafael.org/storms
- Marin flood district gauges: https://flooddistrict.marincounty.gov/weather-gauges
- OneShoreline early warning: https://oneshoreline.org/?p=455
- Valley Water gauges: https://alert.valleywater.org/ and https://alertdata.valleywater.org/
- AQPI: https://cw3e.ucsd.edu/aqpi/
- FEMA flood layer services: https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS
- NWS API: https://www.weather.gov/documentation/services-web-api
- NOAA tides API: https://api.tidesandcurrents.noaa.gov/api/prod/
- USGS water data APIs: https://api.waterdata.usgs.gov/docs/
- Iowa Mesonet map services: https://mesonet.agron.iastate.edu/ogc/
- SeeClickFix API: https://dev.seeclickfix.com/
- First Street help: https://help.firststreet.org/hc/en-us/articles/9680350042903
- Supabase pricing: https://supabase.com/pricing
- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Claude pricing: https://platform.claude.com/docs/en/about-claude/pricing
