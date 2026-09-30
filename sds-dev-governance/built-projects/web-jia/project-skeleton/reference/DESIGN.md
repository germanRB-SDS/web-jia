---
name: JIA — Jornadas de Innovación de Almería
description: A teacher's field notebook on warm paper — JIA ink, terracotta pins, condensed slab titles and a reading serif for the jornadas landing.
colors:
  paper: "#f1e7d8"
  ivory: "#f6eedf"
  sand: "#edddc7"
  card: "#eee3d1"
  ink: "#2f180b"
  text: "#443d37"
  text-muted: "#71604d"
  terracotta: "#89482e"
  terracotta-deep: "#703923"
  sand-deep: "#e2cfb2"
  line: "#c9b79f"
  copper: "#ad754d"
  olive: "#72715b"
typography:
  display:
    fontFamily: "Rokkitt, Rockwell, 'Roboto Slab', Georgia, serif"
    fontSize: "clamp(2.125rem, 4.4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Rokkitt, Rockwell, 'Roboto Slab', Georgia, serif"
    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  title:
    fontFamily: "Rokkitt, Rockwell, 'Roboto Slab', Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  edition:
    fontFamily: "Alegreya, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "normal"
  lede:
    fontFamily: "Alegreya, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Alegreya, Georgia, 'Times New Roman', serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Barlow Semi Condensed', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.12em"
  field-label:
    fontFamily: "'Barlow Semi Condensed', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.12em"
  script:
    fontFamily: "'Homemade Apple', 'Bradley Hand', 'Segoe Script', cursive"
    fontSize: "clamp(1.25rem, 2.4vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  focus: "2px"
  chip: "3px"
  button: "4px"
  menu: "6px"
  tile: "8px"
  card: "10px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  section: "clamp(4rem, 9vw, 7.5rem)"
  spread: "clamp(2rem, 4vw, 3.5rem)"
  grid: "clamp(1.5rem, 3vw, 2.5rem)"
  stack: "1rem"
  card: "0.9rem"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0.7em 1.35em"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0.7em 1.35em"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "rgb(47 24 11 / 0.06)"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta}"
    typography: "{typography.label}"
    padding: "0.7em 0.2em"
    height: "40px"
  button-quiet-hover:
    textColor: "{colors.terracotta-deep}"
  button-unavailable:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0.7em 1.35em"
    height: "48px"
  chip-provisional:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta}"
    rounded: "{rounded.chip}"
    padding: "0.35em 0.55em 0.3em"
  chip-demo:
    textColor: "{colors.olive}"
  chip-pending:
    textColor: "{colors.text-muted}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 0.8rem"
    height: "44px"
  nav-sublink:
    textColor: "{colors.text}"
    typography: "{typography.label}"
    padding: "0 0.8rem"
    height: "40px"
  nav-sublink-hover:
    textColor: "{colors.terracotta}"
  nav-menu-desktop:
    backgroundColor: "{colors.ivory}"
    rounded: "{rounded.menu}"
    padding: "0.4rem"
    width: "13rem"
  nav-panel-phone:
    backgroundColor: "{colors.ivory}"
    padding: "0.75rem clamp(1rem, 4vw, 3.5rem) 2rem"
    height: "calc(100dvh - 100%)"
  header:
    backgroundColor: "{colors.paper}"
    height: "4.25rem"
  waypoint:
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "0.75rem 1rem 0.75rem 0.5rem"
    height: "72px"
  waypoint-hover:
    backgroundColor: "{colors.card}"
  parchment-surface:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
  proposals-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.terracotta}"
    rounded: "{rounded.card}"
  dialog-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
  dialog-close:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0.5rem 0.9rem"
    height: "44px"
  empty-state:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1rem, 4vw, 3.5rem)"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sand}"
---

# Design System: JIA — Jornadas de Innovación de Almería

<!-- Recorded from the built code on 2026-09-17, updated 2026-09-18 after the fix round
     (parchment empty surfaces, pinned Propuestas panel, dialog on parchment, hero crop,
     full-height phone menu, chip policy, radius scale) (app/theme/palette.css, app/globals.css,
     components/**/*.module.css, components/icons/index.tsx, app/layout.tsx) and the review
     captures in .impeccable/review/. Direction contract: `const CONTRACT` in app/layout.tsx
     (seed 0634789a). The identity guide assets/style/JIA_IDENTIDAD_VISUAL.md is the world's
     source; this file records how the build honoured, extended or deviated from it. -->


> Update 2026-09-18 (JIA-2026-09-18-02): hover/active surface token `--jia-sand-deep` `#e2cfb2` added for waypoints, sub-menu links, secondary buttons and the dialog close; the hero photograph now meets the next section rule with no bottom fade and dissolves on the left through an SVG fractal-noise mask (`--hero-dissolve`); a registration-mark cursor (`components/site/CursorMark`) replaces the native pointer on fine pointers; footer column titles are 0.875rem; demo experience surfaces are solid olive/copper with grain and pin.


