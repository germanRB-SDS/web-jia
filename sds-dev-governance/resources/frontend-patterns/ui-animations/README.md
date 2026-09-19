# UI Animations

Portable animation and visual-effect references.

Load these only when a prompt explicitly asks for motion, animation, glow, carousel movement, or
frontend visual polish. Component behavior lives under `ui-components/`; this folder documents the
motion layer.

## Available Animations

- `carousel-motion/` — slide/fade carousel transitions with reduced-motion fallback.
- `border-glow/` — pointer-aware and conic-gradient border glow effects.
- `svg-path-glow-trace/` - glow particle or comet trail following an inline SVG path.
- `text-shimmer/` - animated gradient shimmer clipped to text.
- `wordmark-mask-beams/` - canvas light beams clipped to a wordmark/logo via CSS mask, using brand palette tokens.
