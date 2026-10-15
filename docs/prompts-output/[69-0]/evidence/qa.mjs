// [69-0] QA: the wagon and its horse on the «Programa» road. node qa.mjs <out dir> [width]
import { open, sleep } from "./cdp.mjs";
const out = process.argv[2] ?? ".";
const width = Number(process.argv[3] ?? 1440);
const b = await open({ width });
await b.load("http://localhost:3001/");
await b.ev(`document.getElementById("programa").scrollIntoView({ behavior: "instant", block: "start" }); window.scrollBy(0, 120); true`);
const t0 = Date.now();
const info = await b.ev(`(() => { const v = document.querySelector('[class*="vehicle"]'); const r = v?.getBoundingClientRect(); return { display: v && getComputedStyle(v).display, w: r?.width, h: r?.height }; })()`);
console.log("layer", JSON.stringify(info));
const times = (process.argv[4] ?? "1500,3500,5200,6200,7400,8600").split(",").map(Number);
for (const t of times) {
  const wait = t - (Date.now() - t0);
  if (wait > 0) await sleep(wait);
  const at = Date.now() - t0;
  await b.shot(`${out}/frame-${width}-${t}.png`, '[class*="vehicle"]');
  console.log("shot", t, "taken at", at);
}
console.log("errors", JSON.stringify(b.errors));
b.close();
