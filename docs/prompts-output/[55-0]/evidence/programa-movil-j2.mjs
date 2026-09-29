// Phone capture of day 2 of the programme (the day labels are buttons, not tabs).
import { fileURLToPath } from "node:url";
import { open, sleep } from "./cdp.mjs";
const dir = fileURLToPath(new URL(".", import.meta.url));
const b = await open({ width: 390, mobile: true });
await b.load("http://127.0.0.1:3055/");
await b.ev(`document.querySelector('[class*="ProgramaDias"]').scrollIntoView({ block: 'start', behavior: 'instant' }); scrollBy(0, -80); true`);
await b.ev(`document.querySelectorAll('[class*="ProgramaDias"][role="group"] button')[1].click(); true`); await sleep(1200);
await b.shot(`${dir}programa-movil-jornada-2.png`);
b.close();
