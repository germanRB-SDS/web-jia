# SDS R8 Analyzer

`sds-r8-analyzer` is the SDS-maintained, harness-portable R8 analysis skill installed globally for
Claude Code and Codex. Its source is versioned at `skills/runtime/sds-r8-analyzer/`, so every
governance bootstrap receives the same reviewed instructions instead of downloading a moving
upstream skill at runtime.

**Role:** read-only Android release optimization assessment. It discovers whether R8 is active for
the real release variant, reviews keep-rule risk, uses existing R8 artifacts, supports bounded
missing-rule/retrace diagnosis and prepares a separately authorized optimization change. It does
not edit Gradle/source, enable minification, publish, sign or approve a release.

## Human And Agent Surfaces

- Lightweight agent/governance router: `skills/README.md`
- Detailed human guide: this file
- Executable Agent Skill contract: `skills/runtime/sds-r8-analyzer/SKILL.md`
- Conditional workflow: `skills/runtime/sds-r8-analyzer/references/analysis-workflow.md`
- Report contract: `skills/runtime/sds-r8-analyzer/references/report-format.md`
- Attribution: `skills/runtime/sds-r8-analyzer/NOTICE.md`
- License: `skills/runtime/sds-r8-analyzer/LICENSE.txt`

Do not duplicate these instructions in adapters. Claude Code and Codex discover the installed
runtime bundle; governance agents use the lightweight router to decide whether it applies.

## Provenance And Migration

The derivative was created from a factual review of Google's official Android Agent Skill:

- Official docs: `https://developer.android.com/tools/agents/android-skills`
- Upstream: `https://github.com/android/skills/tree/main/performance/r8-analyzer`
- Observed revision: `725364add95396448b0c91c585265dbaf1c36987`
- Observed revision date: `2026-09-01`
- SDS derivative date: `2026-09-02`
- Upstream license: Apache-2.0

The observed upstream bundle contains `SKILL.md` and reference Markdown but no `scripts/`
directory, even though its quantitative paths invoke `convert_pb_to_json.py` and `analyze.py`.
`sds-r8-analyzer` intentionally removes those calls and all unsupported quantitative scores. It
adds independently authored activation, artifact, keep-rule, missing-rule, retrace, size-comparison
and validation guidance using tools already present in an Android project.

The custom name is intentional. Android CLI warns that an upstream update overwrites a customized
skill with the same name; `sds-r8-analyzer` avoids colliding with Google's `r8-analyzer`.

## Installation And Bootstrap

Every normal `init.sh` run synchronizes the bundled skill to both global homes:

```text
~/.claude/skills/sds-r8-analyzer/
~/.codex/skills/sds-r8-analyzer/
```

The equivalent manual command is:

```bash
./sds-dev-governance/scripts/install-skills.sh . --bundled-only
```

The installer uses the versioned governance copy and `rsync --delete` only inside those exact skill
directories. Re-running bootstrap updates the installed bundle idempotently. It performs no network
request in bundled-only mode. The full `--install-skills` flow installs the same bundle first and
then handles the other optional base tools.

Claude Code reads `~/.claude/skills/sds-r8-analyzer/SKILL.md`. Codex reads the equivalent Codex
directory and discovers a newly installed skill on its next turn/session.

## When To Use It

Use it when the user asks to:

- analyze or optimize Android R8/ProGuard configuration;
- determine whether shrinking/resource shrinking is active;
- review broad, redundant or dependency-owned keep rules;
- investigate R8 missing-class/rule output;
- compare like-for-like APK/AAB size evidence;
- retrace an obfuscated crash with the exact build mapping;
- plan a safe future change to enable or refine shrinking.

Do not activate it for generic Android performance, Play Console policy, signing, target API or
deployment work unless R8/shrinking is materially part of the request.

## Operational Model

1. Discover actual modules, variants, AGP/Gradle configuration and project commands.
2. Return `ACTIVE`, `INACTIVE` or `AMBIGUOUS` for the affected release variant.
3. Use effective/generated artifacts only when their build identity matches.
4. Classify keep-rule findings by correctness risk before size opportunity.
5. Keep fixes outside the analysis. A separate Change ID/branch implements and validates any
   recommendation.

If release minification is disabled, that is the primary conclusion: keep rules are not optimizing
the release. The report may prepare an activation plan, but must not silently enable R8.

## Security And Evidence

- `mapping.txt`, obfuscated traces and class inventories can expose implementation details. Do not
  commit or publish them wholesale.
- A mapping is valid only for the exact variant/version that produced the trace.
- Do not upload mappings or production traces to external services without explicit authorization.
- Preserve original R8 warnings and `missing_rules.txt`; do not use broad `-dontwarn` as a default
  fix.
- A successful bundle proves packaging, not reflection/serialization/JNI/runtime safety.

## Admission

Installation and catalogue presence do not authorize use in an SDS project. The exact
`sds-r8-analyzer` revision/mode must be recorded in
`docs/governance/capability-registry.md`; otherwise it is `NOT_EVALUATED`.

Recommended initial mode for evaluation:

- source: the `sds-dev-governance` commit containing the runtime bundle;
- scope: local read-only R8 analysis;
- writes: generated local build evidence only when explicitly needed;
- external effects: none;
- authority: advisory report only;
- removal: delete the exact global skill directories and update the ledger;
- constraints: no source edits, publication, secret transfer or release approval.

A changed runtime bundle is a new capability revision and reopens the affected admission gates.

## Removal And Recovery

Remove only:

```text
~/.claude/skills/sds-r8-analyzer/
~/.codex/skills/sds-r8-analyzer/
```

The versioned source remains in governance and a later bootstrap restores it. Removal does not
touch Android source, R8 rules or build artifacts. Update or deprecate the project ledger row so it
does not claim an absent revision remains admitted.
