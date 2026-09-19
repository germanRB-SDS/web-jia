# Selective context example

PREFACE — NON-EXECUTABLE. This document demonstrates retrieval, not permission to execute.
<!-- sds-text:required CORE-00 -->

## [CORE-00] Scope and authority

Preserve existing work and read the applicable project governance. No external mutation is
requested by this example. Keep this section in every selection.

## [READ-10] Read a focused section

<!-- sds-text:depends CORE-00 -->
Use the installed `scripts/sds-text` from the kit. `get FILE READ-10` returns the preamble,
CORE-00 and this section. Use the SHA from `list FILE` with `--expect-sha256` to detect changes.

## [CHECK-20] Verify the followup

<!-- sds-text:depends READ-10 -->
`get FILE CHECK-20` includes both dependencies exactly once. A budget failure produces no partial
selection. Read unrelated sections only when the task needs them.
