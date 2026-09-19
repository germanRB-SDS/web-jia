# Design References

Source: `voltagent/awesome-design-md`

`awesome-design-md` is a catalog of real `DESIGN.md` references for known products and brands.

## Purpose

Use the catalog when a project needs a visual direction but does not yet have a design system.

This is not installed globally. It is a reference library selected per project.

## SDS Usage

1. Pick a reference intentionally.
2. Copy or summarize the selected `DESIGN.md` into the project only when it is active.
3. Record the selected reference in the shard routed by `docs/memory/index-frontend.md` when that
   index exists; otherwise use the valid flat `docs/memory/frontend.md`.
4. If project UI already exists, prefer `/impeccable document` or equivalent inspection before using an external reference.

## Relationship With Impeccable

- `awesome-design-md` inspires or seeds a design direction.
- Impeccable audits, documents, hardens, and polishes the actual UI.
- skillui extracts from a live reference when no `DESIGN.md` exists.

## Do Not

- Do not silently copy a brand style into a product without user approval.
- Do not mix multiple references without documenting which parts are active.
- Do not let the reference override accessibility, usability, or SDS non-regression rules.
