# Grounded Editorial Studio — Index and How to Use It

A portable one-page composition for a small studio or product company. It opens with a place-led
hero, states its operating position, proves it through alternating project rows, locates the work in
a real context, names the people, and closes with direct contact. The page uses spacing and
hairlines—not card grids—to create structure.

Discovery aliases: `grounded-editorial-studio`, `studio landing`, `editorial dark landing`,
`hairline sections`, `web tipo South Desert sin branding SDS`.

## Narrative sequence

Keep this order unless the target business has evidence for another journey:

| Step | Section | Job | Minimum content |
|---:|---|---|---|
| 1 | World hero | Establish place/material and one proposition | H1, 1 summary, primary + secondary action |
| 2 | Positioning | Explain the operating stance | one large lede + two contrasted columns |
| 3 | Proof | Show real work before capabilities | 1–3 alternating project rows with facts and evidence frame |
| 4 | Context | Connect work to place/process | wide media/diagram + two-column explanation |
| 5 | People | Make accountability visible | restrained portraits or initials; role and link |
| 6 | Contact | Give one clear next action | short invitation, direct channels, optional simple form |

For the minimum acceptance reconstruction, steps 1–3 are sufficient: complete hero, positioning and
at least one proof row. This is enough to judge hero-to-content transition and section rhythm.

## Complete token starter

All values are starting defaults and must live in the target token layer:

```css
:root {
  --ground: #14110f;
  --ground-rgb: 20 17 15;
  --ground-raised: #211a17;
  --ground-sunk: #0d0b0a;
  --ground-sunk-rgb: 13 11 10;
  --ink: #eee9e3;
  --ink-rgb: 238 233 227;
  --ink-dim: #a79b91;
  --ink-faint: #8f847c;
  --action: #d18452;
  --action-rgb: 209 132 82;
  --action-lit: #e6a271;
  --action-sunk: #8e5131;
  --atmosphere: #e8c79a;
  --atmosphere-rgb: 232 199 154;
  --signal: #a9b9ad;
  --signal-rgb: 169 185 173;
  --material: #f3eee7;
  --rule: rgb(var(--ink-rgb) / 11%);
  --rule-strong: rgb(var(--ink-rgb) / 22%);
  --display: "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --text: Inter, system-ui, sans-serif;
  --s1: .5rem;
  --s2: .875rem;
  --s3: 1.5rem;
  --s4: 2.5rem;
  --s5: 4rem;
  --s6: 6.5rem;
  --s7: 10rem;
  --measure: 68ch;
  --gutter: clamp(1.25rem, 5vw, 5rem);
  --page: 82.5rem;
  --ease: cubic-bezier(.16, 1, .3, 1);
}
```

The fallback font stack is part of the sample only. A production project may self-host licensed
fonts, but typography roles and metrics must remain tokenized.

## Global composition rules

```css
.page { width: min(calc(100% - var(--gutter) * 2), var(--page)); margin-inline: auto; }
.band { padding-block: clamp(var(--s5), 11vw, var(--s7)); border-top: 1px solid var(--rule); }
.prose { max-width: var(--measure); color: var(--ink-dim); line-height: 1.7; }
.band-title { font-size: clamp(1.6rem, 1.1rem + 2vw, 2.6rem); margin-bottom: var(--s4); }
```

- Page background and hero ground are the same token, so edges disappear.
- Display type is dense and weighty; body type is quiet and never pure white.
- The action accent appears only on links, buttons, focus, selection and tiny navigational cues.
  Landscape light uses `--atmosphere`; diagrams/data use `--signal`.
- Section headings carry their own hierarchy. Do not add eyebrow/kicker labels above them.
- Use annotations only for measurements/facts (platform, year, place, URL), uppercase and tracked.
- Surfaces are rare. A border and spatial separation replace a field of generic cards.

## Section recipes

### Positioning

- Lede: `max-width:30ch`, `clamp(1.75rem, 1.1rem + 2.6vw, 3rem)`, line-height `1.14`.
- Two equal columns, `gap:var(--s5)`, each introduced by a one-pixel rule.
- On `<=900px`, stack to one column with `gap:var(--s4)`.

### Proof rows

