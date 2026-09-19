# R8 Analysis Report Format

Use concise evidence references; do not paste full mappings, traces or generated reports.

```markdown
# R8 Analysis

## Scope
- Module/variant:
- Revision/worktree:
- Requested mode: configuration | keep rules | missing rules | retrace | size comparison

## Activation
- Verdict: ACTIVE | INACTIVE | AMBIGUOUS
- Minification:
- Resource shrinking:
- AGP/Gradle/R8 source:

## Evidence
| Evidence | Build identity | Result |
|---|---|---|

## Findings
| Priority | Finding | Evidence | Confidence | Risk |
|---|---|---|---|---|

## Optimization Candidates
| Candidate | Why | Dynamic-reachability risk | Validation required |
|---|---|---|---|

## Missing Rules / Retrace
- N/A, blocked reason, or bounded findings.

## Size
- Baseline/current raw bytes and comparability, or `NOT MEASURED — reason`.

## Suggested Separate Change
- Exact files/settings that would change.
- Tests and release evidence required.
- Rollback artifact/condition.

## Blockers And Residual Risk
- Missing/mismatched evidence and conclusions that cannot be made.
```

Priority means:

- `P0`: correctness/build/runtime blocker;
- `P1`: high-risk over-retention or suppression with strong evidence;
- `P2`: bounded optimization candidate requiring validation;
- `P3`: measurement or maintenance improvement.

Use `VERIFIED`, `LIKELY`, or `UNVERIFIED` for confidence. A heuristic match is never `VERIFIED`
without the effective configuration or a matching build artifact.
