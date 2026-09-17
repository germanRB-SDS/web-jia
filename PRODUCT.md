# Product

<!-- impeccable:product-schema 1 -->

<!--
  Init substitution: the user instructed the agent to proceed without per-decision
  approval ("implementa sin detenerte esperando una aprobación", "Go"). Every fact
  below marked [brief] comes from assets/requirements/JIA-boceto-requisitos-y-metaprompt.md
  or assets/style/JIA_IDENTIDAD_VISUAL.md; facts marked [asset] were read from the
  posters/cards in assets/; facts marked [inferred] are the agent's reading and must
  be confirmed by the organisation.
-->

## Platform

web

## Stack

delegated: Next.js 16 (App Router, React 19, TypeScript, CSS Modules) with static HTML
export. Chosen because the user pointed at the sibling project `maryna-ventura` as the
architectural reference ("algo similar a lo de maryna ventura"), the repository was empty,
and the brief favours content served as HTML with no backend, CMS or forms. [inferred]

## Users

Primary: teachers (profesorado) of every educational stage in the province of Almería,
deciding whether to attend the Jornadas de Innovación de Almería (JIA), reading the
programme and the workshop line-up, and looking for classroom-transferable experiences and
materials. [brief]

Secondary: teachers who want to present a proposal, and schools/venues that might host a
future edition. [brief]

## Product Purpose

A landing page that presents the jornadas, explains how they work, lets visitors consult the
programme and workshops, gives visibility to transferable educational experiences and prepares
the participation channels (proposals, hosting). Success for this first delivery is a
functional, responsive sketch whose content and assets can be replaced from configuration
without touching components. [brief]

## Positioning

The only teacher-training event in Almería whose narrative thread is the province's own
western-cinema heritage: workshops are framed as film titles, the team is cast in character,
and the setting is the Almería landscape. Education is the content; western cinema is the
language. [brief]

## Operating Context

- Two days of jornadas. [brief] The poster `assets/cep/CARTEL #JIA26 (9).png` prints
  16/10/26 at Conservatorio de Danza Kina Jiménez (16:30–20:30) and 17/10/26 at CEIP Freinet
  (9:30–14:30 y 16:30–20:30). [asset, pending official confirmation]
- Workshops run during the jornadas; educational experiences are shared between them. [brief]
- Organised by the Centro del Profesorado de Almería (Junta de Andalucía); the poster also
  lists CEP de El Ejido, CEP de Cuevas Olula and collaborators. [asset]
- Hashtag/edition mark on all official assets: #JIA26. [asset]

## Capabilities and Constraints

- Five main areas in this order: Jornadas (programa, cómo funcionan, talleres), Dosieres,
  Experiencias (third, central), Propuestas, Acoge JIA. [brief]
- No backend, database, auth, CMS, registrations, form submission, analytics or production
  publishing in this delivery. [brief]
- Nothing hardcoded: palette, button labels, copy, media paths and URLs live in
  content/config sources; components consume them. Multi-language ready; Spanish only. [brief]
- Workshops, experiences and dossiers are distinct entities related by identifiers. [brief]
- Missing data is represented as `null` and rendered as an honest pending state; no invented
  people, schedules, results, forms or URLs. [brief]
- Detail sheets (fichas) must open by keyboard and touch, not only hover. [brief]
- Undecided: the edition title. The brief states «Aula de cine: El reto»; every poster prints
  «Aulas de cine: El duelo». Recorded as an open decision in `lib/content/site.ts`. [brief vs asset]
- Undecided: proposal channel URL, hosting form URL, dossier documents, experience cases.
- Undecided: whether the humorous "REWARD" lines on the team cards may be published. [inferred]

## Brand Commitments

- Name is always JIA (never GIA); full name «Jornadas de Innovación de Almería». [brief]
- Visual identity is fixed by `assets/style/JIA_IDENTIDAD_VISUAL.md` and the approved render
  `assets/images-website/JIA-render-base.png`: warm paper, JIA ink, terracotta accents,
  cinematic warm photography, "Tinta de frontera" icon family (hat, cactus, compass, lantern),
  JIA lettering with the cactus inside the A. [brief]
- The render is a style reference, not a screenshot to embed. [brief]
- Voice: educational, warm, inviting; western is the narrative language, never a costume.
  No weapons as signs; no "Se busca" posters as page language. [brief]

## Evidence on Hand

- Identity guide: `assets/style/JIA_IDENTIDAD_VISUAL.md` (read in full).
- Render: `assets/images-website/JIA-render-base.png` (1672×941).
- Hero photographs: `assets/images-website/hero-almeria-docentes.png` and
  `hero-2-almeria-docentes.png` (1672×941, both with baked-in signpost/backpack text).
- Official badge: `assets/cep/logo-variantes/#jIA26 LOGO.png` (1080², alpha) + 3 variants.
- Event poster: `assets/cep/CARTEL #JIA26 (9).png` (dates, venues, organisers, collaborators).
- 9 workshop posters in `assets/cep/talleres-carteles/` naming 6 workshops and 9 people.
- 31 team cards in `assets/images-staff/` naming people and roles (asesor/a CEP,
  coordinación, tallerista, colaborador/a).
- `assets/fonts/` is EMPTY: no western font was supplied. Fonts must be sourced and licensed.
- Absent and must not be fabricated: dossier documents, experience cases, schedules per
  session, speaker bios, proposal/hosting URLs, official confirmation of poster dates.

## Product Principles

1. Education is the content, western cinema is the language.
2. Every fact traces to an asset or the brief; anything else is visibly provisional.
3. Replace content, not components: editing a title, label, URL or image is a config change.
4. Honest states over fake completeness: no dead buttons, no broken images, no fake forms.
5. Reachable by everyone: keyboard, touch, zoom, reduced motion, sufficient contrast.

## Accessibility & Inclusion

Public-sector education audience. WCAG 2.2 AA contrast thresholds are named in the identity
guide as the acceptance bar. [brief]
