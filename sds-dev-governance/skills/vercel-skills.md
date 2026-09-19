# Vercel Agent Skills

Vercel Agent Skills are harness-portable skills for deploying, configuring and optimizing projects
hosted on Vercel. They are distributed through the open `skills` CLI and installed once into a
shared universal store that each supported agent reads.

**Role:** deployment and hosting-cost execution accelerators. They act on external infrastructure
(deployments, environment variables, project settings, billing-relevant configuration), so they are
effect-bearing capabilities, not read-only guidance. SDS release, security and traceability rules
remain authoritative over every action they take.

## Source

- Skills repository: `https://github.com/vercel-labs/agent-skills`
- Distribution CLI repository: `https://github.com/vercel-labs/skills`
- Package: `skills` (binaries `skills`, `add-skill`)
- Catalog: `https://skills.sh/vercel-labs/agent-skills`

`vercel-labs/skills` is the installer, not the skill content; it ships only its own `find-skills`
skill. Do not vendor either upstream repository into SDS. Install from the published package and
commit only project-scoped adapter files when a project needs them.

## Install

Install the CLI once, then install the Vercel skills globally for the agents in use:

```bash
npm install -g skills
skills add vercel-labs/agent-skills \
  --skill deploy-to-vercel \
  --skill vercel-cli-with-tokens \
  --skill vercel-optimize \
  -g -a claude-code -a codex -y
```

The CLI writes one copy per skill to the universal store `~/.agents/skills/<skill>` and links each
agent to it. Claude Code is linked automatically under `~/.claude/skills/`. Codex is registered as
a universal consumer; when `~/.codex/skills/<skill>` is absent after install, link it explicitly so
the skill is discoverable:

```bash
ln -s ../../.agents/skills/<skill> ~/.codex/skills/<skill>
```

Because agents share one store, an update or removal through `skills update` / `skills remove`
affects every linked agent at once. Treat the store as a single capability revision, not as
per-agent copies.

## Included Capabilities

| Skill | Capability | Primary effect |
|---|---|---|
| `deploy-to-vercel` | Deploy an application or site | Creates deployments; preview by default |
| `vercel-cli-with-tokens` | Non-interactive CLI operations | Uses access tokens; writes env vars and project settings |
| `vercel-optimize` | Cost and performance analysis | Reads metrics, usage and config; proposes ranked changes |

The remaining skills in the upstream repository (`react-best-practices`, `web-design-guidelines`,
`react-view-transitions`, `composition-patterns`, `writing-guidelines`, `react-native-skills`) are
not part of this entry. They overlap the frontend guidance already owned by Impeccable and the
project `DESIGN.md`, so each would need its own admission decision before use.

## SDS Usage

| Workflow | Skill | SDS-compatible behavior |
|---|---|---|
| Preview deployment | `deploy-to-vercel` | Preview target only; record the URL as verification evidence for the Change ID |
| Production deployment | `deploy-to-vercel` | Explicit human authorization per release; never inferred from a preview request |
| CI/token operations | `vercel-cli-with-tokens` | Tokens come from the environment or the platform secret store, never from repository files |
| Hosting cost review | `vercel-optimize` | Findings first, tied to metrics and files; changes follow normal branching and review |

## Constraints

1. Preview is the default deployment target. Production deployment is an outward-facing release and
   follows the pre-PR checklist and branching rules, with the Change ID recorded.
2. Access tokens are secrets. Do not write `VERCEL_TOKEN` or any project token into repository
   files, prompts, outputs or `docs/prompts-output/`. The SDS security baseline and secret scan
   apply unchanged.
3. Environment-variable and project-setting writes are configuration changes with production blast
   radius. Classify them before executing and record what was changed and where.
4. `vercel-optimize` reads usage and billing-adjacent data. Its raw output may expose account-level
   information; summarize findings in project documentation instead of pasting account dumps.
5. These skills run with full agent permissions and reach an external service. A deployment cannot
   be un-published by deleting a local file; treat every deploy as irreversible disclosure of the
   built artifact.

## Conflict Rules

If Vercel skill guidance and SDS disagree:

1. SDS branching, Change ID and release rules win.
2. SDS security baseline and secret handling win.
3. SDS output and traceability rules win.
4. Project-specific adapters win for repo paths, branches, environments and stack.

## Agent Compatibility

- Claude Code discovers the skills as native skills once linked.
- Codex reads `~/.codex/skills/`; apply the same documented workflow when slash-command equivalents
  are unavailable.
- Cursor, Gemini and other supported agents install through the same CLI with their own `--agent`
  target and read the same guidance through their adapters.

## Admission

A catalog entry is documentation of provenance, not authorization. Each effective mode — skill,
version, agent scope and whether production deployment or token-writing operations are enabled —
needs its own row in the project `docs/governance/capability-registry.md` before use. An unlisted
mode is `NOT_EVALUATED`.