- Grid: `minmax(0,1fr) minmax(0,1.05fr)`; align center; gap `var(--s5)`.
- Row padding: `clamp(var(--s4), 6vw, var(--s6))`; rows separated by one hairline.
- Alternate evidence left/right with `order`, but restore document order on `<=900px`.
- Project title: `clamp(2rem, 1.3rem + 2.6vw, 3.25rem)`.
- Summary: `max-width:44ch`, `1.0625rem`, line-height `1.7`.
- Facts wrap in a horizontal group above their own hairline; each fact has a strong value and quiet
  annotation. Evidence frame defaults to `4/3`, radius `4px`, one-pixel rule.

### Context/place

- Wide frame defaults to `21/9`; use `16/9` below `900px` and `3/2` below `700px`.
- Never combine `aspect-ratio` with a minimum height that can force horizontal overflow.
- Text below uses two columns, stacking below `900px`.

### People and contact

- People use three equal columns with dividers in the gaps; stack 3→2 at `700px`, 2→1 at `520px`.
- Avoid hover theatre; a small image treatment change is enough.
- Contact begins with an invitation of at most `68ch`, then direct channels in a ruled grid.

## Responsive contract

| Breakpoint | Required change |
|---:|---|
| `1100px` | Three-column contact becomes two; low-priority column spans full width |
| `900px` | Positioning, proof, context text and contact become one column |
| `780px` | Navigation becomes a real button-controlled sheet; hero uses vertical scrim |
| `700px` | Wide context frame becomes `3/2`; people become two columns |
| `520px` | People become one column; hero actions become one explicit column, keep intrinsic width
  capped at `100%`, `gap:var(--s2)` and at least 44px targets |

Use `minmax(0,1fr)` in every flexible grid column to prevent intrinsic content overflow.

## Motion contract

- No scroll-reveal cascade. The page is readable and fully visible without animation.
- One entrance gesture may belong to the hero; later sections rely on scroll and hierarchy.
- Hover transitions use the same quick curve; image transitions may use one slower curve.
- Respect reduced motion globally and decline optional WebGL.

## Constants and content ownership

Before adaptation, map:

| Scope | Owner |
|---|---|
| UI copy/i18n | target copy catalog or static-template content module |
| Business identity/data | one target business-info entry point |
| User-facing media | target asset manifest with provenance |
| Visual values | CSS tokens plus hero scene config mirroring the same roles |

RGB channel tokens are required wherever an alpha variant is composed; do not restate literal
channels inside scrims, shadows or diagrams. Browser-surface values such as `<meta
name="theme-color">`, accessible navigation labels and visualization data belong to the content/
visual configuration too.

The reference sample contains neutral demonstration copy. Do not replace that copy inside layout or
rendering functions; replace the sample content module or the target project's equivalent. For a
static site, materialize semantic HTML from that module at build time and commit the generated page;
runtime JavaScript must not be required for the heading, navigation, actions or section copy.
Treat the content module as authored-but-untrusted configuration at build boundaries: escape text
and attributes, whitelist link schemes/destination forms, reject unsupported visualization variants
and fail the build on unresolved template slots.

## Anti-patterns

- centered copy over an unrelated radial glow;
- grids of identical cards used as the page skeleton;
- gradient text, icon tiles or decorative action color;
- three unrelated animation systems;
- proof sections that list capabilities without verifiable work;
- mobile layouts obtained only by shrinking desktop values;
- business name, contact data or media paths embedded in CSS/renderer code.

## Empirical acceptance protocol

1. Freeze access to the source implementation and its assets/screenshots.
2. Create a new neutral brand/content module.
3. Rebuild only from this pattern, the hero pattern and the reference sample.
4. Log each guess, assumed value, ambiguous rule, missing datum or reversed decision as `DEFECT`.
5. Repair the governing pattern/sample, discard the affected reconstruction, and repeat it.
6. Pass only when hero + positioning + proof can be rebuilt without source memory or consultation.

Defect record format:

```text
DEFECT <n> | artifact | trigger | missing/ambiguous rule | repair | retest result
```

## Reference implementation

`../../../frontend-external-sample-code/grounded-studio-reference/` contains a neutral, asset-free
implementation of the full hero plus positioning and two proof rows.

## Provenance

Clean-room page-composition extraction from the owned `web-sds` implementation, 2026-08-22. Brand,
copy, imagery and business details are excluded. The reusable knowledge is order, rhythm, contrast,
grid behavior, responsive transitions and the relationship between proof and place.
