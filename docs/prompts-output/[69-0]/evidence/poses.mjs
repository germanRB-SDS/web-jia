// Freezes the wagon and poses it at chosen times, then crops the canvas around the horse (debug hook __dbg).
import { open, sleep } from "./cdp.mjs";
import { writeFileSync } from "node:fs";
const out = process.argv[2];
const b = await open({ width: 1440 });
await b.load("http://localhost:3001/");
await b.ev(`document.getElementById("programa").scrollIntoView({ behavior: "instant", block: "start" }); true`);
for (let i = 0; i < 160 && !(await b.ev("Boolean(window.__dbg)")); i++) await sleep(250);
const times = (process.argv[3] ?? "2.0,2.1,2.2,2.3,6.6,6.65,6.7,6.75,6.8").split(",").map(Number);
await b.ev(`window.__dbg.scene.stop(); true`);
for (const t of times) {
  const url = await b.ev(`(() => {
    const sc = window.__dbg.scene;
    // Walk the clock up to t in small steps so the gait phase accumulates as it would.
    sc.lastS = 0; sc.lastT = 0; sc.phase = 0; sc.activity = 1;
    for (let u = 0; u <= ${t}; u += 1 / 60) sc.pose(u);
    sc.renderer.render(sc.scene, sc.camera);
    const { hx, hy } = window.__dbg;
    const c = sc.canvas; const k = c.width / c.clientWidth;
    const o = document.createElement("canvas"); o.width = 360; o.height = 240;
    const g = o.getContext("2d"); g.fillStyle = "#f3e9da"; g.fillRect(0, 0, 360, 240);
    g.drawImage(c, (hx - 90) * k, (hy - 60) * k, 180 * k, 120 * k, 0, 0, 360, 240);
    return o.toDataURL("image/png");
  })()`);
  writeFileSync(`${out}/pose-${t}.png`, Buffer.from(url.split(",")[1], "base64"));
}
b.close();
