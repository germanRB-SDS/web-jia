/**
 * Evidence for the team cube (JIA-2026-09-18-10, components/cube-carousel) via the Chrome DevTools
 * Protocol: real pointer events for the drag, the whole sequence walked with the "next" button
 * (every front image must be loaded, all items distinct, and the order must wrap), arrow keys,
 * idle autoplay and horizontal overflow.
 *
 * Usage: node scripts/qa-cube.mjs [url] [outPrefix] [width] [height]
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const [url = "http://localhost:3005/", prefix = "docs/prompts-output/JIA-2026-09-18-10/evidence/cubo-desktop", W = "1440", H = "900"] = process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9800 + Math.floor(Math.random() * 100);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, "--no-sandbox", "--hide-scrollbars", `--user-data-dir=/tmp/jia-qa-cube-${PORT}`, "about:blank"], { stdio: "ignore" });
const out = { logs: [] };
try {
  let targets = [];
  for (let i = 0; i < 50 && !targets.length; i++) { await sleep(200); targets = (await fetch(`http://localhost:${PORT}/json`).then((r) => r.json()).catch(() => [])).filter((t) => t.type === "page"); }
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) out.logs.push(msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ")); else if (msg.method === "Runtime.exceptionThrown") out.logs.push("EXC " + (msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text)); };
  const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (msg) => (msg.error ? rej(new Error(msg.error.message)) : res(msg.result))); ws.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
  await send("Page.enable"); await send("Runtime.enable");
  const mobile = +W < 800;
  await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: mobile ? 2 : 1, mobile });
  await send("Page.navigate", { url });
  await sleep(3000);
  const STAGE = '[class*="CubeCarousel-module"][class*="stage"]';
  const ROOT = '[aria-roledescription="carousel"]';
  await evaluate(`document.querySelector('${ROOT}').scrollIntoView({ block: "center", behavior: "instant" }); true`);
  await sleep(800);
  const state = () => evaluate(`(() => { const r = document.querySelector('${ROOT}'); const cube = r.querySelector('[class*="cube"]'); const rot = parseFloat(cube.style.getPropertyValue('--cube-rot')) || 0; const faces = [...r.querySelectorAll('[class*="face__"], [class*="__face"]')].filter((f) => f.dataset.cubeAngle !== undefined && !/faceBody/.test(f.className)); const p = -rot / 90; const fi = ((Math.round(p) % 4) + 4) % 4; const img = faces[fi]?.querySelector('img'); return { rot, caption: r.querySelector('p[aria-live]').innerText.replace(/\\n/g, ' | '), frontSrc: img?.currentSrc.split('/').pop(), loaded: img?.complete && img.naturalWidth > 0, live: r.querySelector('p[aria-live]').getAttribute('aria-live') }; })()`);
  const shot = async (name) => { const rect = await evaluate(`(() => { const r = document.querySelector('${ROOT}').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`); const { data } = await send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 1 }, captureBeyondViewport: true }); writeFileSync(`${prefix}-${name}.png`, Buffer.from(data, "base64")); };
  out.initial = await state();
  await shot("01-reposo");
  // Autoplay: wait for one idle turn.
  await sleep(3200);
  out.afterAutoplay = await state();
  // Drag left by ~0.5 cube widths, capture mid-drag, release.
  const box = await evaluate(`(() => { const r = document.querySelector('${STAGE}').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; })()`);
  const mouse = (type, x, y, buttons = 1) => send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons, clickCount: 1 });
  await mouse("mouseMoved", box.x + 80, box.y, 0);
  await mouse("mousePressed", box.x + 80, box.y);
  for (let i = 1; i <= 12; i++) { await mouse("mouseMoved", box.x + 80 - i * 12, box.y); await sleep(16); }
  await sleep(450);
  out.midDrag = await state();
  await shot("02-arrastre");
  await mouse("mouseReleased", box.x + 80 - 144, box.y, 0);
  await sleep(1300);
  out.afterDrag = await state();
  await shot("03-tras-soltar");
  // Walk the whole sequence with the next button: every front image must match its caption and wrap to the start.
  const total = await evaluate(`document.querySelectorAll('${ROOT} ul li').length`);
  const names = await evaluate(`[...document.querySelectorAll('${ROOT} ul li')].map((l) => l.textContent.split(',')[0].trim())`);
  const seen = []; let mismatches = 0; let notLoaded = 0;
  for (let i = 0; i < total + 2; i++) {
    await evaluate(`document.querySelector('${ROOT} button:last-of-type').click(); true`);
    await sleep(1150);
    const s = await state();
    seen.push(s.caption.split(' | ')[0]);
    if (!s.loaded) notLoaded++;
  }
  out.total = total; out.walk = { distinct: new Set(seen).size, wrapsToSameOrder: seen.slice(0, 2).join() === seen.slice(total, total + 2).join(), orderMatchesList: seen.slice(0, total).every((n, i) => names.includes(n)), notLoaded };
  out.final = await state();
  // Keyboard: ArrowLeft goes back.
  await evaluate(`document.querySelector('${ROOT} button').focus(); true`);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowLeft", code: "ArrowLeft", windowsVirtualKeyCode: 37 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowLeft", code: "ArrowLeft", windowsVirtualKeyCode: 37 });
  await sleep(1200);
  out.afterArrowLeft = await state();
  out.overflowX = await evaluate(`document.documentElement.scrollWidth > innerWidth`);
  await shot("04-final");
  ws.close();
} finally { chrome.kill(); }
writeFileSync(`${prefix}-report.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
