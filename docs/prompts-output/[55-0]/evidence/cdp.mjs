// Minimal CDP helper for [55-0] QA: real headless Chrome (SwiftShader so WebGL canvases render).
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function open({ width, mobile }) {
  const port = 9600 + (process.pid % 300);
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", `--remote-debugging-port=${port}`, "--no-sandbox", "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", `--user-data-dir=/tmp/jia-55-qa-${process.pid}`, "about:blank"], { stdio: "ignore" });
  let targets = [];
  for (let i = 0; i < 60 && !targets.length; i++) { await sleep(200); targets = (await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).catch(() => [])).filter((t) => t.type === "page"); }
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const errors = [];
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } else if (msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text); else if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") errors.push(msg.params.args.map((a) => a.value ?? a.description).join(" ")); };
  const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (msg) => (msg.error ? rej(new Error(msg.error.message)) : res(msg.result))); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width, height: mobile ? 844 : 900, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile });
  if (mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  const shot = async (file, clipSelector) => {
    const params = { format: "png" };
    if (clipSelector) { const rect = await ev(`(() => { const r = document.querySelector(${JSON.stringify(clipSelector)}).getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height, scale: 1 }; })()`); params.clip = rect; params.captureBeyondViewport = true; }
    const { data } = await send("Page.captureScreenshot", params); writeFileSync(file, Buffer.from(data, "base64"));
  };
  const load = async (url) => { await ev("window.__old = true"); await send("Page.navigate", { url }); for (let i = 0; i < 100; i++) { await sleep(100); if (await ev("!window.__old && document.readyState === 'complete'").catch(() => false)) break; } await sleep(1200); };
  return { send, ev, shot, load, errors, close: () => { ws.close(); chrome.kill(); } };
}