> Update 2026-09-18 (JIA-2026-09-18-03): ground rhythm now alternates bands — paper (hero, waypoints) → ink band (Jornadas: copper key light, ivory statement ≤22ch, poster bleeding right/bottom) → paper spreads → sand→paper (Dosieres) → paper (Experiencias) → sand (Propuestas) → paper→ivory (Partners strip, `components/site/Partners`) → full-bleed photograph (Acoge: archer, paper fade at the top, ink fade at the bottom) → ink footer. Hero entrance: `focus-in` on the lockup lines and staggered `rise` (350–650 ms) on rule, title, dateline, lede and actions; one-shot warm key light (`.light`, radial + conic mask, `exposure` 2.6 s) and a `develop` filter ramp on the photograph; all off under reduced motion. Provisional/demo chips are switched off (`site.preview.markProvisional=false`). New token `--jia-ivory-rgb`.


> Update 2026-09-18 (JIA-2026-09-18-04): the Jornadas opening is a photographic band (rider over the valley) under a **dune veil** — two new extension tones sampled from the promoter's swatch, `--jia-dune` `#c0ac94` and `--jia-dune-light` `#ddccb5`, laid as a horizontal gradient at 0.93→0.16 alpha (dense where the ink text sits, open over the landscape) with a short fade to paper at the foot; the band title and lede reuse the Section title/lede voices (Rokkitt `--t-h2` ink, Alegreya `--t-lede` text). The event poster is a pinned lobby card (`components/site/PosterCard`): 2.5° at rest, straightens and lifts on hover/focus, "Ver cartel" opens it at full size in the sheet dialog. Unavailable actions may omit their note (`unavailable: null`).


> Update 2026-09-18 (JIA-2026-09-18-05, addenda): unavailable actions carry a solid 1.5px `--jia-copper` border and `--jia-text` label; the cursor mark opens over any `[data-cursor="open"]` surface (sheet cards, team cards) as well as links and controls; the organisers block is a printed colophon (hairline, two columns, 0.6875rem terracotta labels, one entity per line in 0.875rem Barlow, no plate).

> Update 2026-09-18 (JIA-2026-09-18-05): the Jornadas opening mirrors maryna-ventura's "Servicios" spread — photograph bleeding on the left (58/42 grid at ≥900px), solid `--jia-dune` panel on the right carrying title, lede and a small pinned poster (`PosterCard size="small"`, 10rem, hover label hidden, still opens full size). The veil is transparent over the rider (0% to 38%) and reaches the panel colour at the seam; on phones it runs vertically into the panel below.


> Update 2026-09-18 (JIA-2026-09-18-06): Partners kicker 0.875rem and group labels 0.8125rem (+0.125rem each); organiser names link to their CEP sites from one data source (footer and the Partners paragraph via `{o-id}` placeholders); the footer carries the #JIA26 badge as a watermark (40rem, lower-right, 0.22 opacity, blurred 1px, linear dissolve toward the columns, extra bottom padding at ≥760px); new shared `Section .subtitle` (Alegreya italic, `--t-subtitle` clamp 1.375–1.875rem) and `layout="split"` (section without vertical padding; text column 47% carries it (`--split-y` 2.5–4rem; right padding = a sixth of the left, min 1rem; no inner measure caps); `[data-visual]` column 53%, full height, bleeding top/right/bottom); Partners ground is flat `--jia-ivory`; Propuestas shows the vault photograph as its visual column.

> Update 2026-09-18 (JIA-2026-09-18-23): page order ends Acoge → Socios → footer. Acoge's photograph now dissolves at its foot into `--jia-vellum-4` (22%), and Socios sits on that same flat vellum so no seam shows. Socios drops the printed colophon: under the head and its hairline runs the collaborators' carousel (`components/site/collaborators-carousel`), window-wide, endless, dragged either way (pointer, sideways wheel, ← / →) with a glide that settles on a card; nothing moves by itself. Card (`CollaboratorCard`): ink gradient (`--jia-gradient-cube`), 14px radius, a 4:3 image slot (8px radius; a solid `--jia-surface-*` colour without the empty-surface pin until the photograph arrives), name in Rokkitt 700 uppercase 0.9375rem ivory centred on the card's axis, and a 2.75rem round chevron — the only link — that fills terracotta on hover/focus. New surface tokens `dune` and `terracotta-deep`. Programme sessions read numeral · time slot (Barlow 0.875rem, tabular, fixed 5.75rem column) · activity on one row. Footer bullet holes last 3 s each, then fade (700 ms) and leave the DOM; the cube's stay.

