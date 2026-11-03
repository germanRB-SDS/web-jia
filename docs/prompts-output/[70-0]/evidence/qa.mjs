// [70-0] QA: workshop actions, the sheet's buttons and the inauguration band, at 1440 and 390, in headless Chrome.
// Usage: node qa.mjs <base-url> <out-dir>
import { writeFileSync } from "node:fs";
import { open, sleep } from "./cdp.mjs";

const base = process.argv[2] ?? "http://localhost:3070";
const out = process.argv[3] ?? ".";

const report = {};
for (const [name, width, mobile] of [["1440", 1440, false], ["390", 390, true]]) {
  const p = await open({ width, mobile });
  await p.load(`${base}/almeria-2026`);
  const r = {};

  // ---- workshop cards ----
  if (mobile) await p.ev(`document.querySelector('[class*="__expand"]')?.click()`);
  await sleep(900);
  r.card = await p.ev(`(() => {
    const card = document.querySelector('#talleres-w-scratch');
    card.scrollIntoView({ block: 'center', behavior: 'instant' });
    const q = (s) => card.querySelector(s);
    const box = (el) => el ? (({ top, bottom, height }) => ({ top: Math.round(top), bottom: Math.round(bottom), height: Math.round(height) }))(el.getBoundingClientRect()) : null;
    const text = (el) => { const rg = document.createRange(); rg.selectNodeContents(el.querySelector('span')); return rg.getBoundingClientRect(); };
    const open = q('[class*="__open"]'), dl = q('a[class*="__download"]:not([class*="__resources"])'), res = q('[class*="__resources"]');
    return { open: box(open), download: box(dl), resources: box(res), resourcesHref: res?.getAttribute('href'), target: res?.getAttribute('target'),
      textGapOpenDownload: Math.round(text(dl).top - text(open).bottom), textGapDownloadResources: Math.round(text(res).top - text(dl).bottom) };
  })()`);
  r.allResources = await p.ev(`[...document.querySelectorAll('article[id^="talleres-"]')].map((a) => ({ id: a.id, href: a.querySelector('[class*="__resources"]')?.getAttribute('href') ?? null, pending: a.querySelector('[class*="__resources"]')?.textContent }))`);
  await sleep(400);
  await p.shot(`${out}/talleres-${name}.png`, mobile ? '#talleres-w-scratch' : '#talleres-w-scratch');

  // ---- the sheet ----
  await p.ev(`document.querySelector('#talleres-w-scratch [class*="__media"]').click()`);
  await sleep(1400);
  r.sheet = await p.ev(`(() => { const d = document.querySelector('dialog[open]'); const a = [...d.querySelectorAll('a')].map((x) => ({ text: x.textContent.trim(), href: x.getAttribute('href'), label: x.getAttribute('aria-label') })); return a; })()`);
  await p.shot(`${out}/ficha-${name}.png`);
  await p.ev(`document.querySelector('dialog[open]').close()`);
  await sleep(500);

  // ---- the band ----
  await p.ev(`document.querySelector('#inauguracion').scrollIntoView({ block: 'center', behavior: 'instant' })`);
  await sleep(700);
  r.band = await p.ev(`(() => { const a = document.querySelector('#inauguracion a'); const b = a.getBoundingClientRect(); const cs = getComputedStyle(a); return { href: a.getAttribute('href'), target: a.getAttribute('target'), label: a.getAttribute('aria-label'), height: Math.round(b.height), bg: cs.backgroundColor, introBg: getComputedStyle(document.querySelector('#intro')).backgroundColor }; })()`);
  await p.shot(`${out}/franja-${name}.png`, '#inauguracion');
  const center = await p.ev(`(() => { const b = document.querySelector('#inauguracion a [class*="__disc"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  if (!mobile) {
    await p.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: center.x, y: center.y });
    await sleep(900);
    await p.shot(`${out}/franja-hover-${name}.png`, '#inauguracion');
    await p.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
  }
  // A video gone from YouTube: its thumbnail comes back as the 120×90 placeholder. Reload and stand that in for Image.
  await p.load(`${base}/almeria-2026`);
  await p.ev(`window.Image = class { constructor() { this.naturalWidth = 120; } set src(v) { window.__probed = v; setTimeout(() => this.onload?.(), 30); } }`);
  await p.ev(`document.querySelector('#inauguracion').scrollIntoView({ block: 'center', behavior: 'instant' })`);
  await sleep(500);
  await p.ev(`document.querySelector('#inauguracion a').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))`);
  await sleep(300);
  await p.ev(`document.querySelector('#inauguracion a').click()`);
  await sleep(900);
  r.gone = await p.ev(`({ probed: window.__probed, url: location.href, note: document.querySelector('#inauguracion [role="status"]').textContent, expanded: document.querySelector('#inauguracion a').getAttribute('aria-expanded'), target: document.querySelector('#inauguracion a').getAttribute('target') })`);
  await p.shot(`${out}/franja-no-disponible-${name}.png`, '#inauguracion');
  report[name] = { ...r, center };
  report[name].errors = p.errors;
  p.close();
}
writeFileSync(`${out}/qa.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
