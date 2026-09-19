# 01 module — Selective text and active revision

Load only when authoring/using long coded documents or evaluating context retrieval. The kernel,
practice router and selected dependencies remain mandatory. This tool does not decide task scope.
Use `cat`, `rg` and `awk` for short/full reads and simple controlled text. A vector index, persistent
cache or arbitrary cross-file dependency graph is unnecessary for this workflow.

## Document contract

Identity is repository-relative file + stable H2 code: `## [CORE-00] Invariants`. Titles may change;
never reassign a published code to a different meaning. Moving a file needs updated references or
an explicit redirect. All H2 sections after the first coded H2 must be coded. Initial uncoded H2
prefaces are allowed and always retained. The whole preamble is returned with every get: universal
restrictions must never disappear to meet a token target. A long preamble should become a required
coded core; do not silently strip it.

Optional declarations have one canonical location in the source Markdown:

```markdown
<!-- sds-text:required CORE-00 -->
## [CORE-00] Invariants
Read these for every task.
## [READ-10] Focus
<!-- sds-text:depends CORE-00 -->
Read this only for the selected task.
```

The preamble may declare one `required` line; each section may declare one `depends` line. All
codes are ASCII uppercase letters/digits with hyphens, starting with a letter. The reader validates
the whole same-file graph, rejects cycles/missing codes, then returns required and requested
sections in dependency order, each once. `--require CODE` (repeatable) adds caller-known requirements
for legacy documents; it never removes declared requirements. Cross-file dependencies stay in the
existing router and require explicit additional reads. The tool cannot infer undeclared semantic
requirements or prove a decision correct; ambiguity requires more context.

Supported dialect: column-zero coded H2, backtick/tilde fences with 0–3 leading spaces, UTF-8/CRLF.
Headings inside fences are ignored. Unclosed fences, invalid/repeated IDs and malformed directives
fail. Setext headings, raw HTML blocks, list-contained/indented section boundaries and general
CommonMark parsing are outside this dialect; use native inspection or normalize an owned document
explicitly. A leaf symlink/device/FIFO is rejected; ancestor aliases resolve through the supplied
path. One bounded 2 MiB snapshot is read; concurrent in-place file changes are rejected. No links
are followed from document content; no commands or network are executed by the reader.

## Commands (from a governed project root)

```bash
./sds-dev-governance/scripts/sds-text list sds-dev-governance/examples/prompts/selective-context.md
./sds-dev-governance/scripts/sds-text get sds-dev-governance/examples/prompts/selective-context.md READ-10 --max-lines 180 --max-bytes 24000
./sds-dev-governance/scripts/sds-text check sds-dev-governance/examples/prompts/selective-context.md
./sds-dev-governance/scripts/sds-text index sds-dev-governance/examples/prompts/selective-context.md
```

In the kit itself, use `./scripts/sds-text` with `examples/prompts/selective-context.md`; in a
project the example is under `sds-dev-governance/examples/prompts/`. Replace the example path with
the actual owned document. `list` gives SHA and calculated line/byte ranges; `index` prints derived
Markdown to stdout, never edits the source. If saved separately, validate it with
`check FILE --index-file INDEX`. Do not maintain ranges by hand or use them as persistent identity.

Pin the source SHA learned from a reviewed `list`/`check` using
`get FILE CODE --expect-sha256 FULL_SHA256`. A mismatch stops the read with no partial stdout;
inspect the change and explicitly repin. `get` includes metadata, preamble and dependency closure.
All output, including metadata, must fit `--max-lines` (400 default) and `--max-bytes` (65536 default).
Never truncate a section: narrow the task or deliberately raise the budget. Exit 0 means a valid
selection/check, 2 invalid request/document/budget. No external index is needed for get.

## Freshness without automatic adoption

At phase entry, compare the active revision chosen for the task with local and remote facts:

```bash
./sds-dev-governance/scripts/governance-freshness.sh --kit sds-dev-governance --active-revision FULL_COMMIT_SHA --remote origin --timeout 5
./sds-dev-governance/scripts/governance-freshness.sh --kit sds-dev-governance --active-revision FULL_COMMIT_SHA --offline
```

Supply an actual full commit SHA recorded for the phase, not a moving branch name. Default ref is
`refs/heads/main`; annotated tags are peeled. Remote is the configured canonical origin or an
explicit trusted URL/path; authenticated HTTPS URLs and unsafe helper protocols are rejected.
No token/auth stderr is printed. Git protocol allowlist and process-group timeout bound the query.
It runs read-only Git and optional `ls-remote`: no fetch/pull/checkout, ref/file update, installation,
OAuth or revision adoption. The report alone never changes active governance.

A standalone kit/worktree records HEAD and dirty state; a vendored copy requires
`--expected-fingerprint FULL_V2_SHA256` saved outside the kit plus the explicitly trusted remote and
active SHA. Without that provenance, it remains unverified even if remote SHA matches. Compare
fingerprints using the distribution classifier; preserve local deltas and incubation. A matching
fingerprint proves the observed tree identity, not the trustworthiness of supplied provenance.

Exit 0 only for CURRENT with matching active/local revision and no dirty/provenance/concurrency
issues. Exit 1 is a factual report requiring attention: offline, unavailable/timeout, ahead,
diverged, unknown ancestry, local changes or pin mismatch. Exit 2 is invalid input/local query.
Unknown remote commits remain ancestry-unknown without fetching; never assume a different SHA is
newer. Offline means freshness unverified, not an upgrade failure or permission to change source.
For a true adoption follow the existing distribution contract, record before/after SHA and review
affected materializations. Personal capability admission does not transfer into a new project.

## Evaluation

Count bytes and tokens with an identified tokenizer separately. Include fixed governance, selected
practices, command instructions, indices, metadata, repeated/preamble reads, followups and output.
Logical retrieval calls, local subprocesses and measured latency differ from LLM calls and billing.
Publish corpus hashes, exact commands, repeated samples, completeness criteria and limitations.
75% is a target; short/full-read controls can cost more with a wrapper. The PM chooses scope,
acceptance and tradeoffs; passing scripted selection tests is not a blinded model evaluation.
