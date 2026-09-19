# Cross-Agent Skill Availability

How a skill this kit trusts becomes reachable from Claude Code, Codex and Gemini CLI without
duplicating content, without a per-agent fork, and without mutating an existing installation.

**Role:** this is plumbing, not authority. Bridging a skill into another agent does **not** admit
it. Status stays in `docs/governance/capability-registry.md`; see `skills/README.md` for the router.

## The problem it solves

Agent skills follow the open Agent Skills standard — a directory with a `SKILL.md` carrying YAML
frontmatter. All three agents read that format, but each discovers it in its own store:

| Agent | User-level store |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Codex CLI | `~/.codex/skills/` |
| Gemini CLI | `~/.gemini/skills/` (also accepts the `~/.agents/skills/` alias) |

Copying content into three stores creates three revisions that drift. The bridge links instead.

## Three tiers

Every skill is classified in `skills/cross-agent-portability.tsv`. A skill absent from that file is
`UNCLASSIFIED` and is **never** propagated — the policy is fail-closed.

- **`LINK` — direct link.** The `SKILL.md` is provider-neutral. One real directory stays wherever
  it already lives; the bridge symlinks it into each agent store. All agents read the same bytes,
  so a revision cannot diverge per agent.
- **`PORT` — curated rewrite.** The skill is useful but assumes the gstack runtime, Claude
  slash-commands, `AskUserQuestion`, subagents or telemetry. Codex and Gemini consume the SDS
  rewrite under `docs/codex-skills/from-claude/skills/`, installed by `install-skills.sh`. Both
  non-Claude agents get the **same** rewrite, so neither runs a silently different revision.
- **`CLAUDE_ONLY` — not portable.** Requires the gstack runtime, an iOS device bridge, a browser
  daemon or Claude host semantics. Deliberately not propagated; the rationale is recorded per row.

## Commands

```bash
# Report what would change; changes nothing. This is the default.
./sds-dev-governance/scripts/sync-agent-skills.sh

# Create the links.
./sds-dev-governance/scripts/sync-agent-skills.sh --apply

# Narrow the target agents, or record a hashed inventory.
./sds-dev-governance/scripts/sync-agent-skills.sh --apply \
  --agents "codex gemini" --inventory /tmp/agent-skill-inventory.tsv

# Regenerate the ordered index, or fail when it has drifted.
./sds-dev-governance/scripts/generate-skills-index.sh
./sds-dev-governance/scripts/generate-skills-index.sh --check

# Compare only the machine-independent part: the classified set, its classes, order and counts.
# This is what check-governance.sh runs, so the gate holds on any machine.
./sds-dev-governance/scripts/generate-skills-index.sh --check-policy
```

`install-skills.sh` runs the port install for Codex and Gemini and then the bridge, so the normal
bootstrap path already produces cross-agent availability.

## Guarantees

These are the properties the scripts actually enforce, not aspirations:

- **Dry-run by default.** Nothing is created unless `--apply` is passed.
- **Non-destructive.** The bridge never deletes a skill, never overwrites a real directory, and
  never rewrites a link that already points at the intended target. A divergent real directory is
  reported as `CONFLICT` and left alone; an independent copy whose `SKILL.md` hash matches the
  source is reported as `EQUIVAL` and left alone.
- **Idempotent.** A second run plans zero actions and exits `0`.
- **Fail-closed.** An unclassified or unrecognised entry is reported and skipped, never guessed.
- **Traceable.** `--inventory` writes `agent<TAB>skill<TAB>kind<TAB>sha256(SKILL.md)` so what each
  agent can actually read is a recorded fact, and `generate-skills-index.sh --check` turns local
  index drift into a failing gate. `--check-policy` is the repository-level gate: it asserts the
  index against the policy without asserting this machine's installations.
- **Reversible.** Every effect is a symlink. Remove the link and the agent stops seeing the skill;
  nothing else is touched.

## Limits

- Reachability means a readable `SKILL.md`. It does **not** assert that the skill's own runtime
  dependencies — a CLI, an MCP server, a browser — are installed for that agent.
- A skill that needs an MCP server still needs that server registered per agent. Spline is the
  worked example: its `SKILL.md` bridges to all three, its MCP bridge is registered separately.
- Gemini CLI must be installed for `~/.gemini/skills/` to be consumed. The bridge populates the
  store either way, so the skills are in place before the CLI ever runs.
- Upstream installers that write directly into one agent store — such as the `skills` CLI with
  `-a claude-code` — bypass this policy. Re-run the bridge afterwards so the other agents catch up.
