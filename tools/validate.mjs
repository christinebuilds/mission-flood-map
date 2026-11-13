// Checks every city folder under cities/. Run with: node tools/validate.mjs
import { readFileSync, readdirSync } from "node:fs";

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const isStr = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max && !/[<>]/.test(v);
const https = (u) => typeof u === "string" && /^https:\/\/[^\s"<>]+$/.test(u);
const pair = (p) => Array.isArray(p) && p.length === 2 && typeof p[0] === "number" && typeof p[1] === "number";

let total = 0;
for (const id of readdirSync(new URL("../cities/", import.meta.url))) {
  const dir = new URL(`../cities/${id}/`, import.meta.url);
  if (!/^[a-z0-9-]+$/.test(id)) { fail(`cities/${id}`, "folder name must be lowercase letters, digits or hyphens"); continue; }

  // ---- city.json: the settings for one city
  let city;
  try { city = JSON.parse(readFileSync(new URL("city.json", dir), "utf8")); }
  catch (e) { fail(`cities/${id}/city.json`, "is missing or not valid JSON: " + e.message); continue; }
  const wc = `cities/${id}/city.json`;
  if (city.id !== id) fail(wc, `"id" must match the folder name "${id}"`);
  if (!isStr(city.name, 60)) fail(wc, "name is required");
  if (!isStr(city.title, 80)) fail(wc, "title is required");
  if (!Array.isArray(city.maintainers) || city.maintainers.length === 0) fail(wc, "list at least one maintainer");
  const bd = city.bounds;
  const boundsOk = Array.isArray(bd) && bd.length === 2 && pair(bd[0]) && pair(bd[1]) && bd[0][0] < bd[1][0] && bd[0][1] < bd[1][1];
  if (!boundsOk) fail(wc, "bounds must be [[south, west], [north, east]]");
  if (!pair(city.weather_point)) fail(wc, "weather_point must be [latitude, longitude]");
  if (!Array.isArray(city.open_data_hosts) || !city.open_data_hosts.every(https)) fail(wc, "open_data_hosts must be https:// addresses");
  for (const l of city.links || []) if (!isStr(l.label, 80) || !https(l.url)) fail(wc, "each link needs a label and an https:// url");
  for (const n of city.rain_notes || []) {
    if (!isStr(n.text, 400)) fail(wc, "each rain note needs text of 400 characters or fewer");
    if (n.url !== undefined && !https(n.url)) fail(wc, "rain note url must be https://");
  }
  const margin = 0.03;
  const inCity = (p) => pair(p) && boundsOk && p[0] >= bd[0][0] - margin && p[0] <= bd[1][0] + margin && p[1] >= bd[0][1] - margin && p[1] <= bd[1][1] + margin;

  // ---- past-storms.json: places that flooded before
  let data;
  try { data = JSON.parse(readFileSync(new URL("past-storms.json", dir), "utf8")); }
  catch (e) { fail(`cities/${id}/past-storms.json`, "is missing or not valid JSON: " + e.message); continue; }
  if (!Array.isArray(data.areas)) fail(`cities/${id}/past-storms.json`, "needs an \"areas\" list");

  (data.areas || []).forEach((a, i) => {
    total++;
    const w = `cities/${id} areas[${i}] (${a && a.name ? a.name : "no name"})`;
    if (!isStr(a.name, 80)) fail(w, "name must be text, 80 characters or fewer, with no < or >");
    if (!["repeat", "reported"].includes(a.tier)) fail(w, "tier must be \"repeat\" or \"reported\"");
    if (!isStr(a.about, 300)) fail(w, "about must be text, 300 characters or fewer");
    if (!Array.isArray(a.shapes) || a.shapes.length === 0) fail(w, "needs at least one shape");
    (a.shapes || []).forEach((s, j) => {
      const ws = `${w} shapes[${j}]`;
      if (s.type === "circle") {
        if (!inCity(s.center)) fail(ws, "center must be [latitude, longitude] inside the city's bounds");
        if (!(s.radius_m >= 20 && s.radius_m <= 300)) fail(ws, "radius_m must be between 20 and 300");
      } else if (s.type === "line") {
        if (!Array.isArray(s.points) || s.points.length < 2 || s.points.length > 20) fail(ws, "points needs 2 to 20 [latitude, longitude] pairs");
        else if (!s.points.every(inCity)) fail(ws, "every point must be [latitude, longitude] inside the city's bounds");
        if (!(s.width_m >= 15 && s.width_m <= 80)) fail(ws, "width_m must be between 15 and 80");
      } else fail(ws, "type must be \"circle\" or \"line\"");
    });
    if (!Array.isArray(a.events) || a.events.length === 0) fail(w, "needs at least one event with a source link");
    (a.events || []).forEach((e, j) => {
      const we = `${w} events[${j}]`;
      if (!isStr(e.when, 60)) fail(we, "when must be text, e.g. \"Dec 31, 2022\" or \"Date not shown\"");
      if (!isStr(e.text, 400)) fail(we, "text must be 400 characters or fewer, in your own words");
      if (!isStr(e.src, 60)) fail(we, "src must name the source, e.g. \"KQED\"");
      if (!https(e.url)) fail(we, "url must be an https:// link to the report");
    });
  });
}

if (errors.length) {
  console.error("Problems found:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`OK: ${total} past-storm areas checked.`);
