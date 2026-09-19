export function initWordmarkMaskBeams({
  selector = ".wordmark-mask-beams",
  tokenNames = ["--brand-beam-blue", "--brand-beam-violet", "--brand-beam-lilac"],
  beamCount = 20,
} = {}) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = document.querySelector(selector);
  if (!el || reduce) return null;

  const ctx = el.getContext("2d", { alpha: true });
  const rootStyle = getComputedStyle(document.documentElement);
  const cssVar = (name) => rootStyle.getPropertyValue(name).trim();
  const hexToRgb = (hex) => {
    const h = (hex || "").replace("#", "");
    const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(f || "5aa0e8", 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const palette = tokenNames.map((name) => hexToRgb(cssVar(name)));
  const rand = (a, b) => a + Math.random() * (b - a);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const beams = Array.from({ length: beamCount }, (_, i) => ({
    x: rand(-0.2, 1.2),
    w: rand(0.055, 0.16),
    speed: rand(0.035, 0.095) * (i % 3 === 0 ? -1 : 1),
    alpha: rand(0.5, 0.92),
    phase: rand(0, Math.PI * 2),
    pulse: rand(0.55, 1.1),
    rgb: palette[i % palette.length],
  }));

  let w = 0;
  let h = 0;
  let raf = null;
  let visible = false;

  const resize = () => {
    const rect = el.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    el.width = Math.max(1, Math.round(w * dpr));
    el.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);

    const base = ctx.createLinearGradient(0, 0, w, 0);
    base.addColorStop(0, rgba(palette[0], 0.18));
    base.addColorStop(0.45, rgba(palette[1], 0.14));
    base.addColorStop(0.72, rgba(palette[2], 0.16));
    base.addColorStop(1, rgba(palette[0], 0.2));
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.2);
    ctx.translate(-w / 2, -h / 2);

    for (const beam of beams) {
      const cycle = ((beam.x + t * beam.speed) % 1.45 + 1.45) % 1.45;
      const beamWidth = beam.w * w;
      const x = (cycle - 0.24) * w;
      const pulse = 0.72 + 0.28 * Math.sin(t * beam.pulse + beam.phase);
      const alpha = beam.alpha * pulse;
      const gradient = ctx.createLinearGradient(x, 0, x + beamWidth, 0);
      gradient.addColorStop(0, rgba(beam.rgb, 0));
      gradient.addColorStop(0.36, rgba(beam.rgb, alpha * 0.65));
      gradient.addColorStop(0.5, rgba(beam.rgb, alpha));
      gradient.addColorStop(0.64, rgba(beam.rgb, alpha * 0.65));
      gradient.addColorStop(1, rgba(beam.rgb, 0));

      ctx.filter = "blur(7px)";
      ctx.fillStyle = gradient;
      ctx.fillRect(x, -h * 1.2, beamWidth, h * 3.4);

      ctx.filter = "blur(1.5px)";
      ctx.fillStyle = rgba(beam.rgb, alpha * 0.58);
      ctx.fillRect(x + beamWidth * 0.47, -h * 1.2, Math.max(1.4, beamWidth * 0.11), h * 3.4);
    }

    ctx.restore();
    ctx.filter = "none";
  };

  const tick = () => {
    if (visible) draw(performance.now() / 1000);
    raf = requestAnimationFrame(tick);
  };

  const setVisible = (nextVisible) => {
    visible = nextVisible;
    if (nextVisible) {
      resize();
      if (!raf) tick();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      setVisible(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(el);
  } else {
    setVisible(true);
  }

  return { resize, setVisible };
}

initWordmarkMaskBeams();
