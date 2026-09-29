import { open, sleep } from "./cdp.mjs";
const b = await open({ width: 1440 });
const seen = [];
for (let i = 0; i < 60; i++) { await b.load("http://127.0.0.1:3055/"); seen.push(+(await b.ev(`document.querySelector('[aria-roledescription="carousel"] p[aria-live]').innerText.split('\\n').pop()`)).split(" ")[0]); }
const hist = {}; for (const s of seen) hist[s] = (hist[s] ?? 0) + 1;
console.log(JSON.stringify({ n: seen.length, distinct: Object.keys(hist).length, ones: hist[1] ?? 0, max: Math.max(...Object.values(hist)), newMembers: seen.filter((s) => s >= 30).length, seen }));
b.close();
