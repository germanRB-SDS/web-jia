// 390 px: neither the trail nor the wagon; the 3D layer never loads.
import { open, sleep } from "./cdp.mjs";
const b = await open({ width: 390, mobile: true });
await b.load("http://localhost:3001/");
await b.ev(`document.getElementById("programa").scrollIntoView({ behavior: "instant", block: "start" }); true`);
await sleep(2500);
console.log(await b.ev(`JSON.stringify({ vehicle: getComputedStyle(document.querySelector('[data-driver]')).display, driver: document.querySelector('[data-driver]').dataset.driver, glb: performance.getEntriesByType("resource").some((r) => r.name.includes("caballo.glb")) })`));
b.close();
