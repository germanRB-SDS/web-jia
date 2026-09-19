# Impeccable

Source: `pbakaus/impeccable`

Impeccable is a frontend design skill derived from Anthropic's `frontend-design` direction and
expanded with deterministic anti-pattern checks, design references, and UI workflow commands.

## Purpose

Use Impeccable to avoid generic AI UI defaults:

- Overused Inter/system-only typography.
- Purple-to-blue gradients by default.
- Nested cards and card-heavy layouts.
- Gray text on colored backgrounds.
- Rounded-square icon tiles above every heading.
- Weak hierarchy, spacing, responsive behavior, or UX copy.

## What It Provides

Domain references:

| Reference | Covers |
|---|---|
| `typography` | Type systems, font pairing, modular scales, OpenType |
| `color-and-contrast` | OKLCH, tinted neutrals, dark mode, accessibility |
| `spatial-design` | Spacing systems, grids, visual hierarchy |
| `motion-design` | Easing curves, staggering, reduced motion |
| `interaction-design` | Forms, focus states, loading patterns |
| `responsive-design` | Mobile-first, fluid design, container queries |
| `ux-writing` | Button labels, error messages, empty states |

## Install

From the project root:

```bash
npx --yes impeccable@4.1.1 skills install
```

This auto-detects the agent harness and writes to the correct location, such as `.claude/skills/`
or equivalent harness folders.

The catalog orchestrator pins this version and runs it by default during bootstrap.

## SDS Usage

Install per project when the project has UI.

Recommended commands in Claude-compatible harnesses:

| Command | SDS use |
|---|---|
| `/impeccable init` | Generate `PRODUCT.md` and `DESIGN.md` at project start |
| `/impeccable document` | Generate `DESIGN.md` from existing code |
| `/impeccable shape` | Plan UX/UI before implementation |
| `/impeccable critique` | Review hierarchy, clarity, emotional resonance |
| `/impeccable audit` | Check accessibility, performance, responsive behavior |
| `/impeccable polish` | Final UI pass before ship |
| `/impeccable harden` | Edge cases, i18n, text overflow, error handling |
| `/impeccable adapt` | Device-specific adaptation |
| `/impeccable clarify` | Improve UX copy |

For Codex or agents without slash commands, apply the same behavior manually:

1. Inspect the UI and existing design system.
2. Check the anti-pattern list.
3. Validate responsive, accessibility, motion, typography, and copy.
4. Patch code using project-native patterns.
5. Verify with screenshots or local UI checks where possible.

## SDS Priority

Impeccable improves UI quality. It does not override:

- `sds-dev-governance/practices/06-non-regression.md`
- `sds-dev-governance/practices/10-pre-pr-checklist.md`
- project-specific accessibility, branding, or product requirements
