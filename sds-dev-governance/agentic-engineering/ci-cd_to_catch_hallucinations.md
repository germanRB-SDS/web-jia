# CI/CD to catch hallucinations and typical AI-agent failure modes

> **agentic-engineering** area of SDS. This is the *automated, pre-human-review* layer. It complements
> `ai-code-assurance.md` (the human/agent self-audit at PR time) with machine gates that fail before a
> reviewer spends attention. It follows SDS philosophy — gates, preflight, checks, final reports — and
> is **surgical and stack-aware**, not a generic CI tips list. Load discipline: same as the area
> trigger — read when preparing/closing a change into a PR/MR, not as static context.

## What machines can and cannot catch (read this first)

The single most common mistake is over-claiming what one tool detects. Be precise:

- **Lockfiles do NOT detect hallucinated imports.** A lockfile detects **drift between the dependency
  manifest and the lockfile** (a declared/installed dependency graph that is out of sync). `npm ci`,
  `pnpm install --frozen-lockfile`, `yarn install --immutable`, and `poetry check --lock` fail on that
  drift — nothing more.
- **A hallucinated dependency** (code importing a package that was never added, or an invented name) is
  caught when the code is **resolved**: install + lint import-resolution + typecheck + build + tests.
- **Unresolved imports** (a symbol/module that does not exist) are caught by **linting, type checking,
  builds, and tests** — not by lockfiles.
- **Vulnerable/deprecated/typosquatted/suspicious packages** are a **supply-chain** concern:
  `npm audit` / `pip-audit` cover *known vulnerabilities*; typosquats and "suspicious" packages need
  **dependency review** and the human protocol below — no audit tool guarantees their absence.

Keep these distinctions in every gate and in the control matrix. Do not collapse them.

## 1. Discover the stack before proposing commands

An agent MUST detect the stack from repository files before recommending any command. Never invent
commands for a stack that is not present.

| Stack | Detect by presence of | Frozen-install / lock check |
|---|---|---|
| Node / npm | `package.json` + `package-lock.json` | `npm ci` |
| Node / pnpm | `package.json` + `pnpm-lock.yaml` | `pnpm install --frozen-lockfile` |
| Node / yarn | `package.json` + `yarn.lock` | `yarn install --immutable` |
| Python / Poetry | `pyproject.toml` + `poetry.lock` | `poetry check --lock` |
| Python / pip | `requirements*.txt` (+ optional constraints) | `pip install -r … ` against pinned files |
| Other (Go, Rust, Java, …) | `go.mod`/`go.sum`, `Cargo.toml`/`Cargo.lock`, `pom.xml`, … | **Document the stack-native equivalent; do not invent commands.** |

Discovery commands are read-only: list manifests and read the existing scripts (`package.json`
"scripts", `Makefile`, `pyproject.toml` `[tool.*]`, CI files under `.github/workflows/` or
`.gitlab-ci.yml`). **Prefer repository-native scripts over any command in this guide.**

## 2. Node / npm controls

- Use **`npm ci`** in CI, never `npm install`. `npm ci` requires `package.json` and
  `package-lock.json` to be in sync and installs exactly the lockfile — it fails on drift and on a
  missing/renamed dependency.
- **`npm audit --audit-level=high`** when a lockfile is present. Treat as advisory or blocking per the
  adoption level; audit covers *known* vulnerabilities only.
- Run **`npm run lint`**, **`npm run typecheck`**, **`npm run build`** *only if those scripts exist*
  (`npm run <script> --if-present`). Do not invent script names.
- Recommended ESLint rules (add only what applies to the repo):
  - **`no-empty`** with **`{ "allowEmptyCatch": false }`** — flags empty/silent blocks, including empty
    `catch`.
  - **`no-unsafe-finally`** — flags `return`/`break`/`continue`/`throw` inside `finally` (the JS
    equivalent of Ruff B012).
  - **`@typescript-eslint/no-floating-promises`** — flags promises without `await`/`.then`/`.catch`.
  - **`@typescript-eslint/no-misused-promises`** — flags promises passed where a non-promise is
    expected (e.g. as an `if` condition or a non-async handler).
