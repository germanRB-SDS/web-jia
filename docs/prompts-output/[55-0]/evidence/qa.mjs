// [55-0] QA: node "docs/prompts-output/[55-0]/evidence/qa.mjs" <width> [mobile]  (out/ served on 127.0.0.1:3055)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { open, sleep } from "./cdp.mjs";
const width = +(process.argv[2] ?? 1440); const mobile = process.argv[3] === "mobile";
const dir = fileURLToPath(new URL(".", import.meta.url)); const tag = mobile ? "movil" : "escritorio";
const URL0 = "http://127.0.0.1:3055/";
const b = await open({ width, mobile });
const out = { width, mobile, loads: [], walk: [], program: null, workshops: [] };
const ROOT = '[aria-roledescription="carousel"]';
const state = () => b.ev(`(() => { const r = document.querySelector('${ROOT}'); const cube = r.querySelector('[class*="cube"]'); const rot = parseFloat(cube.style.getPropertyValue('--cube-rot')) || 0; const faces = [...r.querySelectorAll('[data-cube-side="turn"]')]; const fi = ((Math.round(-rot / 90) % 4) + 4) % 4; const img = faces[fi]?.querySelector('img'); return { caption: r.querySelector('p[aria-live]').innerText.replace(/\\n/g, ' | '), front: img?.getAttribute('src').split('/').pop(), loaded: !!(img?.complete && img.naturalWidth) }; })()`);

// 1. Cube: several page loads, the first member must vary.
for (let i = 0; i < 6; i++) {
  await b.load(URL0);
  await b.ev(`document.querySelector('${ROOT}').scrollIntoView({ block: 'center', behavior: 'instant' }); true`);
  await sleep(400);
  out.loads.push(await state());
  if (i === 0) await b.shot(`${dir}cubo-${tag}-carga.png`, ROOT);
}
// 2. Walk the whole sequence with "next" (stops autoplay), collecting every front.
const total = +out.loads[0].caption.match(/de (\d+)/i)[1];
for (let i = 0; i <= total; i++) {
  out.walk.push(await state());
  await b.ev(`document.querySelectorAll('${ROOT} button')[1].click()`);
  await sleep(1150);
}
const fronts = out.walk.slice(0, total).map((s) => s.front);
out.cube = { total, distinctFronts: new Set(fronts).size, allLoaded: out.walk.every((s) => s.loaded), wrapsToStart: out.walk[total].caption === out.walk[0].caption, newCardsSeen: [59, 60, 61, 62, 65, 66, 67].filter((n) => fronts.some((f) => f?.startsWith(`card-${n}-`))), firstCaptions: out.loads.map((l) => l.caption) };
// show a new member for the screenshot
for (let i = 0; i < total && !(await state()).front.startsWith("card-6"); i++) { await b.ev(`document.querySelectorAll('${ROOT} button')[1].click()`); await sleep(1150); }
await b.shot(`${dir}cubo-${tag}-integrante-nuevo.png`, ROOT);

// 3. Programme.
out.program = await b.ev(`[...document.querySelectorAll('[class*="ProgramaDias"] ol, [class*="ProgramaDias"] ul')].map(l => [...l.querySelectorAll(':scope > li')].map(li => li.innerText.replace(/\\s+/g, ' ').trim())).filter(x => x.length)`);
await b.ev(`document.querySelector('[class*="ProgramaDias"]').scrollIntoView({ block: 'start', behavior: 'instant' }); scrollBy(0, -80); true`); await sleep(600);
await b.shot(`${dir}programa-${tag}.png`);
if (mobile) { await b.ev(`[...document.querySelectorAll('[class*="ProgramaDias"][role="group"] button')][1]?.click(); true`); await sleep(900); await b.shot(`${dir}programa-${tag}-jornada-2.png`); }

// 4. Workshops: card image, then the sheet's flip card once it has turned.
const n = await b.ev(`document.querySelectorAll('[data-workshop-body]').length`);
await b.ev(`document.querySelector('[data-workshop-body]').closest('article').scrollIntoView({ block: 'center', behavior: 'instant' }); true`); await sleep(700);
await b.shot(`${dir}talleres-${tag}-tarjetas.png`);
for (let i = 0; i < n; i++) {
  const card = await b.ev(`(() => { const a = document.querySelectorAll('[data-workshop-body]')[${i}].closest('article'); return { title: a.querySelector('h3')?.innerText, cardSrc: a.querySelector('img')?.currentSrc.split('/').pop() }; })()`);
  await b.ev(`[...document.querySelectorAll('[data-workshop-body]')[${i}].closest('article').querySelectorAll('button')].find(x => x.textContent.trim() === 'Ver ficha').click()`);
  await sleep(3200);
  const sheet = await b.ev(`(() => { const d = document.querySelector('dialog[open]'); if (!d) return null; const imgs = [...d.querySelectorAll('img')].map(i => ({ src: i.currentSrc.split('/').pop(), visible: i.getBoundingClientRect().width > 0 && !!i.naturalWidth })); return { imgs }; })()`);
  out.workshops.push({ ...card, sheet });
  await b.shot(`${dir}talleres-${tag}-ficha-${i + 1}.png`);
  await b.ev(`[...document.querySelectorAll('dialog[open] button')].find(x => x.textContent.trim() === 'Cerrar' || x.getAttribute('aria-label') === 'Cerrar')?.click(); true`);
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await sleep(500);
}
out.overflowX = await b.ev(`document.documentElement.scrollWidth > innerWidth`);
out.errors = b.errors;
writeFileSync(`${dir}qa-${tag}.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ cube: out.cube, program: out.program, workshops: out.workshops.map((w) => ({ t: w.title, card: w.cardSrc, sheet: w.sheet?.imgs.map((x) => x.src) })), overflowX: out.overflowX, errors: out.errors }, null, 1));
b.close();
