// REL-2026-10-15-02: the public page at 1440 (the wagon drives, resources load) and 390 (no wagon layer).
import { open, sleep } from "./cdp.mjs";
const url = "https://jornadasdeinnovacion.com/almeria-2026";
const out = process.argv[2];
const d = await open({ width: 1440 });
await d.load(url);
await d.ev(`document.getElementById("programa").scrollIntoView({ behavior: "instant", block: "start" }); true`);
let seen = null;
for (let i = 0; i < 12; i++) {
  await sleep(1000);
  seen = await d.ev(`JSON.stringify({ driver: document.querySelector('[data-driver]')?.dataset.driver, anim: document.getAnimations().find((x) => x.effect?.target?.tagName === "path")?.currentTime ?? null, failed: performance.getEntriesByType("resource").filter((r) => r.responseStatus >= 400).map((r) => r.name) })`);
  if (JSON.parse(seen).anim > 3500) break;
}
console.log("1440", seen);
if (out) await d.shot(`${out}/prod-1440.png`, '[data-driver]');
console.log("errors", JSON.stringify(d.errors.filter((e) => !/DevTools|PCFSoft/.test(e))));
d.close();
const m = await open({ width: 390, mobile: true });
await m.load(url);
await m.ev(`document.getElementById("programa").scrollIntoView({ behavior: "instant", block: "start" }); true`);
await sleep(2500);
console.log("390", await m.ev(`JSON.stringify({ display: getComputedStyle(document.querySelector('[data-driver]')).display, driver: document.querySelector('[data-driver]').dataset.driver, horse: performance.getEntriesByType("resource").some((r) => r.name.includes("caballo.glb")) })`));
m.close();
