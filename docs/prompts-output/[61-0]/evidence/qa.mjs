// [61-0] QA — node qa.mjs <width> <height> [mobile] [reduce]. Prints a JSON report; screenshots into ./
import { open, sleep } from "./cdp.mjs";
const [W, H, ...flags] = process.argv.slice(2);
const mobile = flags.includes("mobile"), reduce = flags.includes("reduce");
const tag = `${W}x${H}${mobile ? "-m" : ""}${reduce ? "-rm" : ""}`;
const b = await open({ width: +W, height: +H, mobile, reduce });
await b.load("http://localhost:3000/");
const R = {};
const vpSel = `document.querySelector("[role=region][aria-label='Experiencias de éxito']")`;
await b.ev(`${vpSel}.scrollIntoView({block: "center", behavior: "instant"})`);
await sleep(1500);
const geo = () => b.ev(`(() => { const vp = ${vpSel}; const r = vp.getBoundingClientRect(); const s = document.getElementById("experiencias").getBoundingClientRect();
  return { vp: { l: r.left, t: r.top, w: r.width, h: r.height }, sec: { l: s.left, w: s.width, t: s.top, b: s.bottom }, tf: vp.querySelector("[data-track]").style.transform }; })()`);
const g = await geo();
R.viewport = g.vp; R.sectionW = g.sec.w;
R.guard = { vpLeft: g.vp.l, photoGuard52: g.sec.w * 0.52, ok: +W < 1280 || g.vp.l >= g.sec.w * 0.52 - 0.5 };
R.fitsInSection = g.vp.t >= g.sec.t - 1 && g.vp.t + g.vp.h <= g.sec.b + 60;
// 1. order, completeness, alignment in the window
R.posters = await b.ev(`(() => { const vp = ${vpSel}; const real = [...vp.querySelectorAll("button[data-poster]")];
  return { count: real.length, labels: real.map(x => x.getAttribute("aria-label").split(":")[1].split(".")[0].trim()),
    srcs: real.map(x => (x.querySelector("img").currentSrc.match(/exito-(\\d)/) || [])[1]).join(""),
    tabbable: vp.querySelectorAll("button").length, hiddenSets: vp.querySelectorAll("ul[aria-hidden=true]").length,
    ids: new Set([...vp.querySelectorAll("[id]")].map(e => e.id)).size }; })()`);
await sleep(1500);
const align = () => b.ev(`(() => { const vp = ${vpSel}; return [...vp.querySelectorAll("[data-frame]")].slice(7, 14).map(f => { const fr = f.getBoundingClientRect(); const p = f.querySelector("[data-poster]").getBoundingClientRect(); const i = f.querySelector("img");
  return { l: +((p.left - fr.left) / fr.width * 100).toFixed(2), t: +((p.top - fr.top) / fr.height * 100).toFixed(2), ratio: +(p.width / p.height).toFixed(3), loaded: i.complete && i.naturalWidth > 0, fw: fr.width, fh: +fr.height.toFixed(2) }; }); })()`);
