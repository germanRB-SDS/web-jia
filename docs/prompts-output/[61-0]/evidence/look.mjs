// Quick look: node look.mjs <width> <height> [mobile] → screenshot of #experiencias + geometry.
import { open, sleep } from "./cdp.mjs";
const [w, h, m] = process.argv.slice(2);
const b = await open({ width: Number(w), height: Number(h), mobile: m === "mobile" });
await b.load("http://localhost:3000/");
await b.ev(`document.getElementById("experiencias").scrollIntoView({block: "start", behavior: "instant"})`);
await sleep(1500);
const info = await b.ev(`(() => {
  const s = document.getElementById("experiencias").getBoundingClientRect();
  const vp = document.querySelector("[role=region][aria-label='Experiencias de éxito']");
  const r = vp.getBoundingClientRect();
  const f = vp.querySelector("[data-frame]").getBoundingClientRect();
  const p = vp.querySelector("[data-poster]").getBoundingClientRect();
  const head = document.querySelector("#experiencias header").getBoundingClientRect();
  return { section: [s.left, s.top, s.width, s.height], viewport: [r.left, r.top, r.width, r.height], frame: [f.width, f.height], poster: [p.width, p.height], head: [head.left, head.bottom], guardPx: s.width * 0.52, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, sets: vp.querySelectorAll("ul").length };
})()`);
console.log(JSON.stringify(info));
await b.shot(`/private/tmp/claude-501/-Users-hrms-MAC-DEV-PROJECTS-web-jia/b157bb1f-33a7-4aee-a8d4-a022cc2d645e/scratchpad/look-${w}x${h}.png`, "#experiencias");
console.log("errors", b.errors);
b.close();
