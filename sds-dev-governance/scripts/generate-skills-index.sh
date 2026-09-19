#!/bin/bash
# SDS Dev Governance — regenerate the ordered cross-agent skill index.
#
# Usage: ./sds-dev-governance/scripts/generate-skills-index.sh [--check|--check-policy]
#
# Writes skills/INDEX.md from the portability policy plus the observed local stores, so the
# index can never drift silently from what is actually installed.
#
#   --check         full match, including this machine's observed reachability. Local gate.
#   --check-policy  match only the machine-independent part: the classified skill set, its
#                   classes, its order and the tier counts. Reachability marks and per-agent
#                   counts are stripped from both sides first, so this is the part a repository
#                   can assert on any machine. This is what the governance checker runs.

set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/../skills"
POLICY="$SKILLS_DIR/cross-agent-portability.tsv"
OUT="$SKILLS_DIR/INDEX.md"
MODE="${1:---write}"

render() {
python3 - "$POLICY" <<'PY'
import io, os, sys, datetime
policy = sys.argv[1]
rows = []
for line in io.open(policy, encoding="utf-8"):
    line = line.rstrip("\n")
    if not line or line.startswith("#"):
        continue
    parts = line.split("\t")
    if len(parts) < 3:
        continue
    rows.append(tuple(parts[:3]))

home = os.path.expanduser("~")
AGENTS = ("claude", "codex", "gemini")

def present(agent, name):
    return os.path.isfile(os.path.join(home, f".{agent}", "skills", name, "SKILL.md"))

groups = {"LINK": [], "PORT": [], "CLAUDE_ONLY": []}
for name, cls, reason in rows:
    groups.setdefault(cls, []).append((name, reason))
for cls in groups:
    groups[cls].sort()

total = len(rows)
reach = {a: sum(1 for n, _, _ in rows if present(a, n)) for a in AGENTS}
tri = sum(1 for n, c, _ in rows if c != "CLAUDE_ONLY" and all(present(a, n) for a in AGENTS))

out = []
w = out.append
w("# Cross-Agent Skill Index")
w("")
w("Ordered inventory of every skill this governance kit knows about and which agent can reach it.")
w("")
w("**Generated file — do not edit by hand.** Regenerate with:")
w("")
w("```bash")
w("./sds-dev-governance/scripts/generate-skills-index.sh")
w("```")
w("")
w("`--check` fails when the committed index no longer matches the policy and the local stores.")
w("`--check-policy` compares only the machine-independent part — the classified skill set, its")
w("classes, its order and the tier counts — so a repository can assert it anywhere; that is the")
w("mode `check-governance.sh` runs. Classification is owned by")
w("`skills/cross-agent-portability.tsv`; a skill absent from that policy is never propagated.")
w("")
w("## Summary")
w("")
w("| Metric | Value |")
w("|---|---|")
w(f"| Classified skills | {total} |")
w(f"| Portable by direct link (`LINK`) | {len(groups['LINK'])} |")
w(f"| Portable by curated rewrite (`PORT`) | {len(groups['PORT'])} |")
w(f"| Not portable (`CLAUDE_ONLY`) | {len(groups['CLAUDE_ONLY'])} |")
w(f"| Reachable from Claude Code | {reach['claude']} |")
w(f"| Reachable from Codex | {reach['codex']} |")
w(f"| Reachable from Gemini CLI | {reach['gemini']} |")
w(f"| Reachable from all three | {tri} |")
w("")
w("Legend: `C` Claude Code, `X` Codex, `G` Gemini CLI. `✔` reachable locally, `·` absent.")
w("")

titles = {
    "LINK": ("Tier 1 — direct link", "Provider-neutral `SKILL.md`. One real directory, symlinked into every agent store, so all three agents read the same revision."),
    "PORT": ("Tier 2 — curated rewrite", "Useful but Claude/gstack-coupled. Codex and Gemini consume the SDS rewrite under `docs/codex-skills/from-claude/skills/`, never the Claude original."),
    "CLAUDE_ONLY": ("Tier 3 — not portable", "Requires the gstack runtime, a device bridge, a browser daemon, or Claude host semantics. Deliberately not propagated."),
}
for cls in ("LINK", "PORT", "CLAUDE_ONLY"):
    title, blurb = titles[cls]
    w(f"## {title} (`{cls}`)")
    w("")
    w(blurb)
    w("")
    w("```text")
    w(f"{cls.lower().replace('_', '-')}/")
    items = groups[cls]
    for i, (name, reason) in enumerate(items):
        branch = "\\--" if i == len(items) - 1 else "+--"
        marks = "".join(("C" if present("claude", name) else "·",
                         "X" if present("codex", name) else "·",
                         "G" if present("gemini", name) else "·"))
        w(f"{branch} [{marks}] {name}")
    w("```")
    w("")
    w("| Skill | C | X | G | Rationale |")
    w("|---|:-:|:-:|:-:|---|")
    for name, reason in items:
        cells = " | ".join("✔" if present(a, name) else "·" for a in AGENTS)
        w(f"| `{name}` | {cells} | {reason} |")
    w("")

w("## Notes")
w("")
w("- A `·` under Claude for a `LINK` row means the skill ships as a Claude *plugin* rather than a")
w("  filesystem skill, so there is no directory to bridge.")
w("- `CLAUDE_ONLY` rows are expected to show `·` for Codex and Gemini. That is the decision, not a gap.")
w("- Reachability is measured by following symlinks to a readable `SKILL.md`; it does not assert that")
w("  the skill's own runtime dependencies are installed.")
sys.stdout.write("\n".join(out) + "\n")
PY
}

# Strip everything that depends on what happens to be installed on this machine.
policy_view() {
  sed -e 's/\[[C·][X·][G·]\]/[***]/g' \
      -e 's/| [✔·] | [✔·] | [✔·] |/| * | * | * |/g' \
      -e '/^| Reachable from /d'
}

if [ "$MODE" = '--check' ]; then
  if [ ! -f "$OUT" ]; then
    echo "generate-skills-index: $OUT is missing" >&2
    exit 1
  fi
  if diff -q <(render) "$OUT" >/dev/null; then
    echo "OK: skills/INDEX.md matches the policy and the local stores"
  else
    echo "FAIL: skills/INDEX.md is stale; run generate-skills-index.sh" >&2
    exit 1
  fi
elif [ "$MODE" = '--check-policy' ]; then
  if [ ! -f "$OUT" ]; then
    echo "generate-skills-index: $OUT is missing" >&2
    exit 1
  fi
  if diff -q <(render | policy_view) <(policy_view < "$OUT") >/dev/null; then
    echo "OK: skills/INDEX.md matches the portability policy (machine-independent view)"
  else
    echo "FAIL: skills/INDEX.md no longer matches skills/cross-agent-portability.tsv" >&2
    diff <(render | policy_view) <(policy_view < "$OUT") | head -40 >&2
    exit 1
  fi
else
  render > "$OUT"
  echo "OK: wrote $OUT"
fi
