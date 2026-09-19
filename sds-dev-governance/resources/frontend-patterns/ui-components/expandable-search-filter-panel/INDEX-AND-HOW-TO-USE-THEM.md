# Expandable Search Filter Panel

## 1. What This Pattern Is

A bordered panel with two independent progressive-disclosure controls:

1. a stable panel header whose chevron collapses or expands the panel body; and
2. a search toolbar that starts as a wide search field plus a filter-icon button. Activating the
   filter button contracts the search field and reveals aligned select/input filters between the
   search and the icon.

Filter values remain active when their controls are hidden. Search results and autocomplete
suggestions must always use the same complete filter state.

## 2. When To Use It

Use it for administrative catalogs, dashboards, tables, or card lists where search is the primary
action and secondary filters should remain available without permanently consuming horizontal or
vertical space.

## 3. When Not To Use It

- Do not hide filters that are required to understand every result without also showing a persistent
  active-filter indicator.
- Do not use it for destructive actions or to conceal validation errors.
- Do not collapse a panel body if doing so would interrupt an in-flight save or discard user input.
- Do not couple visual disclosure state to backend filter semantics.

## 4. Source Findings

This portable example distills the proven Superadmin business-catalog interaction introduced in
Teragenda `[42-1s]`. It deliberately removes tenant names, routes, API payloads, and project-specific
selectors. The source behavior established these reusable findings:

- one header/body disclosure preserves form values while moving focus before `inert` is applied;
- one filter disclosure preserves selected criteria while changing only layout/visibility;
- labels and controls use equal grid rows so their vertical coordinates remain aligned;
- select filters apply on `change`; Enter in search uses the same apply path;
- state filters constrain autocomplete as well as the final list;
- reduced-motion users receive the same final states without transitions.

## 5. Files In This Example

- `html/expandable-search-filter-panel.html`
- `css/expandable-search-filter-panel.css`
- `javascript/expandable-search-filter-panel.js`

## 6. Integration Steps For Another Project

1. Move visible labels, button names, placeholders, and messages to the target copy/i18n layer.
2. Map the CSS custom properties to the target design-token layer.
3. Keep panel disclosure state separate from filter values and result-loading state.
4. Route search submit, filter `change`, pagination changes, and autocomplete requests through one
   normalized filter-state reader.
5. If hidden criteria are non-default, add a persistent badge/dot/count to the filter icon.
6. Replace the example custom event with the project's controller/store/query mechanism.
7. Keep a real submit path so Enter continues to work without pointer interaction.

## 7. Accessibility Checklist

- Disclosure controls are real buttons with `aria-expanded` and `aria-controls`.
- Hidden groups use `aria-hidden` and `inert`; move focus to the controlling button before hiding.
- Decorative SVGs use `aria-hidden="true"`; accessible names come from copy/i18n.
- Search remains a labeled search input and submits with Enter.
- Focus-visible states remain clear in both active and inactive modes.
- Collapsing the panel never resets typed or selected values.

## 8. Responsiveness Checklist

- Desktop: search, revealed filters, and icon share one aligned row.
- Narrow screens: search + icon stay on the first row; revealed filters stack below at full width.
- All grid children use `min-width: 0` to prevent overflow.
- Touch targets remain at least 44 x 44 px.

## 9. Reduced-Motion Behavior

Disable grid, opacity, chevron, color, and shadow transitions inside
`prefers-reduced-motion: reduce`. Disclosure must still switch state immediately.

## 10. Constants/i18n/token Adaptation Notes

- Copy/i18n owns labels, placeholders, tooltip/title text, and dynamic accessible names.
- Design tokens own surface, border, text, focus, accent, radius, control height, spacing, and motion.
- Business state values and query parameters belong to the consuming data contract, not this pattern.
- The example's `detail` payload is illustrative and must not become an implicit API contract.

## 11. Common Failure Modes

- Clearing hidden filters when the filter controls close.
- Showing an inactive-looking icon while hidden non-default filters still constrain results.
- Filtering the list by state but leaving autocomplete unscoped.
- Animating width directly and causing layout thrash instead of transitioning grid tracks.
- Hiding focused controls without moving focus first.
- Removing the submit affordance entirely and breaking Enter.
- Using different control heights, label margins, or top padding that visibly misalign the row.

## 12. Minimal Verification Checklist

- Search expands when filters are closed and contracts when they open.
- Revealed labels and controls share the same vertical geometry.
- Select changes apply immediately; Enter applies search.
- Closing/reopening filters preserves values and effective query state.
- Autocomplete/result requests receive identical active criteria.
- Panel collapse preserves values and exposes a correctly oriented chevron.
- Keyboard focus never remains inside an `inert` subtree.
- Desktop and mobile layouts have no horizontal overflow.
- Reduced-motion mode has no disclosure transition.

