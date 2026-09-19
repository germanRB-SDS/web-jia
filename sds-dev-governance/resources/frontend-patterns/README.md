# SDS Frontend Patterns

This folder contains optional frontend reference material extracted from proven project UI work.

It is not part of the default SDS read order. Agents must load it only when the user or active
prompt explicitly asks for frontend patterns, UI components, UI animations, color palettes, or this
path.

**Start from the index, not from the folders.** Read `../index-of-resources-and-working-patters.md`
(the single index of every resource) to find what exists and where, then open only that one leaf
folder. Browsing folder by folder wastes context and cost.

## Contents

- `ui-components/` — reusable interaction components with HTML/CSS/JS examples.
- `ui-animations/` — motion and visual effects that can be attached to components.
- `color-palettes/` — project palette references that can seed a new design system.
- `site-compositions/` — whole-page sequence, rhythm, hierarchy and responsive relationships.

## Rules

- Load only the specific pattern requested.
- Treat examples as portable references, not runtime source of truth.
- Adapt visible copy through the target project's copy/i18n layer.
- Adapt colors through the target project's design tokens.
- Keep accessibility, responsive behavior, and reduced-motion behavior intact.
- For progressive filters, preserve hidden criteria and apply the same normalized state to search,
  autocomplete suggestions, pagination, and the rendered result set.
- Do not import Teragenda business data or project-specific route/state names into another project.
- **Restrictive rule:** when you add, rename, move, or remove a working resource, you MUST update
  `../index-of-resources-and-working-patters.md` in the same change. Enforced by `check-governance.sh`.

## Source projects

These examples are extracted from proven owned frontend work. Source findings and applicable
anchors are listed inside each pattern index; examples remain portable and contain no business data.