const a1 = await align(); await sleep(reduce ? 300 : 2500); const a2 = await align();
R.alignment = { first: a1[0], sameEveryFrame: a1.every(x => x.l === a1[0].l && x.t === a1[0].t), stableOverTime: JSON.stringify(a1.map(x => [x.l, x.t])) === JSON.stringify(a2.map(x => [x.l, x.t])), allLoaded: a1.every(x => x.loaded), ratio: a1[0].ratio };
// 2. drift
const t1 = (await geo()).tf; await sleep(3000); const t2 = (await geo()).tf;
const px = (t) => +(t.match(/translate3d\((-?[\d.]+)px/) || [0, 0])[1];
R.drift = { moved3s: +(px(t1) - px(t2)).toFixed(1), expect: reduce ? 0 : "≈ -54 (18 px/s, left to right)" };
// 3. scroll width
R.scroll = await b.ev(`(() => { const d = document.documentElement; const r = { sw: d.scrollWidth, cw: d.clientWidth }; const s = document.getElementById("experiencias"); s.style.display = "none"; r.swWithoutSection = d.scrollWidth; s.style.display = ""; return r; })()`);
// 4. the seam: the picture at x and at x + one period is the same (drag by a period / gain)
if (!mobile) {
  await b.ev(`document.querySelector("[aria-label='Pausar la película']")?.click()`); await sleep(700);
  const vp = (await geo()).vp;
  const clip = { x: vp.l, y: vp.t, width: vp.w, height: vp.h, scale: 1 };
  const cap = async () => (await b.send("Page.captureScreenshot", { format: "png", clip: { ...clip, y: clip.y + await b.ev("scrollY") } })).data;
  const P = a1[0].fw * 7; const y = vp.t + vp.h / 2;
  const drag = async (dist, steps = 40) => { const x0 = vp.l + vp.w * 0.8; await b.send("Input.dispatchMouseEvent", { type: "mousePressed", x: x0, y, button: "left", clickCount: 1 }); for (let k = 1; k <= steps; k++) await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: x0 - dist * k / steps, y, button: "left", buttons: 1 }); await sleep(250); await b.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: x0 - dist, y, button: "left", clickCount: 1 }); };
  // Two whole periods, dragged slowly in steps of 1/16 of a module: at every step the track must cover the whole
  // viewport, and the painted offset must move by the step or wrap by exactly one period (never anything else).
  const cover = () => b.ev(`(() => { const vp = ${vpSel}; const r = vp.getBoundingClientRect(); const t = vp.querySelector("[data-track]").getBoundingClientRect(); return { covers: t.left <= r.left + 0.5 && t.right >= r.right - 0.5, tf: vp.querySelector("[data-track]").style.transform }; })()`);
  const steps = []; let prev = px((await cover()).tf); let bad = 0, wraps = 0, uncovered = 0;
  const stepPx = a1[0].fw / 16 / 1.6;
  const x0 = vp.l + vp.w * 0.85;
  await b.send("Input.dispatchMouseEvent", { type: "mousePressed", x: x0, y, button: "left", clickCount: 1 });
  let cur = x0;
  for (let k = 1; k <= 7 * 16 * 2; k++) {
    cur -= stepPx; if (cur < vp.l + 40) { await b.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: cur, y, button: "left", clickCount: 1 }); await sleep(30); cur = x0; await b.send("Input.dispatchMouseEvent", { type: "mousePressed", x: cur, y, button: "left", clickCount: 1 }); await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: cur - 7, y, button: "left", buttons: 1 }); cur -= 7; prev = px((await cover()).tf); continue; }
    await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: cur, y, button: "left", buttons: 1 });
    const c = await cover(); const now = px(c.tf); const d = prev - now;
    if (!c.covers) uncovered++;
    if (Math.abs(d - stepPx * 1.6) > 1.5) { if (Math.abs(Math.abs(d - stepPx * 1.6) - P) < 1.5) wraps++; else { bad++; steps.push(+d.toFixed(2)); } }
    prev = now;
  }
  await b.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: cur, y, button: "left", clickCount: 1 });
  await sleep(1500);
  R.loop = { period: P, samples: 224, wrapsByExactlyOnePeriod: wraps, otherJumps: bad, jumpSample: steps.slice(0, 5), uncovered, dialogOpenedByDrag: await b.ev(`!!document.querySelector("dialog[open]")`) };
  // throw: a quick flick to the left keeps moving after release
  const tq = px((await geo()).tf); const x1 = vp.l + vp.w * 0.7;
  await b.send("Input.dispatchMouseEvent", { type: "mousePressed", x: x1, y, button: "left", clickCount: 1 });
  for (let k = 1; k <= 6; k++) { await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: x1 - 25 * k, y, button: "left", buttons: 1 }); await sleep(8); }
  await b.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: x1 - 150, y, button: "left", clickCount: 1 });
  const tr = px((await geo()).tf); await sleep(900); const tr2 = px((await geo()).tf);
  R.throw = { duringDrag: +(tq - tr).toFixed(0), afterRelease: +(tr - tr2).toFixed(0), note: "positive = moved left (forward)" };
  // drag right moves it back
  await drag(-120); await sleep(50);
  R.dragRight = { moved: +(px((await geo()).tf) - tr2).toFixed(0), note: "negative translate change = moved right" };
  await b.ev(`document.querySelector("[aria-label='Reanudar la película']")?.click()`); await sleep(300);
}
// 5. the fade takes no click: a point just inside the viewport's left end
R.fadeHit = await b.ev(`(() => { const r = ${vpSel}.getBoundingClientRect(); const el = document.elementFromPoint(r.left + 6, r.top + r.height / 2); return el ? (el.closest("[data-poster]") ? "POSTER" : el.className.toString().slice(0, 40)) : null; })()`);
await b.shot(`reel-${tag}.png`);
// 6. viewer: open by click on the poster nearest the middle
const pick = await b.ev(`(() => { const vp = ${vpSel}; const r = vp.getBoundingClientRect(); const c = r.left + r.width * 0.6; let best = null; for (const p of vp.querySelectorAll("[data-poster]")) { const q = p.getBoundingClientRect(); if (q.left > r.left + 60 && q.right < r.right) { const d = Math.abs(q.left + q.width / 2 - c); if (!best || d < best.d) best = { d, x: q.left + q.width / 2, y: q.top + q.height / 2, i: +p.closest("[data-frame]").dataset.index }; } } return best; })()`);
const click = async (x, y) => { if (mobile) { await b.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await b.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); } else { await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y }); await b.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 }); await b.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 }); } };
const scrollBefore = await b.ev("scrollY");
await click(pick.x, pick.y); await sleep(500);
const V = () => b.ev(`(() => { const d = document.querySelector("dialog[open]"); if (!d) return null; const i = d.querySelector("img").getBoundingClientRect(); const btn = d.querySelector("button"); const x = btn.getBoundingClientRect();
  return { src: (d.querySelector("img").currentSrc.match(/exito-(\\d)-(\\d+)/) || []).slice(1).join("@"), img: { l: Math.round(i.left), t: Math.round(i.top), w: Math.round(i.width), h: Math.round(i.height), ratio: +(i.width / i.height).toFixed(3) }, x: { l: Math.round(x.left), t: Math.round(x.top), w: x.width, h: x.height, inView: x.left >= 0 && x.top >= 0 && x.right <= innerWidth && x.bottom <= innerHeight, name: btn.getAttribute("aria-label") }, focus: document.activeElement === d.querySelector("button"), vw: innerWidth, vh: innerHeight, wPctVw: +(i.width / innerWidth * 100).toFixed(1), hPctVh: +(i.height / innerHeight * 100).toFixed(1) }; })()`);