- The `@typescript-eslint` type-aware rules need the TS parser with type information
  (`parserOptions.project` / `projectService`). **Do not impose TypeScript on a repo that does not use
  it.** In plain JS, floating-promise detection is limited; rely on tests and code review there, and say
  so rather than pretending a rule covers it.
- Unresolved imports in Node: `eslint-plugin-import`'s `import/no-unresolved`, or the build/typecheck,
  or failing tests.

## 3. Python controls

- **`poetry check --lock`** if Poetry is used — verifies `pyproject.toml` and `poetry.lock` are
  consistent (drift detection).
- **`pip-audit`** when applicable — known-vulnerability scan of the resolved environment or a pinned
  requirements file.
- **Ruff** with `select = ["E", "F", "B", "BLE"]`:
  - **`F`** (Pyflakes) catches undefined names (`F821`) and unused imports (`F401`) — a large share of
    hallucinated/unresolved Python imports.
  - **`E722`** (in `E`) — prevents **bare `except:`**.
  - **`BLE001`** (in `BLE`) — prevents **blind `except Exception:`**.
  - **`B012`** (in `B`, flake8-bugbear) — prevents **`return`/`break`/`continue` inside `finally`**,
    because it silently suppresses in-flight exceptions.
- **Do not invent invalid Ruff configuration.** There is no `[tool.ruff.lint.rules]` table that maps
  rules to an "error" severity. In Ruff, a selected rule that triggers makes `ruff check` **exit
  non-zero**, which already fails CI. Selection *is* the enforcement.
- Deep type/import checking beyond Pyflakes: add `mypy` or `pyright` only if the repo already uses type
  hints and a type checker; do not impose one.

## 4. Recommended gate order

Fail cheap and fast first; run expensive gates last.

| # | Gate | Purpose |
|---|---|---|
| A | Syntax / lint / static analysis | Catch empty catches, bare/blind except, unsafe finally, floating promises, unused/undefined imports |
| B | Lockfile verification | Manifest ↔ lockfile drift (frozen install) |
| C | Dependency audit / dependency review | Known vulnerabilities; new-dependency review (typosquat/suspicious/license) |
| D | Typecheck / build | Unresolved imports, type/contract breakage |
| E | Unit tests | Behavior, including unhappy paths |
| F | Coverage threshold or coverage regression | No silent loss of coverage |
| G | Smoke / E2E tests | End-to-end reality |
| H | Final report | Verifiable evidence recorded (SDS traceability) |

Gate **H** ties to SDS: the change must leave verifiable evidence in its output/final report
(`docs/prompts-output/<PROMPT_ID>/…`, see practices `03-output-traceability` and
`14-phase-commit-report`). A change "without verifiable evidence in the final report" is itself a
failure mode: the report must cite the exact commands run and their results.

## 5. Coverage without dogma

Do **not** impose a universal 80% threshold. Instead:

- **Preserve the existing threshold** if the repo already defines one.
- If none exists, start with **"no coverage regression"** (compare against the base branch; block only
  on a drop).
- Require tests for **modified files or critical logic**, not for the whole codebase.
- **Require unhappy-path tests** when the change touches: **auth, payments, bookings, permissions,
  tokens, personal data, calendars, external integrations, or persistence.** For these, a green
  happy-path suite is not sufficient signal.

## 6. Control matrix

