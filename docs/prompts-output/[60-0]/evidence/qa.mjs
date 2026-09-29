// [60-0] QA: picture-only experience cards and the window light playing twice per arrival.
import { open, sleep } from "./cdp.mjs";
const base = process.env.BASE ?? "http://localhost:3000/";
const dir = decodeURIComponent(new URL(".", import.meta.url).pathname);
for (const [width, mobile] of [[1440, false], [390, true]]) {
  const b = await open({ width, mobile });
  // Every WebGL draw is stamped: the light asks for frames only while a cycle is playing.
  await b.send("Page.addScriptToEvaluateOnNewDocument", { source: `window.__draws=[];for(const C of [WebGLRenderingContext,WebGL2RenderingContext]){for(const k of ['drawArrays','drawElements']){const o=C.prototype[k];C.prototype[k]=function(...a){window.__draws.push(performance.now());return o.apply(this,a)}}}` });
  await b.load(base);
  const cards = await b.ev(`[...document.querySelectorAll('#experiencias article')].map(a => { const m = a.querySelector('[data-opens]'); const h = a.querySelector('h3'); const r = h.getBoundingClientRect(); return { title: h.textContent, titleVisible: r.width > 2 && r.height > 2, verFicha: /ver ficha/i.test(a.innerText), role: m.getAttribute('role'), tab: m.tabIndex, label: m.getAttribute('aria-label') }; })`);
  const lede = await b.ev(`document.querySelector('#experiencias p')?.textContent`);
  await b.ev(`document.querySelector('#experiencias').scrollIntoView({block:'start'})`);
  await sleep(800);
  await b.shot(`${dir}experiencias-${width}.png`, "#experiencias");
  // Keyboard: focus the picture, Enter opens the sheet.
  await b.ev(`document.querySelector('#experiencias [data-opens]').focus()`);
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await sleep(500);
  const dialog = await b.ev(`!!document.querySelector('dialog[open]')`);
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  const cycles = async () => {
    await b.ev(`window.__draws=[]`);
    await b.ev(`document.querySelector('[data-classroom]').scrollIntoView({block:'center'})`);
    await sleep(16000); // 2 × (5 s + 1 s) and room for a third that must not come
    return b.ev(`(() => { const d = window.__draws; if (!d.length) return { cycles: 0 }; let c = 1; for (let i = 1; i < d.length; i++) if (d[i] - d[i-1] > 600) c++; return { cycles: c, frames: d.length, span: Math.round(d.at(-1) - d[0]), lastAgo: Math.round(performance.now() - d.at(-1)) }; })()`);
  };
  await b.ev(`scrollTo(0,0)`); await sleep(800);
  const first = await cycles();
  await b.ev(`scrollTo(0,0)`); await sleep(1000);
  const second = await cycles();
  console.log(JSON.stringify({ width, lede, cards, dialog, first, second, errors: b.errors }, null, 1));
  b.close();
}