> Update 2026-09-18 (JIA-2026-09-18-24): each collaborator card carries its image (the entity's logotype composed on a western still, 1448×1086, 4:3) in the same slot — card and slot sizes unchanged (296×312 / 272×204 at 1440; 264×288 / 240×180 at 390), `object-fit: cover` crops any other proportion, the palette surface stays as fallback. The strip now drifts by itself from right to left at 28 px/s (`config.ts`), easing in and out (450 ms); it stops for a press, a mouse over it, keyboard focus inside, off screen and in a hidden tab, and resumes 1.4 s after a drag, wheel or key. A release keeps its momentum without settling on a card. No drift under reduced motion.

> Update 2026-09-18 (JIA-2026-09-18-25): the carousel's cards come from an ordered list (`sections/socios.ts` `carouselIds`): the Junta de Andalucía first, then the five collaborators. The card name is no longer centred: it starts on the image's left edge (the card's 0.75rem padding), left-aligned, with the round chevron on the right edge.

## Overview

**Creative North Star: "The Teacher's Field Notebook"**

The page is a set of ruled spreads on warm paper with lobby cards pinned to them, not a
stack of event cards. One continuous paper ground carries everything; a fixed, faintly
ink-tinted grain sits under the content and never touches text, controls or photographs.
The only inverted ground is the footer, printed in JIA ink. Western cinema is the language
of the page (a hand-drawn line-icon family, a wood-type slab for titles, a terracotta pin
holding each poster, one handwritten note across the hero photograph) while education is
the content, so the western never becomes a costume: no weapons, no "Se busca" posters,
no distressed textures on interface elements.

Density is editorial and unhurried. Sections breathe with a `clamp(4rem, 9vw, 7.5rem)`
block rhythm, the reading column is capped at 62ch, and each Jornadas block is a notebook
spread: a running head in the left margin (sticky on desktop, ruled with a 3px terracotta
line) and the content filling the page to its right. Photographs never sit in boxes; they
bleed to the edge and dissolve into paper through masks.

Confirmed visual rejections, from the identity guide and honoured by the build: pure black
and pure white are never dominant colours; no bevels, 3D, drop-shadowed or "burnt" lettering;
no grey or hard-offset shadows; the JIA lettering is never typeset from a font.

**Key Characteristics:**
- One paper ground (`paper`, with `sand` and `ivory` as its warmer and lighter siblings) and one accent (`terracotta`) that owns every action, pin, icon and running head.
- Four self-hosted open-licence faces with strict roles: Rokkitt (titles), Alegreya (reading and the italic edition title), Barlow Semi Condensed (labels, navigation, buttons), Homemade Apple (exactly one note).
- Shadows are always JIA ink at partial alpha with a negative spread; they lift pinned cards and float the dialog, and nothing else.
- Flat surfaces, small radii (4px controls, 10px cards) and 1px `line` rules do the structural work; posters get a terracotta pin instead of a frame.
- Every image has a guaranteed footprint: a missing photograph becomes a sheet of parchment (card parchment, the paper grain, a hairline inset edge and a terracotta pin) at the same proportion, never a flat colour block and never a broken file.

## Colors

A sampled-paper palette: three warm light grounds, three inks, one terracotta accent with its deep hover, and three decorative extensions (line, copper, olive) that never carry reading text.

### Primary
- **Terracotta** (`terracotta`): the single action colour. Primary button fill, links, the arrow and external-link glyphs, the "Tinta de frontera" icons (including the 160px compass on the Propuestas panel), the pin dot on every poster and every parchment surface, the 3px rule and running head of each notebook spread, field labels inside sheets (`dt`), the programme's roman session numerals, focus ring, caret, form accent and text selection background. 5.66:1 on paper.
- **Deep Terracotta** (`terracotta-deep`): hover and focus-visible state of terracotta on light grounds (primary button fill, quiet button text, link hover). Never a resting colour.

### Neutral
- **Editorial Paper** (`paper`): the page ground, the sticky header (at 92% alpha over blur), Section `paper` tone and the browser theme colour. Everything is read against it.
- **Sand** (`sand`): the warm end of the hero gradient (paper → sand at 38% → 100%), the top of the Section `sand` tone (sand → paper, top to bottom), the hero's own fallback surface, footer body text and footer column titles on ink, and the scrollbar track.
- **Ivory** (`ivory`): the light end. Text on terracotta and ink (buttons, footer links, wordmark on ink), the dialog's close button, the desktop submenu and the phone navigation panel (ivory under the paper grain).
- **Card Parchment** (`card`): the parchment material. Every empty image surface (workshop, experience and Acoge fallbacks are all `card`), the sheet dialog panel, the Propuestas panel and the dashed empty-state panel are card parchment under the paper grain; it is also the pressed state of a waypoint row.
- **JIA Ink** (`ink`): the wordmark, every Rokkitt title, the secondary button's stroke and text, navigation links, the 2px rule beside the lockup, and the footer ground. 13.66:1 on paper. Its RGB channels (`47 24 11`) are the only source for shadows, veils and the hero reveal gradient.
- **Reading Ink** (`text`): paragraphs, ledes, card subtitles, session lines. 8.72:1 on paper.
- **Muted Ink** (`text-muted`): metadata, hints, provenance notes, pending labels, poster captions, member roles, the "pending" chip. 4.93:1 on paper; the floor for small text.
- **Sand Line** (`line`): every 1px separator (header bottom, waypoints strip, spread tops, session rules, day column divider, dossier list gaps), the empty-state dashed border, the submenu border, and the footer notice text on ink.
- **Matte Copper** (`copper`): decorative only: the scrollbar thumb. 3.16:1 on paper; the guide forbids it for small text and the build sets none in it. The `copper` surface token exists but no surface on the page uses it.
- **Dry Olive** (`olive`): the "demo" chip only. The `olive` surface token exists but no surface on the page uses it. Never a second protagonist.

### Named Rules
**The Single Accent Rule.** Terracotta is the only colour that means "act here" or "this is the notebook's own mark". Copper and olive are decorative extensions; if a new element needs an accent, it is terracotta or it is ink.

**The Ink-Alpha Rule.** Transparency is never a new colour. Shadows, veils, inset edges, the hero reveal, the team-strip fade and the header blur all derive from the three channel tokens (`--jia-ink-rgb`, `--jia-paper-rgb`, `--jia-sand-rgb`); no `rgba()` of any other value exists in the build.

**The Parchment Rule.** An empty surface is a sheet of parchment, not a colour block: card parchment, the shared `--paper-grain` tile, a 1px ink edge at 8% with a soft inset foot shadow, and a terracotta pin. Copper, olive, terracotta and ink remain valid surface tokens in the content model, but no page surface uses them.

**The Vellum Ground Rule.** The page's paper is one continuous ground, not a stack of colour blocks. Five steps of vellum (`--jia-vellum-1` #f6eee2 → `--jia-vellum-5` #e8ddcc, in `palette.css`) and three recipes: `--jia-bg-open` (2 → 3, with the hero's corner light; the Jornadas spreads, whose upper seam is the video), `--jia-bg-rest` (3 → 2 → 3; the default Section tone) and `--jia-bg-deep` (sand-deep, the `sand` tone: «Tu propuesta JIA» is a deliberately denser band, with its photograph, so it stands off the step-4 section under it). Paper neighbours share the colour of their seam, so no paper section starts with a step, and the page lands on step 4, **#ece2d2**, which «Quién hace posible» and the last band keep as their base (`--jia-bg-arrived`). The corner light is only used where the seam above is not paper. Step 5 is never a ground for text: `--jia-text-muted` drops to 4.49:1 on it (4.70:1 on step 4). The canonical paper, ivory, sand and card tokens keep their values for cards, sheets and photographic veils.

**The One Inverted Ground Rule.** Ink is a ground exactly once, in the footer, where the wordmark and links go ivory and body text goes sand. The Section component exposes an `ink` tone, but no section on the page uses it; the page body stays light.

## Typography

**Display Font:** Rokkitt (with Rockwell, Roboto Slab, Georgia fallbacks)
**Body Font:** Alegreya, roman and italic (with Georgia, Times New Roman fallbacks)
**Label Font:** Barlow Semi Condensed, weights 500 and 600 only (with Helvetica Neue, Arial fallbacks)
**Script Font:** Homemade Apple, one weight, not preloaded (with Bradley Hand, Segoe Script fallbacks)

**Character:** A printer's wood-type slab for titles, a warm high-x-height serif for reading, a sober slightly-narrow sans for wayfinding. `assets/fonts/` was empty and no western face came with the project, so these four SIL-OFL Google families are self-hosted at build time by `next/font` in `app/layout.tsx`; components only ever use the CSS variables (`--f-display`, `--f-body`, `--f-ui`, `--f-script`). This is a deliberate extension of the identity guide (§6 asks for a tall narrow editorial serif for the event name and a compatible serif for section titles): Rokkitt is a condensed slab, which the build reads as the printed-ephemera voice the guide describes. Guide §6 also asks for a glyph check of «Almería», «innovación», «ñ», «¿», «¡»; the captures render all of them.

### Hierarchy
- **Display** (700, `clamp(2.125rem, 4.4vw, 3.5rem)`, line-height 1, tracking 0.02em, uppercase): Section titles (h2), ink on paper. Also the hero's full event name beside the wordmark at `clamp(1.05rem, 5.2vw, 2.1rem)` with 0.1em tracking and a 2px ink rule to its left.
- **Headline** (700, `clamp(1.375rem, 2.2vw, 1.75rem)`, line-height 1, tracking 0.04em, uppercase): the running head of a notebook spread (h3), terracotta, ruled above with 3px terracotta. Day labels in the programme use the same voice at `clamp(1.5rem, 2.6vw, 2.125rem)`.
- **Title** (700, 1.375rem, line-height 1.1, sentence case, `text-wrap: balance`): card and team-strip titles, dossier titles (1.5rem), waypoint labels (1.125rem, 0.08em, uppercase) and the waypoints strip heading (h2 at 1rem, 0.08em, uppercase, ink). Inside the sheet dialog the title grows to `clamp(1.75rem, 3vw, 2.5rem)` and becomes a wrapping flex row so its chip sits inline after the words.
- **Edition** (Alegreya italic 500, `clamp(1.5rem, 2.8vw, 2.25rem)`, line-height 1.15): the edition title in the hero («Aulas de cine: el duelo»). The same italic voice, at 1.0625–1.25rem, sets card subtitles, sheet subtitles and the programme dates.
- **Lede** (400, `clamp(1.125rem, 1.5vw, 1.375rem)`, line-height 1.5): section ledes and the Jornadas intro, capped at 62ch.
- **Body** (400, 1.0625rem, stepping to 1.125rem at ≥960px, line-height 1.6): paragraphs, sheet fields, session lines; measure 62ch (34rem for the hero paragraph). Honours the guide's 17–19px desktop / 16–18px mobile range and 1.5–1.65 leading.
- **Label** (600, 0.875rem, line-height 1.1, tracking 0.12em, uppercase): buttons, navigation links, the hero dateline (0.9375rem), the "open sheet" action (0.8125rem), the skip link. Muted-ink hints and notes use the same face at 0.9375rem without tracking or caps.
- **Field label** (500, 0.75rem, tracking 0.12em, uppercase): `dt` labels in sheets and programme days, dossier format, member roles (0.1em), and the muted 0.7rem prefixes «Imparte» / «Temática» that open a card's people and theme lines. No weight is set in CSS; it falls to the lightest loaded cut (500). Every one of these carries a real datum from the content model, and each sits after or beside its value, never above a title. The team-strip count beside «Quién está detrás» is the same voice at 0.8125rem, no caps.
- **Script** (400, `clamp(1.25rem, 2.4vw, 2rem)`): one handwritten note over the hero photograph, rotated -8°, ink with a paper glow (`text-shadow: 0 0 12px rgb(241 231 216 / 0.9)`), `aria-hidden`.

### Named Rules
**The Wordmark Is Not Type Rule.** «JIA» is always the SVG mark (`public/brand/jia-wordmark-derived.svg`, `<use href="…#mark">`, painted with `currentColor`), never three letters set in Rokkitt. The mark was traced with potrace from the approved render and is flagged `provisional: true` in `lib/content/media.ts` until the organisation produces the vector master (guide §5.5).

**The One Note Rule.** Homemade Apple appears exactly once, in the hero, decorative and hidden from assistive technology. It never carries information and never appears in a second component.

**The Tracked Caps Rule.** Uppercase belongs to Rokkitt titles (0.02–0.10em) and Barlow labels (0.12em, up to 0.18em on the footer column titles). Alegreya is never uppercased and never tracked; it owns every italic. Note the deviation from guide §6, which suggests starting short uppercase headlines at 0.08–0.16em: the build tracks section titles at 0.02em because Rokkitt is already condensed and set large.

## Layout

One centred column, `min(100% - 2 × gutter, 80rem)` wide with a fluid gutter of `clamp(1rem, 4vw, 3.5rem)`; the header, hero content, every section, the waypoints strip and the footer share this exact container. Reading text is capped at 62ch (`--measure`), section heads at 44rem, the hero paragraph at 34rem.

Vertical rhythm: sections pad `clamp(4rem, 9vw, 7.5rem)` top and bottom and carry `scroll-margin-top: 4.5rem` for the sticky header. Section heads sit `clamp(2rem, 5vw, 3.5rem)` above their content. Inside Jornadas, each notebook spread pads `clamp(2rem, 4vw, 3.5rem)` and opens with a 1px `line` rule; at ≥900px it becomes a `200px | 1fr` grid with the running head sticky at `top: 5.5rem`. Grids of cards use `repeat(auto-fill, minmax(min(100%, 240px), 1fr))` for posters and `320px` for wide experience cards, with `clamp(1.5rem, 3vw, 2.5rem)` gaps. Inside a card the parts stack at 0.9rem; inside prose and split panels at 1rem.

Hero: on desktop (≥960px) the section is `min(88vh, 900px)` tall, content padded `56%` on the right (52% at ≥1400px), and the photograph is absolutely positioned on the right at 66% width, masked left-to-right (transparent → opaque at 42%) and bottom-to-top (opaque at 14%) so it dissolves into paper. The photograph is the crop `hero-1` (1021:941, original columns 300–1321, focal `50% 42%`), which excludes both the signpost and the backpack lettering so no baked-in words reach the mask. Below 960px the text comes first and the photograph follows as its own 4:3 block masked upward into the paper (opaque from 22%), pulled up 1rem, focal `55% 45%`.

Breakpoints actually used: 420px (header name hides), 480px (header badge hides), 640px (waypoints go two-up), 760px (programme days two columns with a `line` divider, dossier rows, footer four columns), 900px (spreads, split panels, two-column sheet dialog), 960px (desktop navigation, hero split, body size step), 1100px (waypoints four-up), 1400px (hero padding).

The team strip is a horizontal scroller (`scroll-snap-type: x proximity`, `scrollbar-width: thin`, 168px items, 1rem gap) bled to the gutter edges, with a 4rem paper fade (`paper` at 0 → `paper`) over its right edge announcing more cards; the programme is two ruled pages side by side. Below 960px the open navigation is a full-height panel (`calc(100dvh - 100%)`) under the bar, scrolling internally while the body scroll is locked. The site is static HTML, reading order hero → signpost → Jornadas (programa, cómo funcionan, talleres) → Dosieres → Experiencias → Propuestas → Acoge JIA → footer.

## Elevation & Depth

A hybrid: surfaces are flat and tonal by default (paper, sand, card, ivory steps and 1px `line` rules), and shadows exist only to say "this is pinned to the page" or "this floats above it". Every shadow is JIA ink at 35–55% alpha with a large blur and a negative spread, so it reads as a soft cast on paper rather than a floating panel. Guide §11.3's "no pronounced floating shadows" is honoured by the negative spreads: at rest a poster's shadow never extends past its own edges.

### Shadow Vocabulary
- **Pinned poster, at rest** (`box-shadow: 0 10px 28px -16px rgb(47 24 11 / 0.45)`): every SheetCard surface.
- **Pinned poster, lifted** (`box-shadow: 0 18px 36px -18px rgb(47 24 11 / 0.55)` with `translateY(-3px)`): SheetCard on hover or focus-within.
- **Event poster** (`box-shadow: 0 18px 40px -22px rgb(47 24 11 / 0.5)`): the tilted cartel in the Jornadas intro and the Propuestas parchment panel (which adds the parchment edge below).
- **Team card** (`box-shadow: 0 8px 20px -12px rgb(47 24 11 / 0.5)`): items in the team strip.
- **Floating panel** (`box-shadow: 0 24px 60px -20px rgb(47 24 11 / 0.45)`): the sheet dialog. Its backdrop is `rgb(47 24 11 / 0.55)` with a 2px blur.
- **Menu panel** (`0 16px 32px -18px rgb(47 24 11 / 0.45)`): the desktop submenu only; the phone navigation panel is full-height and casts no shadow.
- **Parchment edge** (`inset 0 0 0 1px rgb(47 24 11 / 0.08)`, plus `inset 0 -40px 60px -50px rgb(47 24 11 / 0.25)` on empty image surfaces): the hairline that makes an empty surface read as a cut sheet, with a soft foot shadow.
- **Pin** (`0 2px 4px rgb(47 24 11 / 0.35)` cast, `inset 0 -2px 0 rgb(47 24 11 / 0.35)` underside): the terracotta pin on parchment surfaces and the Propuestas panel; the SheetCard pin carries only the inset underside.

Depth on the paper itself comes from the grain: `--paper-grain` in `app/globals.css`, an inline SVG `feTurbulence` tile (220px, baseFrequency 0.9, tinted toward ink at 9% alpha) that is painted once as a fixed layer behind the page (`body::before`, opacity 0.07) and again directly on every parchment material (empty surfaces, the dialog panel, the Propuestas panel, the phone menu). The header floats on `rgb(241 231 216 / 0.92)` with a 10px backdrop blur and a `line` bottom rule; it has no shadow.

### Named Rules
**The Ink Shadow Rule.** A cast shadow is always `rgb(47 24 11 / a)` with `a` between 0.35 and 0.55, blur ≥ 20px and a negative spread; the only small hard cast is the 12px pin (`0 2px 4px`). Inset shadows are the parchment edge (8%) and foot (25%). No grey shadows, no shadows on buttons, chips, inputs or the header.

**The Pinned, Not Floating Rule.** Cards lift by 3px on hover and nowhere else; the only element that truly floats is the dialog.

## Shapes

Small, honest radii on a flat page, on a six-step scale: 2px (the focus ring's corner), 3px (chips), 4px (controls: buttons, the navigation toggle, the dialog close, the skip link, the team-strip scroller), 6px (the desktop submenu and the scrollbar thumb), 8px (waypoint tiles) and 10px (image surfaces, the dialog panel, the Propuestas panel and the empty-state panel). The focus ring is a 3px terracotta outline offset 3px.

The hero photograph is the exception: square-cornered (`border-radius: 0`), edge-bled, shaped only by its gradient masks. Tilts are the notebook's pinned-ephemera gesture: the event poster is rotated 1.5° and straightens on hover, the Propuestas panel sits at -1.5°, the handwritten note at -8°.

The pin is a 12px terracotta circle at top centre. On a SheetCard it overhangs the image by 6px (`top: -6px`); on an empty parchment surface it sits 10px inside the sheet, and on the Propuestas panel 12px inside, both with a cast shadow. The second Acoge panel (1:1 parchment) is raised 18% against the first (a 4:5 photograph, `hero-2-place`, focal `66% 34%`).

Lines are 1px `line` rules; the exceptions are the 2px ink rule beside the lockup, the 3px terracotta rule above a running head, and the 1px ink hairlines flanking the hero's single star. Borders are 1.5px: ink on the secondary button, toggle and close button; dashed `line` on the empty-state panel and on an unavailable action (transparent fill, muted text). Parchment surfaces have no border; their edge is the 8% ink inset hairline.

Empty image surfaces keep the media's own ratio (posters 1414:2000, wide cards 4:3, Acoge 4:5 and 1:1, hero 1021:941 in the crop) and are parchment (see The Parchment Rule); the hero's fallback is the one `sand` surface.

## Components

### Buttons
One component (`Action`) with three variants; all share the label voice, 4px radius, a 1.5px border box, `0.7em 1.35em` padding and a 48px minimum height. The trailing glyph (arrow, or the external-link mark for `target="_blank"`) nudges right 3px on hover and focus.
- **Primary:** terracotta fill, ivory text, terracotta border; hover and focus-visible go deep terracotta. One per composition (the hero's first action).
- **Secondary:** transparent, ink text and 1.5px ink border; hover paints a 6% ink veil.
- **Quiet:** transparent, terracotta text, 0.2em side padding, 40px minimum; hover deep terracotta.
- **Unavailable:** the same label rendered as a static `<span aria-disabled>`: transparent, muted-ink text, a 1.5px dashed `line` border and `not-allowed` cursor, followed by its visible note in muted ink (34ch). It never inherits the primary fill and never uses `href="#"`.
- **Transitions:** background, border, colour and transform at 160ms `cubic-bezier(0.16, 1, 0.3, 1)`; the glyph at 220ms.

### Chips
Editorial-state marks (`Marks`), shown only while `site.preview.markProvisional` is on. Barlow 600, 0.6875rem, 0.14em tracking, uppercase, 1px `currentColor` border, 3px radius, `0.35em 0.55em 0.3em` padding, transparent fill. Three kinds by colour only: **provisional** terracotta, **demo** olive, **pending** muted ink. A chip sits inline after the fact it qualifies, and a provisional chip marks only an unconfirmed fact: the edition title, the dateline, «Jornada 1 / 2», «Organiza / Colabora», one beside the Talleres hint, and inside a sheet after its title. Section headings and card feet never carry a provisional chip (card feet may carry demo or pending).

### Cards
The **SheetCard** is the signature pinned lobby card.
- **Corner Style:** the image surface is 10px; the card itself has no box, no background, no border.
- **Media:** a `Surface` at 1414:2000 (poster) or 4:3 (wide), pinned by the terracotta dot, with the rest/lift shadows above; when the image is missing it is parchment. A hover-only reveal slides up from the bottom: an ink gradient (92% → 75% at 70% → transparent) with ivory Alegreya at 1rem; it is `aria-hidden`, removed on `hover: none` devices, and its transition is dropped under reduced motion.
- **Body:** stack at 0.35rem; title first (Rokkitt 1.375rem, ink), italic subtitle (Alegreya 1.0625rem), then the people line and the theme line, both Barlow 0.9375rem opened by a muted 0.7rem field label («Imparte», «Temática»). Nothing sits above the title.
- **Foot:** a real `<button aria-haspopup="dialog">` in the label voice at 0.8125rem, terracotta with the nudging arrow, or a muted "pending" label; then demo/pending chips (provisional is filtered out here and shown inside the sheet instead).
- **Shadow Strategy:** see Elevation: Pinned poster at rest / lifted.

**Dossier row:** a ruled list (1px `line` gaps and block rules, paper rows, 1.5rem vertical padding) with a format field label, Rokkitt title at 1.5rem and a 62ch summary; two columns from 760px. **Empty state:** a centred dashed `line` panel on card parchment, 10px radius, a 56px terracotta lantern icon and an Alegreya line at 1.125rem, 34ch.

### Sheet Dialog
Native `<dialog>` (`showModal`, Escape, click-outside, focus returned to the opener). Panel: card parchment under the paper grain, 10px radius, floating-panel shadow, `max-width: min(100vw - 2rem, 62rem)`, scrolls internally. Enters with a 280ms rise (12px up, fade in), disabled under reduced motion. The close control is a secondary-style button (ivory fill, 1.5px ink border, 44px, sticky top-right) that goes paper on hover. Inside, a 1.5rem sheet (2.5rem and a `320px | 1fr` grid from 900px): the poster surface (eager-loaded once open), the title at `clamp(1.75rem, 3vw, 2.5rem)` as a wrapping flex row with its chip inline after the words, italic subtitle at 1.25rem, the people line, then a `dl` of terracotta field labels over Alegreya 1.0625rem values, related links in terracotta, and an optional document link in the label voice.

### Navigation
- **Header:** sticky, paper at 92% over a 10px blur, 1px `line` bottom rule, 4.25rem minimum height. Left lockup: the wordmark at 2.1rem tall in ink beside the three-line event name in Rokkitt 0.6875rem, 0.12em, with a 1px ink rule (name hidden ≤420px). Right: the official #JIA26 badge at 2.75rem (hidden ≤479px).
- **Links:** Barlow 600, 0.875rem, 0.12em, uppercase, ink, 44px tall, `0 0.8rem` padding. Hover and focus draw a 2px terracotta underline 8px above the bottom edge, scaling from the left over 220ms. "Jornadas" carries a terracotta chevron toggle (32px, rotates 180° when open) and a submenu: ivory, 1px `line` border, 6px radius, menu shadow, 13rem minimum; sub-links are Barlow 500, reading ink, 40px, terracotta on hover.
- **Phone / tablet (<960px):** a "Menú / Cerrar menú" toggle in secondary-button style (1.5px ink border, 0.8125rem, 44px); the list becomes a full-height parchment panel under the bar (ivory under the paper grain, `calc(100dvh - 100%)` tall, `line` top rule, `0.75rem gutter 2rem` padding, no shadow) that scrolls internally while the body is locked; links at 1rem, the submenu simply open and indented 1rem.
- **Waypoints (signpost):** a paper strip with `line` rules above and below, an h2 in the display face (Rokkitt 1rem / 0.08em, uppercase, ink), and four rows (two-up from 640px, four-up with `line` dividers from 1100px). Each row: a 44px terracotta family icon, a Rokkitt 1.125rem / 0.08em uppercase label over an Alegreya 0.9375rem line, and a terracotta arrow that nudges 4px; hover paints card parchment at 8px radius over 180ms.
- **Skip link:** ink fill, ivory label voice, 4px radius, appears at `top: 1rem` on focus.

### Sections and Notebook Spreads
`Section` = head (Rokkitt display title, optional lede) + content, on a `paper` tone (flat) or a `sand` tone (sand → paper vertical gradient; used by Dosieres and Propuestas). `SubSection` = the notebook spread described in Layout, with the terracotta running head. The programme inside a spread is two ruled pages: day label (Rokkitt uppercase) with its provisional chip, italic date, a `dl` of field labels, and sessions separated by 1px `line` rules with terracotta roman numerals (Rokkitt 0.9rem, 0.08em) as counters and muted times. The team strip heading carries a muted count label; the strip fades into paper at its right edge.

### Parchment Panels
The **Propuestas panel** is a 4:3 sheet of card parchment under the grain, 10px radius, event-poster shadow plus the 8% inset edge, rotated -1.5°, pinned at 12px, with the 160px compass in terracotta centred on it. The **Acoge panels** are a `1.1fr 0.9fr` pair: a 4:5 photograph (`hero-2-place`) and a 1:1 empty parchment surface raised 18%. Both panel groups are `aria-hidden` decoration beside a 62ch text column.

### Footer
Ink ground, sand text. The wordmark at 4.5rem in ivory, the full name in Rokkitt 0.875rem / 0.12em ivory, a 30ch Alegreya credit in sand, the badge at 5rem. Three columns (from 760px, `1.4fr 1fr 1fr 1fr` overall) titled in Barlow 0.75rem / 0.18em sand, with provisional chips on «Organiza» and «Colabora»; links are Barlow 1rem ivory, underlined on hover. A bottom bar over a 12% white rule carries notices in `line` colour at 0.875rem and a "top" link in the ivory label voice.

### Icons — "Tinta de frontera"
`components/icons/index.tsx`, drawn on a 64-unit grid, `currentColor`, `aria-hidden`, always beside a text label (guide §7 honoured). The four family icons: hat, compass and lantern are linear at stroke 2.5 with round caps and joins; the cactus is a filled silhouette. Used at 44px in waypoints, 56px in the empty state, 160px as the Propuestas panel motif (terracotta on parchment). Functional glyphs are simpler and heavier: arrow (18px, stroke 3), external (16px, stroke 4), menu, close (24px, stroke 4), chevron (14px, stroke 4), and one 12px filled star used solely as the hero rule's centre.

### Hero
The render's first screen rebuilt as interface: a paper → sand horizontal gradient, the lockup (wordmark `clamp(6rem, 13vw, 10.5rem)` tall beside the ruled event name) as the h1, a 26rem hairline rule with a terracotta star, the italic edition title with its provisional chip, the terracotta dateline in the label voice with its chip, one 34rem paragraph, then a primary and a secondary action. The photograph (`hero-1`, the signpost-free crop) is edge-bled and masked (see Layout) with the single script note over it.

### Surface and Picture
`Surface` guarantees a footprint: 10px radius, `overflow: hidden`, `aspect-ratio` from the media or the given ratio, background from a surface token, and `data-empty` when no media, which turns it into parchment (grain tile, 8% inset edge, 25% inset foot, pinned at 10px). `Picture` is a plain responsive `<img>` with `srcset`, explicit width/height, `object-position` from the focal point, lazy by default and eager/high-priority for the hero and for a sheet once its dialog opens.

## Do's and Don'ts

### Do:
- **Do** put every brand colour through `app/theme/palette.css`; components consume `--jia-*` tokens and no brand hex lives anywhere else.
- **Do** make terracotta (`#89482e`) the only action colour and deep terracotta (`#703923`) its only hover; use ink for structure and reading inks for text.
- **Do** build shadows from `rgb(47 24 11 / 0.35–0.55)` with a negative spread, and only under pinned images, the dialog and menu panels.
- **Do** keep radii on the six-step scale: 2px focus corner, 3px chips, 4px controls, 6px menus and scrollbar thumb, 8px waypoint tiles, 10px surfaces and panels.
- **Do** give every interactive element a 44px (buttons 48px) minimum height, a 3px terracotta focus ring offset 3px, and a keyboard and touch path to anything hover reveals.
- **Do** render an unavailable action as a transparent, dashed-`line`, muted, `aria-disabled` label with its note, and a missing image as pinned parchment (card + `--paper-grain` + 8% inset edge) at the same ratio.
- **Do** put a provisional chip only beside an unconfirmed fact (edition title, dateline, a jornada, Organiza / Colabora, the Talleres hint, a sheet title), never on a section heading or a card foot.
- **Do** set uppercase only in Rokkitt (0.02–0.10em) and Barlow (0.12em); keep every italic in Alegreya.
- **Do** carry a small tracked label only when it holds a real datum (venue, hours, format, theme, role, pending state); it is a field label, not a decoration.
- **Do** honour `prefers-reduced-motion` by removing the card lift, the reveal, the dialog rise and smooth scrolling; keep transitions at 160–320ms on `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Do** use the SVG wordmark via `<use href="/brand/jia-wordmark-derived.svg#mark">` and the family icons from `components/icons` with a visible text label.

### Don't:
- **Don't** typeset «JIA» in any font, add a bevel, 3D, thick outline or dramatic shadow to the lettering, or track its letters apart.
- **Don't** use pure black or pure white as a ground or text colour; ink `#2f180b` and ivory `#f6eedf` are the extremes.
- **Don't** set small reading text in copper (3.16:1) or olive (4.06:1); muted ink (4.93:1) is the floor.
- **Don't** introduce grey shadows, shadows on buttons, chips or the header, or frames around posters; a card is held by its terracotta pin and a parchment sheet by its 8% inset edge.
- **Don't** paint an empty surface as a flat copper, olive, terracotta or ink block, and don't put a label, kicker or category line above a card title; the theme is a «Temática» line after it.
- **Don't** repeat the hero's star rule, the handwritten note or the tilted poster as a pattern in other components.
- **Don't** use weapons, "Se busca / Wanted" framing, distressed or "burnt" textures on interface elements, or western props as controls; the family icons and functional glyphs are the whole vocabulary.
- **Don't** put text or controls under the paper grain layer's influence; the grain is a fixed layer at 0.07 opacity behind everything.
- **Don't** condense or horizontally scale a font; Rokkitt and Barlow Semi Condensed are already the narrow voices.
- **Don't** rely on hover: the sheet reveal is `aria-hidden` and removed on touch, and the sheet always opens from a real button.
