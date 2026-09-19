# REL-2026-09-19-01 — evidence

- `bootstrap-project.json`: `init.sh fixture <tmp> --mode project --files-only` from the release branch (exit 0).
- `check-project.txt`: `check-governance.sh` on that fixture — 639 OK, 0 FAIL, "check passed"; `tree-3d` indexed.
- `test-*.txt`: inherited suites. `test-mcp-control.py.txt` fails under the system `python3` (< 3.11, no `tomllib`)
  exactly as on the untouched `v1.28.0` tree; `test-mcp-control.py.python3.14.txt` is the same suite, green.
  `test-governance-freshness.py.txt` failed once on its 0.2 s timeout case and passed 3/3 on re-run
  (`.rerun.txt`); the same test passes on a pristine `v1.28.0` worktree: timing, not this change.
- The `vanilla/` demo of `resources/web-components/tree-3d` was served locally and rendered in real Chrome
  (headless, SwiftShader): canvas mounted, no console error; capture in the leaf's `preview/`.
