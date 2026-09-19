---
name: sds-r8-analyzer
description: Analyze Android R8, shrinking and ProGuard configuration using project files and real build artifacts. Use for app-size reviews, broad or redundant keep rules, missing-rule diagnostics, obfuscated crash retracing, or deciding whether release optimization is actually active. Analysis-only unless the user separately requests implementation.
metadata:
  author: South Desert Studio
  derived-from: android/skills performance/r8-analyzer
  upstream-revision: 725364add95396448b0c91c585265dbaf1c36987
  last-updated: '2026-09-02'
---

# SDS R8 Analyzer

Produce an evidence-backed R8 assessment without changing project files. This skill is a maintained
derivative of Google's `r8-analyzer`; it removes quantitative paths whose referenced scripts are not
present in the observed upstream bundle and adds practical artifact, retrace and activation checks
that work in Claude Code and Codex.

## Route The Analysis

1. Read the applicable project adapter/governance and discover the real Android modules, build
   system, release variants and existing validation commands.
2. Read [references/analysis-workflow.md](references/analysis-workflow.md). Use only the sections
   matching the request:
   - configuration and activation for every R8 review;
   - keep rules and artifacts when shrinking is active or prior release artifacts exist;
   - missing rules when the build emitted them;
   - retrace only when an obfuscated trace and its exact mapping are available.
3. Follow [references/report-format.md](references/report-format.md) for the result.

## Essential Boundaries

- Do not edit Gradle files, keep rules or source under this skill. If the user requests fixes,
  finish the analysis first and treat implementation as a separate authorized change.
- Do not enable `isMinifyEnabled`, remove keep rules or upgrade AGP merely to make the analysis
  interesting. Report the discovered state.
- Run a build only when it is necessary, uses a discovered project command, stays local and cannot
  publish or expose signing credentials. Otherwise analyze existing files/artifacts and record the
  missing evidence.
- Do not call `convert_pb_to_json.py`, `analyze.py` or claim keep-radius/quantitative scores unless
  those tools are actually present and independently trusted in the project. They are intentionally
  not part of this derived skill.
- Treat `mapping.txt`, obfuscated traces and class/package inventories as potentially sensitive
  implementation evidence. Never commit or paste them wholesale.
- A successful build proves packaging, not behavioral safety. Keep-rule changes require tests for
  reflection, serialization, JNI, dependency injection, service loading and other dynamically
  reached paths that the affected app actually uses.

## Evidence Rules

- Distinguish configured intent from the effective release variant.
- Distinguish suggestions from verified findings. No size reduction, rule redundancy or retrace
  result is verified without matching artifacts.
- Use the mapping produced by the exact build that generated an obfuscated trace. A mapping from a
  different version or variant is unusable.
- Prefer project-local Gradle/R8 versions and generated reports over generic fixed-version advice.
- Preserve warnings and `missing_rules.txt`; never turn `-dontwarn` into the default response.

## Completion

Return the structured report with the current activation state, evidence, findings ordered by
correctness risk, bounded optimization opportunities, validation needed for any future change and
all blockers or unavailable measurements. Do not imply that the app is optimized or release-ready
when the evidence only establishes configuration.
