// Samples, inside the page, the prints' clock (the WAAPI reveal) against the wagon's own pose.
import { open, sleep } from "./cdp.mjs";
const b = await open({ width: 1440 });
await b.load("http://localhost:3001/");
await b.ev(`document.getElementById("programa").scrollIntoView({ behavior: "instant", block: "start" }); true`);
for (let i = 0; i < 10; i++) {
  await sleep(1000);
  console.log(await b.ev(`(() => {
    const a = document.getAnimations().find((x) => x.effect?.target?.tagName === "path");
    const v = document.querySelector('[data-driver]');
    return JSON.stringify({ driver: v.dataset.driver, z: getComputedStyle(v).zIndex, anim: a ? Math.round(a.currentTime) : null, dash: a ? getComputedStyle(a.effect.target).strokeDashoffset : null, dbg: window.__dbg });
  })()`));
}
console.log(JSON.stringify(b.errors).slice(0, 1500)); b.close();
