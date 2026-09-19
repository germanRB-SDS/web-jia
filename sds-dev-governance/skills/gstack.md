# gstack

Source: `garrytan/gstack`

gstack provides Claude-first specialist workflows for planning, review, QA, security, and release.

## Install

The SDS catalog installs commit `ce5fbfa99ffb82fe445cae23a398a130dd643952`, runs its setup and
shares the Claude skill with Codex. Prefer the orchestrator:

```bash
./sds-dev-governance/scripts/install-skills.sh .
```

## SDS Usage

Use gstack as an execution accelerator. SDS remains authoritative.

| Workflow | gstack command | SDS-compatible behavior |
|---|---|---|
| Planning | `/autoplan` | Produce a scoped plan aligned with SDS levels and affected areas |
| Review | `/review` | Findings first, tied to files/lines and non-regression risk |
| QA | `/qa` | Browser/device checks where available; record verification |
| Security | `/cso` | OWASP/STRIDE review plus SDS security baseline |
| Design | `/design-review`, `/design-consultation`, `/design-shotgun` | Apply UI review without overriding project design reference |
| Release | `/ship`, `/land-and-deploy` | Follow SDS branching, Change ID, and pre-PR checklist |
| Retrospective | `/retro`, `/document-release` | Store concise traceability in `docs/prompts-output/` when applicable |

## Conflict Rules

If gstack and SDS disagree:

1. SDS branching and Change ID rules win.
2. SDS output and traceability rules win.
3. SDS security baseline wins.
4. Project-specific adapters win for repo paths, branches, and stack.

## Codex Equivalent

Codex does not need native gstack slash commands to use this guidance. For Codex:

- Treat `/review` as a code-review stance with findings first.
- Treat `/qa` as concrete verification against the affected UI/API flow.
- Treat `/ship` as SDS pre-PR validation.
- Treat `/cso` as a security/privacy review against changed surfaces.