| AI failure mode | Automatic control | Stack | Command or rule | Recommended severity | When to block | Allowed exception |
|---|---|---|---|---|---|---|
| Hallucinated dependency (import of a non-added package) | Frozen install + lint import-resolution + typecheck/build + tests | Node | `npm ci`; `import/no-unresolved`; `npm run build --if-present` | High | Level ≥ 3 | Never for prod code; a documented spike branch may defer |
| Manifest ↔ lockfile drift | Frozen install / lock check | Node/Python | `npm ci` · `pnpm i --frozen-lockfile` · `yarn --immutable` · `poetry check --lock` | High | Level ≥ 3 | None |
| Vulnerable package | Audit | Node/Python | `npm audit --audit-level=high` · `pip-audit` | High | Level ≥ 4 (or High CVEs at ≥3) | Documented, time-boxed advisory with owner sign-off |
| Deprecated package | Install-time deprecation notice / review | Node | `npm ci` output; manual review | Medium | Advisory | Track for replacement |
| Typosquatted / suspicious package | Dependency review + human protocol | Any | `actions/dependency-review-action`; §Dependency Addition Protocol | High | Level ≥ 4 + review | None (supply-chain) |
| Unnecessary package | Unused-dependency scan / review | Node | `depcheck` (advisory) | Low | Advisory | Justify in protocol |
| Unresolved import / undefined symbol | Lint + typecheck + build + tests | Node/Python | `import/no-unresolved`; TS build; Ruff `F821`/`F401` | High | Level ≥ 3 | None |
| Promise without await/catch | Type-aware lint | Node (TS) | `@typescript-eslint/no-floating-promises` | High | Level ≥ 3 (TS repos) | Plain-JS repos: covered by tests/review, documented |
| Promise misused (e.g. async in non-async slot) | Type-aware lint | Node (TS) | `@typescript-eslint/no-misused-promises` | High | Level ≥ 3 (TS repos) | As above |
| Empty / silent try/catch | Lint | Node | `no-empty` `{ allowEmptyCatch: false }` | Medium/High | Level ≥ 3 | Explicit re-throw or logged handling |
| Bare `except:` | Lint | Python | Ruff `E722` | High | Level ≥ 3 | None |
| Blind `except Exception:` | Lint | Python | Ruff `BLE001` | Medium/High | Level ≥ 3 | Narrow, justified, re-raising handlers |
| `return`/`break`/`continue` in `finally` | Lint | Node/Python | `no-unsafe-finally` · Ruff `B012` | High | Level ≥ 3 | None |
| Missing unhappy-path tests | Coverage + policy + review | Any | Coverage on changed files; §5 sensitive-area rule | Medium/High | Sensitive areas: Level ≥ 3 | Non-sensitive trivial change, documented |
| Coverage drop | Coverage regression | Any | `jest --coverage` / `pytest --cov` vs base | Medium | Level ≥ 4 | Justified refactor that removes dead code |
| Change without evidence in final report | Traceability check | Any | Presence of `docs/prompts-output/<ID>` report citing commands/results | Medium | Level ≥ 2 | `N/A` documented for docs-only work |

Severity and "when to block" are defaults; a project tightens or relaxes them via its adoption level,
never silently.

## 7. Dependency Addition Protocol

Any agent adding a dependency MUST document, in the PR/MR body and the final report:

1. **Why an existing dependency (or the standard library) is not enough.**
2. **Runtime dependency or devDependency** (prod vs tooling).
3. **Lockfile impact** — which lockfile changes and that it was regenerated by the package manager,
   not hand-edited.
4. **Alternative considered** (at least one) and why it was rejected.
5. **Maintenance risk** — last release, maintenance status, transitive weight, license.
6. **Evidence** of `install` + `build` + `test` passing with the dependency.
7. **Security review** if it touches production (audit result; supply-chain/typosquat sanity check;
   who signed off).

A dependency addition without this protocol is an automatic review block, independent of green CI.

## 8. Agent Instructions

An agent operating under SDS MUST:

- **Inspect existing scripts before inventing commands** (`package.json` scripts, `Makefile`,
  `pyproject.toml`, existing CI). Prefer repository-native commands.
- **Avoid adding dependencies for trivial problems** solvable with the standard library or existing
  code.
- **Never edit lockfiles manually.** Regenerate them with the package manager.
- **Never silence errors just to make CI pass** (no empty catches, no `|| true` on real gates, no
  blanket ignores, no skipped tests to go green).
- **Never lower lint or coverage rules without justification** recorded in the final report and the
  PR/MR body.
- **Add evidence to the corresponding final report** (`docs/prompts-output/<PROMPT_ID>/…`): the exact
  commands run and their results (SDS gate H / traceability).

## 9. Adoption Levels

Adopt incrementally; do not jump to blocking CI before local commands are stable.

- **Level 0 — documentation only:** this guide is present and referenced; no automation.
- **Level 1 — local commands documented:** the stack-appropriate commands are written into the repo
  (scripts/runbook) and run by hand or by the agent before PR.
