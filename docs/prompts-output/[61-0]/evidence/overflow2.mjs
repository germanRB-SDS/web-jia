import { open, sleep } from "./cdp.mjs";
const w = Number(process.argv[2] ?? 1280);
const b = await open({ width: w, height: 800 });
await b.load("http://localhost:3000/");
console.log(await b.ev(`(() => { const r = {}; r.before = document.documentElement.scrollWidth; const sec = document.getElementById("experiencias"); sec.style.display = "none"; r.noExp = document.documentElement.scrollWidth; sec.style.display = ""; const out=[]; for (const s of document.querySelectorAll("main > *, body > *")) { const d = s.style.display; s.style.display = "none"; out.push((s.id || s.className).toString().slice(0,40) + ":" + document.documentElement.scrollWidth); s.style.display = d; } r.out = out; return r; })()`));
b.close();