const v = await V(); R.viewer = { opened: !!v, expectPoster: pick.i + 1, ...v };
await b.shot(`viewer-${tag}.png`);
R.viewerPausesStrip = await (async () => { await sleep(700); const a = px((await geo()).tf); await sleep(1500); return Math.abs(a - px((await geo()).tf)) < 0.5; })();
if (v) {
  if (!mobile) {
    // click on the image keeps it open
    await click(v.img.l + v.img.w / 2, v.img.t + v.img.h / 2); await sleep(400);
    R.clickImageKeepsOpen = !!(await V());
    // pointer inside the image (armed) → to the X → stays; then out → closes after ~150 ms
    await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: v.x.l + 22, y: v.x.t + 22 }); await sleep(400);
    R.moveToXKeepsOpen = !!(await V());
    await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: v.img.l - 40, y: v.img.t + v.img.h / 2 }); await sleep(80);
    R.leaveStillOpenAt80ms = !!(await V());
    await sleep(500); R.leaveClosed = !(await V());
    await sleep(300);
    // not armed: open, the pointer stays outside → does not close
    await click(pick.x, pick.y); await sleep(400);
    await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 8, y: 8 }); await sleep(600);
    R.outsideBeforeEnteringKeepsOpen = !!(await V());
    // back-ground click closes
    await click(8, 8); await sleep(500); R.groundClickCloses = !(await V());
    // Escape closes
    await click(pick.x, pick.y); await sleep(400);
    await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 }); await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await sleep(500); R.escapeCloses = !(await V());
    R.focusBackTo = await b.ev(`document.activeElement.getAttribute("aria-label")?.slice(0, 40)`);
  } else {
    await click(v.x.l + 22, v.x.t + 22); await sleep(500); R.xCloses = !(await V());
    await click(pick.x, pick.y); await sleep(500);
    await click(6, 6); await sleep(500); R.groundTapCloses = !(await V());
  }
}
R.scrollKept = Math.abs((await b.ev("scrollY")) - scrollBefore) < 1;
R.htmlOverflowRestored = await b.ev(`document.documentElement.style.overflow === ""`);
// 7. keyboard: focus each real poster; it must be whole on the clear side
R.keyboard = [];
for (let i = 0; i < 7; i++) {
  await b.ev(`(() => { const btn = ${vpSel}.querySelectorAll("button[data-poster]")[${i}]; btn.focus(); })()`);
  // programmatic focus is not focus-visible: simulate the keyboard path instead
  if (i === 0) { await b.ev(`document.activeElement.blur()`); await b.ev(`${vpSel}.querySelectorAll("button[data-poster]")[0].focus()`); }
}
// Real Tab walk
await b.ev(`(() => { const first = ${vpSel}.querySelectorAll("button[data-poster]")[0]; const before = document.createElement("button"); before.id = "qa-before"; first.closest("ul").parentElement.parentElement.before(before); before.focus(); })()`);
for (let i = 0; i < 7; i++) {
  await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }); await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await sleep(reduce ? 150 : 900);
  R.keyboard.push(await b.ev(`(() => { const a = document.activeElement; const vp = ${vpSel}.getBoundingClientRect(); const fade = ${vpSel}.querySelector("span").getBoundingClientRect().width; const r = a.getBoundingClientRect();
    return { i: a.closest("[data-frame]")?.dataset.index, fv: a.matches(":focus-visible"), clear: r.left >= vp.left + fade - 0.5 && r.right <= vp.right + 0.5 }; })()`));
}
await b.ev(`document.getElementById("qa-before")?.remove()`);
R.keyboardOk = R.keyboard.every((k, i) => k.i === String(i) && k.fv && k.clear);
await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" }); await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
await sleep(500); const kv = await V(); R.enterOpens = kv?.src?.startsWith("7") ?? false; R.enterFocusOnX = kv?.focus;
await b.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 }); await b.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
await sleep(500);
R.focusReturned = await b.ev(`(() => { const a = document.activeElement; return a.closest("[data-frame]")?.dataset.index === "6" && a.matches(":focus-visible"); })()`);
R.controls = await b.ev(`[...document.querySelectorAll("#experiencias button:not([data-poster])")].map(x => x.getAttribute("aria-label"))`);
R.errors = b.errors;
console.log(JSON.stringify(R, null, 1));
b.close();
