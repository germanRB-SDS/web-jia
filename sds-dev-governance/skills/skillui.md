# skillui

Source: `amaancoderx/skillui`

skillui is an npm CLI that extracts design information from a website, repository, or local project:
colors, typography, spacing, components, and animation cues.

## Install

```bash
npm install -g skillui@1.3.4
```

The catalog orchestrator runs this pinned installation by default during bootstrap.

## Example

```bash
skillui --url https://example.com --mode ultra
```

## SDS Usage

Use skillui only when a project needs to align with a real visual reference.

Recommended flow:

1. Run skillui against the reference.
2. Save or summarize the extracted tokens and components.
3. Use Impeccable or manual review to turn the extraction into project-specific `DESIGN.md`.
4. Record the active reference in the shard routed by `docs/memory/index-frontend.md` when that
   index exists; otherwise use the valid flat `docs/memory/frontend.md`.

skillui is a tool, not governance. It should not impose UI choices without project approval.
