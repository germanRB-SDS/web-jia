// [71-0] QA: «El cierre de Tizaseca» at 1440 and 390 — the section, its seams with Acoge and Socios, the button and the
// «not available» note (forced by standing a 120×90 placeholder in for Image). Usage: node qa.mjs <base-url> <out-dir>
import { writeFileSync } from "node:fs";
import { open, sleep } from "./cdp.mjs";
const base = process.argv[2] ?? "http://localhost:3070";
const out = process.argv[3] ?? ".";
const report = {};
for (const [name, width, mobile] of [["1440", 1440, false], ["390", 390, true]]) {
  const p = await open({ width, mobile });
  await p.load(`${base}/almeria-2026`);
  const r = {};
  r.order = await p.ev(`[...document.querySelectorAll('main > section')].map((s) => s.id)`);
  await p.ev(`document.querySelector('#cierre').scrollIntoView({ block: 'start', behavior: 'instant' })`);
  await sleep(1200);
  r.section = await p.ev(`(() => { const s = document.querySelector('#cierre'); const b = s.getBoundingClientRect(); const a = s.querySelector('a[class*="__play"]'); return { height: Math.round(b.height), bg: getComputedStyle(s).backgroundColor, href: a.getAttribute('href'), target: a.getAttribute('target'), label: a.getAttribute('aria-label'), title: s.querySelector('h2').textContent }; })()`);
  await p.shot(`${out}/cierre-${name}.png`, '#cierre');
  // The seams: the end of «Dispara tu centro» and the start of «Quiénes somos».
  const seam = await p.ev(`(() => { const a = document.querySelector('#acoge').getBoundingClientRect(); const c = document.querySelector('#cierre').getBoundingClientRect(); const s = document.querySelector('#socios')?.getBoundingClientRect(); return { y0: a.bottom + scrollY - 160, y1: (s ? s.top + 160 : c.bottom) + scrollY }; })()`);
  const { data } = await p.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: seam.y0, width, height: seam.y1 - seam.y0, scale: mobile ? 0.5 : 0.5 } });
  writeFileSync(`${out}/costuras-${name}.png`, Buffer.from(data, "base64"));
  // An aftermovie gone from YouTube.
  await p.load(`${base}/almeria-2026`);
  await p.ev(`window.Image = class { constructor() { this.naturalWidth = 120; } set src(v) { window.__probed = v; setTimeout(() => this.onload?.(), 30); } }`);
  await p.ev(`document.querySelector('#cierre a[class*="__play"]').scrollIntoView({ block: 'center', behavior: 'instant' })`);
  await sleep(500);
  await p.ev(`document.querySelector('#cierre a[class*="__play"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))`);
  await sleep(300);
  await p.ev(`document.querySelector('#cierre a[class*="__play"]').click()`);
  await sleep(900);
  r.gone = await p.ev(`({ probed: window.__probed, url: location.href, note: document.querySelector('#cierre [role="status"]').textContent, expanded: document.querySelector('#cierre a[class*="__play"]').getAttribute('aria-expanded') })`);
  await p.shot(`${out}/cierre-no-disponible-${name}.png`, '#cierre');
  r.errors = p.errors.filter((e) => !/React DevTools|PCFSoftShadowMap/.test(e));
  report[name] = r;
  p.close();
}
writeFileSync(`${out}/qa.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
