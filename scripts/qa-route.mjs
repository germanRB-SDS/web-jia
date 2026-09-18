/**
 * Evidence for the Jornadas road (JIA-2026-09-18-08) via the Chrome DevTools Protocol, same
 * approach as qa-screenshots.mjs. For each viewport it scrolls the road into view, waits for
 * the timeline states (initial, a middle stop, done) and captures the section; it also
 * captures prefers-reduced-motion and the GLB-failure fallback, and collects console errors.
 *
 * Usage: node scripts/qa-route.mjs [origin] [outDir]
 *   default origin http://localhost:3005, outDir docs/prompts-output/JIA-2026-09-18-08/evidence
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const ORIGIN = process.argv[2] ?? "http://localhost:3005";
const OUT = process.argv[3] ?? "docs/prompts-output/JIA-2026-09-18-10/evidence";
const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1180, height: 760 },
  // SwiftShader cannot keep the 700 px canvas at speed; the tablet run captures the initial state only.
  { name: "tablet", width: 768, height: 1024, mobile: true, quick: true },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  mkdirSync(OUT, { recursive: true });
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, "--no-sandbox", "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--user-data-dir=/tmp/jia-qa-route-profile", "about:blank"], { stdio: "ignore" });
  const report = { origin: ORIGIN, shots: [], console: [], timings: {} };
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
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
      else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) report.console.push({ type: msg.params.type, text: msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ") });
      else if (msg.method === "Runtime.exceptionThrown") report.console.push({ type: "exception", text: msg.params.exceptionDetails.text + " " + (msg.params.exceptionDetails.exception?.description ?? "") });
    };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const n = ++id; pending.set(n, (msg) => (msg.error ? rej(new Error(`${method}: ${msg.error.message}`)) : res(msg.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
    const evaluate = async (expression) => {
      const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ""} in: ${expression.slice(0, 160)}`);
      return r.result.value;
    };
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");
    await send("Network.setCacheDisabled", { cacheDisabled: true });

    const ROUTE = "#jornadas-mapa > div:last-child";
    const waitFor = (cond, ms = 30000) => evaluate(`new Promise((res) => { const t0 = performance.now(); const t = setInterval(() => { if (${cond}) { clearInterval(t); res(performance.now() - t0); } else if (performance.now() - t0 > ${ms}) { clearInterval(t); res(-1); } }, 60); })`);
    const stateOf = () => evaluate(`document.querySelector(${JSON.stringify(ROUTE)})?.dataset.state`);
    const visibleLabels = () => evaluate(`[...document.querySelectorAll(${JSON.stringify(ROUTE + ' li[data-visible="true"]')})].length`);
    const shot = async (name, mode = "section") => {
      await evaluate(`(async () => { await document.fonts.ready; return true; })()`);
      const rect = await evaluate(`(() => { const el = ${mode === "section" ? "document.querySelector('#jornadas').firstElementChild" : `document.querySelector(${JSON.stringify(ROUTE)})`}; const r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }; })()`);
      // captureBeyondViewport clips in document coordinates.
      const clip = { x: rect.x, y: rect.y, width: rect.width, height: Math.min(rect.height, 4000), scale: 1 };
      const { data } = await send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: true });
      writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, "base64"));
      report.shots.push({ name, ...clip, state: await stateOf(), labels: await visibleLabels() });
      console.log(name, JSON.stringify(clip), await stateOf());
    };
    const open = async (vp, { reduced = false, blockGlb = false } = {}) => {
      await send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: Boolean(vp.mobile) });
      await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
      await send("Network.setBlockedURLs", { urls: blockGlb ? ["*jia-carruaje.glb"] : [] });
      await send("Page.navigate", { url: `${ORIGIN}/` });
      await evaluate(`new Promise((res) => { const t = setInterval(() => { if (document.querySelector('nav button[aria-expanded]') && window.__next_f) { clearInterval(t); res(true); } }, 50); setTimeout(() => { clearInterval(t); res(false); }, 8000); })`);
      await evaluate(`document.querySelector(${JSON.stringify(ROUTE)}).scrollIntoView({ block: "center", behavior: "instant" }); true`);
      await sleep(300);
    };

    for (const vp of VIEWPORTS) {
      await open(vp);
      const t = await waitFor(`document.querySelector(${JSON.stringify(ROUTE)})?.dataset.state === "playing"`, 20000);
      report.timings[`${vp.name}-start-ms`] = t;
      await sleep(1400);
      await shot(`${vp.name}-01-inicio`);
      if (vp.quick) continue;
      const t3 = await waitFor(`[...document.querySelectorAll(${JSON.stringify(ROUTE + ' li[data-visible="true"]')})].length >= 3`, 120000);
      report.timings[`${vp.name}-stop3-ms`] = t3;
      await sleep(250);
      await shot(`${vp.name}-02-parada-3`);
      const td = await waitFor(`document.querySelector(${JSON.stringify(ROUTE)})?.dataset.state === "done"`, 180000);
      report.timings[`${vp.name}-done-ms`] = td;
      await sleep(500);
      await shot(`${vp.name}-03-final`);
      if (vp.name === "desktop") {
        // Replay (icon button, only shown when done) must reset labels and play again.
        report.replayButton = await evaluate(`(() => { const b = document.querySelector(${JSON.stringify(ROUTE + " button")}); return b ? { label: b.getAttribute("aria-label"), text: b.textContent.trim(), hasSvg: Boolean(b.querySelector("svg")) } : null; })()`);
        await evaluate(`document.querySelector(${JSON.stringify(ROUTE + " button")}).click(); true`);
        await sleep(1500);
        report.replayLabelsAfter1500ms = await visibleLabels();
        report.replayState = await stateOf();
        report.stopCount = await evaluate(`document.querySelectorAll(${JSON.stringify(ROUTE + " li")}).length`);
        report.stopYs = await evaluate(`[...document.querySelectorAll(${JSON.stringify(ROUTE + " li")})].map((l) => Math.round(parseFloat(l.style.top)))`);
        report.canvasBytes = await evaluate(`(() => { const c = document.querySelector(${JSON.stringify(ROUTE + " canvas")}); return { css: [c.clientWidth, c.clientHeight], buffer: [c.width, c.height] }; })()`);
      }
    }
    await open(VIEWPORTS[0], { reduced: true });
    await waitFor(`document.querySelector(${JSON.stringify(ROUTE)})?.dataset.state === "static"`, 15000);
    await sleep(500);
    await shot("desktop-05-movimiento-reducido");
    await open(VIEWPORTS[0], { blockGlb: true });
    await waitFor(`["static","fallback"].includes(document.querySelector(${JSON.stringify(ROUTE)})?.dataset.state)`, 15000);
    await sleep(500);
    await shot("desktop-06-sin-glb");
    // Intro video (JIA-2026-09-18-10): sits right before #programa, never taller than the rider band, round controls work.
    for (const vp of [VIEWPORTS[0], VIEWPORTS[3]]) {
      await open(vp);
      await evaluate(`document.querySelector('#intro').scrollIntoView({ block: "center", behavior: "instant" }); true`);
      await waitFor(`document.querySelector('#intro video')?.readyState >= 2`, 20000);
      await sleep(1200);
      report[`intro-${vp.name}`] = await evaluate(`(() => { const i = document.querySelector('#intro'); const v = i.querySelector('video'); const band = document.querySelector('#jornadas').firstElementChild.firstElementChild; const next = i.nextElementSibling?.querySelector('#programa') ?? i.nextElementSibling; return { title: i.querySelector('h3')?.textContent, beforePrograma: Boolean(i.compareDocumentPosition(document.querySelector('#programa')) & Node.DOCUMENT_POSITION_FOLLOWING), nextHasPrograma: Boolean(next && (next.id === 'programa' || next.querySelector?.('#programa'))), width: Math.round(i.getBoundingClientRect().width), viewport: innerWidth, height: Math.round(i.getBoundingClientRect().height), veilHeight: Math.round(band.getBoundingClientRect().height), playing: !v.paused, muted: v.muted, src: v.currentSrc.replace(location.origin, ''), buttons: [...i.querySelectorAll('button')].map((b) => b.getAttribute('aria-label')) }; })()`);
      if (vp.name === "desktop") {
        await evaluate(`[...document.querySelectorAll('#intro button')].at(-1).click(); true`);
        await sleep(400);
        report.introAfterPause = await evaluate(`(() => { const i = document.querySelector('#intro'); return { paused: i.querySelector('video').paused, label: [...i.querySelectorAll('button')].at(-1).getAttribute('aria-label') }; })()`);
        await evaluate(`[...document.querySelectorAll('#intro button')].at(-1).click(); true`);
        await sleep(600);
      }
      const rect = await evaluate(`(() => { const r = document.querySelector('#intro').getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }; })()`);
      const { data } = await send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 1 }, captureBeyondViewport: true });
      writeFileSync(`${OUT}/${vp.name}-08-intro-video.png`, Buffer.from(data, "base64"));
    }
    report.teamLede = await evaluate(`document.querySelector('#como-funcionan h4 + p')?.textContent`);
    // Footer: no badge, studio colophon present.
    await open(VIEWPORTS[0]);
    await evaluate(`document.querySelector('footer').scrollIntoView({ block: "end", behavior: "instant" }); true`);
    await sleep(600);
    report.footer = await evaluate(`(() => { const f = document.querySelector('footer'); const a = f.querySelector('a[href="https://southdesertstudio.com"]'); return { badgeImgs: [...f.querySelectorAll('img')].filter((i) => /jia26|badge/i.test(i.getAttribute('src') || '')).length, studioLink: Boolean(a), studioText: a?.textContent.trim() }; })()`);
    {
      const rect = await evaluate(`(() => { const r = document.querySelector('footer').getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }; })()`);
      const { data } = await send("Page.captureScreenshot", { format: "png", clip: { ...rect, scale: 1 }, captureBeyondViewport: true });
      writeFileSync(`${OUT}/desktop-07-footer.png`, Buffer.from(data, "base64"));
    }
    ws.close();
  } finally {
    chrome.kill();
  }
  writeFileSync(`${OUT}/qa-route-report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ timings: report.timings, console: report.console, replayButton: report.replayButton, replay: report.replayLabelsAfter1500ms, replayState: report.replayState, stopCount: report.stopCount, stopYs: report.stopYs, canvas: report.canvasBytes, footer: report.footer, introDesktop: report["intro-desktop"], introMobile: report["intro-mobile"], introAfterPause: report.introAfterPause, teamLede: report.teamLede }, null, 1));
}

main().catch((e) => { console.error(e); process.exit(1); });