- **Level 2 — advisory CI (non-blocking):** CI runs the gates and reports, but does not block merge.
- **Level 3 — blocking CI for lockfile / lint / typecheck / tests:** gates A, B, D, E block.
- **Level 4 — blocking CI with dependency review, coverage regression, and security audit:** adds
  gates C and F as blocking, plus dependency-review on dependency changes.

## 10. Non-goals

- This **does not replace human review**; it removes noise so humans focus on judgment.
- This **does not validate deep business logic**; a green pipeline is not a correct feature.
- This **does not guarantee absence of vulnerabilities**; audits cover known issues only.
- This **must not become bureaucracy** that blocks MVP work without a real signal. Prefer advisory
  levels early; escalate to blocking where the risk is real.
- This **does not impose Node, Python, or GitHub Actions** on any project. All examples are adaptable
  templates for stacks that are actually present.

## 11. Minimal examples (adaptable templates)

> These are **starting templates**, not mandates. **Prefer existing repository scripts.** Adapt to the
> detected stack, package manager, and versions. Remove gates that do not apply.

### GitHub Actions — Node / npm

```yaml
name: ci
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci                       # B: frozen install (fails on manifest/lock drift)
      - run: npm run lint --if-present     # A
      - run: npm run typecheck --if-present # D (unresolved imports, types)
      - run: npm run build --if-present    # D
      - run: npm test --if-present         # E
      # - run: npm audit --audit-level=high  # C: enable as advisory or blocking per adoption level
```

### GitHub Actions — Python / Poetry

```yaml
name: ci
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pipx install poetry
      - run: poetry check --lock           # B: pyproject <-> poetry.lock drift
      - run: poetry install --no-interaction
      - run: poetry run ruff check .        # A (E, F, B, BLE)
      - run: poetry run pytest              # E
      # - run: pipx run pip-audit            # C: enable per adoption level (advisory or blocking)
```

### ESLint — flat config (`eslint.config.js`, ESLint 9+)

Flat config is the current portable default. If the repo still uses legacy `.eslintrc.*`, map the same
rules there instead. Include the `@typescript-eslint` block **only** for TypeScript repos.

```js
// eslint.config.js
export default [
  {
    rules: {
      "no-empty": ["error", { allowEmptyCatch: false }],
      "no-unsafe-finally": "error",
    },
  },
  // TypeScript-only, requires type information:
  // {
  //   languageOptions: { parserOptions: { projectService: true } },
  //   rules: {
  //     "@typescript-eslint/no-floating-promises": "error",
  //     "@typescript-eslint/no-misused-promises": "error",
  //   },
  // },
];
```

### Ruff — `pyproject.toml`

```toml
[tool.ruff.lint]
select = ["E", "F", "B", "BLE"]
# Selected rules already fail CI when `ruff check` exits non-zero.
# Do NOT add a per-rule "severity: error" mapping — Ruff has no such concept.
```

## 12. Acceptance criteria

- [ ] The document exists at `sds-dev-governance/agentic-engineering/ci-cd_to_catch_hallucinations.md`.
- [ ] It distinguishes **lockfile drift** from **import hallucination**.
- [ ] It includes the **control matrix**.
- [ ] It includes the **Dependency Addition Protocol**.
- [ ] It includes the **Adoption Levels**.
- [ ] It includes the **Agent Instructions**.
- [ ] It contains **no technically false configuration** (no `[tool.ruff.lint.rules]` severity table;
      no claim that lockfiles catch hallucinated imports; type-aware ESLint rules marked TS-only).
- [ ] It **does not impose universal thresholds** (no fixed 80%; "no regression" default).
- [ ] Any index/README update is **minimal and justified** (see §Integration).

## Integration with SDS

- Sibling of `ai-code-assurance.md`: that file is the **human/agent self-audit** at PR time; this file
  is the **machine layer** that runs before/around it. Both load conditionally at PR/pre-handoff — not
  as static context.
- Linked from `agentic-engineering/README.md`. Recorded in `docs/governance/governance-change-log.md`.
- Gate H binds to SDS traceability (`practices/03-output-traceability.md`,
  `practices/14-phase-commit-report.md`).
