// Draws the link-preview card and the home-screen icons into assets/.
// Run with: NODE_PATH=<where playwright is installed> node tools/make-assets.mjs
// Everything here is drawn with plain shapes: no map tiles, no photos.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const out = (f) => new URL(`../assets/${f}`, import.meta.url);

// The mark: a green leaf and a blue raindrop on a calm green-to-blue square.
const mark = (rounded) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f7d5b"/><stop offset="1" stop-color="#2a6f9e"/></linearGradient></defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#g)"/>
  <path d="M120 372 C112 236 196 140 352 124 C364 276 284 372 120 372 Z" fill="#e9f6e4"/>
  <path d="M136 356 C196 284 252 226 318 166" stroke="#2f7d5b" stroke-width="14" stroke-linecap="round" fill="none"/>
  <path d="M356 236 C356 236 300 306 300 344 A56 56 0 0 0 412 344 C412 306 356 236 356 236 Z" fill="#bfe3fa" stroke="#2a6f9e" stroke-width="10"/>
  <ellipse cx="336" cy="344" rx="9" ry="16" fill="#fff" opacity=".8"/>
</svg>`;
writeFileSync(out("icon.svg"), mark(true));

const card = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:"DejaVu Sans",system-ui,sans-serif}
body{background:linear-gradient(135deg,#e8f3ec 0%,#e3eff7 100%);position:relative}
svg.bg{position:absolute;inset:0}
.txt{position:absolute;left:80px;top:78px;width:720px}
.mark{width:104px;height:104px;margin-bottom:26px}
h1{margin:0;font-size:64px;line-height:1.05;color:#16352b;letter-spacing:-1px}
p{margin:20px 0 0;font-size:29px;line-height:1.35;color:#2f4d5c}
.beta{display:inline-block;margin-top:26px;font-size:24px;font-weight:700;color:#fff;background:#2a6f9e;border-radius:99px;padding:6px 20px}
</style></head><body>
<svg class="bg" width="1200" height="630" viewBox="0 0 1200 630">
  <g stroke="#ffffff" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9">
    <path d="M760 -20 L1220 420"/><path d="M700 640 L1220 250"/><path d="M930 -20 L930 650"/><path d="M760 330 L1220 330"/>
  </g>
  <path d="M1000 -10 C960 120 1080 220 1040 360 C1010 470 1100 560 1080 650" stroke="#9fd0ee" stroke-width="30" fill="none" stroke-linecap="round"/>
  <ellipse cx="840" cy="170" rx="70" ry="48" fill="#bfe0c8"/><ellipse cx="1120" cy="520" rx="90" ry="56" fill="#bfe0c8"/>
  <circle cx="835" cy="470" r="13" fill="#3f9a56"/><circle cx="870" cy="500" r="10" fill="#3f9a56"/><circle cx="1110" cy="140" r="12" fill="#3f9a56"/>
  <circle cx="985" cy="300" r="15" fill="#2a6f9e" stroke="#fff" stroke-width="4"/><circle cx="1150" cy="330" r="11" fill="#d0581c" stroke="#fff" stroke-width="4"/>
</svg>
<div class="txt"><img class="mark" src="data:image/svg+xml;base64,${Buffer.from(mark(true)).toString("base64")}">
<h1>My Neighborhood Map</h1>
<p>Trees, birds, walks and flood help<br>for your block · San Francisco</p>
<span class="beta">Beta</span></div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.setContent(card); await p.waitForTimeout(200);
await p.screenshot({ path: out("preview.png").pathname });
for (const [n, rounded] of [[180, false], [192, true], [512, true], [32, true]]) {
  await p.setViewportSize({ width: n, height: n });
  await p.setContent(`<html><body style="margin:0;background:${rounded ? "transparent" : "#2f7d5b"}"><img style="display:block;width:${n}px;height:${n}px" src="data:image/svg+xml;base64,${Buffer.from(mark(rounded)).toString("base64")}"></body></html>`);
  await p.screenshot({ path: out(n === 180 ? "apple-touch-icon.png" : `icon-${n}.png`).pathname, omitBackground: rounded });
}
await b.close();
console.log("assets written");
