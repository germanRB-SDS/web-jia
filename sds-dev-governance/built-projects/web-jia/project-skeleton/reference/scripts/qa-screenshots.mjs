/**
 * Review screenshots via the Chrome DevTools Protocol (no extra dependencies:
 * Node ≥ 22 ships a WebSocket client). Emulates each viewport for real, waits
 * for fonts, hydration and every image, opens the phone menu / a sheet dialog
 * when asked, and captures full pages beyond the viewport.
 *
 * Usage: node scripts/qa-screenshots.mjs [origin]   (default http://localhost:3005)
 * Output: .impeccable/review/*.png
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const ORIGIN = process.argv[2] ?? "http://localhost:3005";
const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = ".impeccable/review";
const PORT = 9333;

const SHOTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "desktop-full", width: 1440, height: 900, full: true },
  { name: "desktop-dialog", width: 1440, height: 900, open: "dialog" },
  { name: "desktop-hover", width: 1440, height: 900, hover: "main nav a[href='#programa']" },
  { name: "desktop-poster", width: 1440, height: 900, hover: "#jornadas figure button" },
  { name: "tablet-full", width: 768, height: 1024, full: true, mobile: true },
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "mobile-full", width: 390, height: 844, full: true, mobile: true },
  { name: "mobile-nav", width: 390, height: 844, mobile: true, open: "nav" },
  { name: "mobile-dialog", width: 390, height: 844, mobile: true, open: "dialog" },
  { name: "mobile-360-full", width: 360, height: 780, full: true, mobile: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  mkdirSync(OUT, { recursive: true });
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=/tmp/jia-qa-profile", "about:blank"], { stdio: "ignore" });
  try {
    let targets = [];
    for (let i = 0; i < 50 && !targets.length; i++) {
      await sleep(200);
      targets = await fetch(`http://localhost:${PORT}/json`).then((r) => r.json()).catch(() => []);
      targets = targets.filter((t) => t.type === "page");
    }
    if (!targets.length) throw new Error("Chrome did not expose a page target");
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0;
    const pending = new Map();
    const events = [];
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
      else if (msg.method) events.push(msg);
    };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const n = ++id; pending.set(n, (msg) => (msg.error ? rej(new Error(`${method}: ${msg.error.message}`)) : res(msg.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
    const evaluate = async (expression) => {
      const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text ?? "evaluate failed");
      return r.result.value;
    };
    const waitLoad = async () => { for (let i = 0; i < 200; i++) { if (events.some((e) => e.method === "Page.loadEventFired")) return; await sleep(50); } };

    await send("Page.enable");
    await send("Runtime.enable");
    // Never reuse a cached page or stylesheet from a previous build.
    await send("Network.enable");
    await send("Network.setCacheDisabled", { cacheDisabled: true });

    for (const shot of SHOTS) {
      events.length = 0;
      await send("Emulation.setDeviceMetricsOverride", { width: shot.width, height: shot.height, deviceScaleFactor: 1, mobile: Boolean(shot.mobile) });
      await send("Page.navigate", { url: `${ORIGIN}/` });
      await waitLoad();
      // Hydration: the nav button toggles only once React owns it.
      await evaluate(`new Promise((res) => { const t = setInterval(() => { if (document.querySelector('nav button[aria-expanded]') && window.__next_f) { clearInterval(t); res(true); } }, 50); setTimeout(() => { clearInterval(t); res(false); }, 5000); })`);
      await sleep(400);
      if (shot.open === "nav") {
        await evaluate(`new Promise((res) => { const b = document.querySelector('nav button[aria-expanded]'); const t = setInterval(() => { if (b.getAttribute('aria-expanded') === 'true') { clearInterval(t); res(true); } else b.click(); }, 250); setTimeout(() => { clearInterval(t); res(false); }, 6000); })`);
      }
      if (shot.open === "dialog") {
        await evaluate(`document.querySelector('#talleres').scrollIntoView(); new Promise((res) => { const b = document.querySelector('button[aria-haspopup="dialog"]'); const t = setInterval(() => { if (document.querySelector('dialog[open]')) { clearInterval(t); res(true); } else b.click(); }, 250); setTimeout(() => { clearInterval(t); res(false); }, 6000); })`);
      }
      if (shot.hover) {
        // Real pointer move so :hover styles and the custom cursor mark render.
        await evaluate(`document.querySelector(${JSON.stringify(shot.hover)}).scrollIntoView({ block: "center", behavior: "instant" }); true`);
        await sleep(300);
        const rect = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(shot.hover)}).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
        await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x, y: rect.y });
        await sleep(500);
      }
      // Fonts and every image (lazy ones forced) before capture.
      await evaluate(`(async () => { for (const img of document.images) img.loading = 'eager'; await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); return true; })()`);
      await sleep(300);
      let clip;
      if (shot.full) {
        const { contentSize } = await send("Page.getLayoutMetrics");
        await send("Emulation.setDeviceMetricsOverride", { width: shot.width, height: Math.ceil(contentSize.height), deviceScaleFactor: 1, mobile: Boolean(shot.mobile) });
        await sleep(300);
        await evaluate(`(async () => { for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); return true; })()`);
        clip = { x: 0, y: 0, width: shot.width, height: Math.ceil(contentSize.height), scale: 1 };
      }
      const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: Boolean(shot.full), clip });
      writeFileSync(`${OUT}/${shot.name}.png`, Buffer.from(data, "base64"));
      console.log(`${shot.name}: ${shot.width}x${clip ? clip.height : shot.height}`);
    }
    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
