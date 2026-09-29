import { open, sleep } from "./cdp.mjs";
const b = await open({ width: 1440, height: 900 });
await b.load("http://localhost:3000/");
const vp = `document.querySelector("[role=region][aria-label='Experiencias de éxito']")`;
await b.ev(`${vp}.scrollIntoView({block:"center", behavior:"instant"})`);
for (let i = 0; i < 16; i++) { console.log(i * 0.5, await b.ev(`${vp}.querySelector("[data-track]").style.transform + " y=" + scrollY`)); await sleep(500); }
b.close();
