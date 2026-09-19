# R8 Analysis Workflow

Use this workflow selectively. Do not execute every command by ritual, and do not install missing
build tools during an analysis.

## 1. Discover The Effective Build

Identify the applicable module and release-like variant from repository evidence. Start with
project instructions, then inspect only relevant files:

```bash
rg --files -g 'settings.gradle*' -g 'build.gradle*' -g 'gradle.properties' -g 'libs.versions.toml' -g '*proguard*' -g '*rules*.pro'
rg -n 'isMinifyEnabled|minifyEnabled|isShrinkResources|shrinkResources|proguardFiles|consumerProguardFiles|android.enableR8.fullMode|com\.android\.' .
```

Resolve:

- Android Gradle Plugin and Gradle wrapper versions;
- application/library/dynamic-feature modules;
- build types and product flavors;
- the actual release-like variant requested;
- `isMinifyEnabled`/`minifyEnabled` and resource shrinking for that variant;
- every app keep-rule file and relevant library consumer-rule source;
- any compatibility/full-mode override in `gradle.properties`.

Aliases in a version catalog can hide plugin IDs. Follow the alias to `libs.versions.toml`; do not
classify the project as non-Android because the module uses `alias(libs.plugins...)`.

### Activation verdict

- `ACTIVE`: shrinking is demonstrably enabled for the affected variant.
- `INACTIVE`: shrinking is demonstrably disabled. There is no release R8 optimization to tune;
  provide an activation-risk plan, not a claim that rules are effective.
- `AMBIGUOUS`: variant inheritance, convention plugins or external configuration prevent a factual
  verdict. Identify the exact missing source and stop dependent conclusions.

Do not prescribe a fixed AGP upgrade solely from a version number. Use the project's compatibility
constraints and current official Android documentation if an upgrade is part of a later request.

## 2. Inventory Rules Without Assuming Redundancy

Classify each material rule by owner and purpose:

| Class | Examples | Review question |
|---|---|---|
| Entry points | Android components, JNI callbacks, services | Is reachability visible to R8? |
| Reflection/serialization | `Class.forName`, reflective adapters, model construction | Is the target discoverable through code/annotations or only names? |
| Metadata | annotations, signatures, inner/enclosing classes | Which runtime consumer needs the attribute? |
| Library workaround | dependency-specific keep or `-dontwarn` | Does the installed dependency already ship a consumer rule or newer fix? |
| Broad retention | package-wide `-keep`, `allowshrinking`, `allowoptimization` | Can scope be reduced while preserving the dynamic contract? |
| Diagnostics suppression | `-dontwarn`, `-dontnote` | What exact warning and missing dependency is being hidden? |

Prioritize correctness before size. Flag as candidates, not automatic deletions:

- package-wide `-keep class some.package.** { *; }`;
- global member retention;
- broad `-keepattributes` sets without a discovered consumer;
- duplicate rules already supplied by an AAR's consumer configuration;
- wide `-dontwarn` patterns;
- rules for dependencies no longer present.

Search for the dynamic behavior that may justify each candidate: reflection APIs, serialization
adapters, JNI/native registration, dependency injection, `ServiceLoader`, custom class loaders,
XML/manifest entry points and framework-specific generated registries. Absence from a quick text
search is not proof of dead reachability.

## 3. Use Existing Build Evidence

Discover outputs rather than assuming a single module/path:

```bash
find . -path '*/build/*' -type f \( \
  -name 'mapping.txt' -o -name 'seeds.txt' -o -name 'usage.txt' -o \
  -name 'configuration.txt' -o -name 'missing_rules.txt' -o \
  -name '*.aab' -o -name '*.apk' \
\) -print
```

For every artifact record module, variant, version/revision if known and modification time. Do not
mix evidence from different variants or builds.

- `configuration.txt`: effective merged R8 configuration when available.
- `seeds.txt`: roots retained by keep configuration; not proof that every root is necessary.
- `usage.txt`: removed code for that build; not a general dead-code contract.
- `mapping.txt`: obfuscation mapping for exactly one build.
- `missing_rules.txt`: generated suggestions/evidence to investigate, not text to paste blindly.

If a local build is needed, discover the canonical Gradle task first (for example with
`./gradlew tasks`) and state why it is safe. Do not use a task that uploads, publishes, signs with
unavailable credentials or changes external state.

## 4. Measure Size Honestly

Compare only like-for-like artifacts: same artifact type, ABI/density strategy, build type,
features and packaging mode. Record raw bytes with a portable local command such as `wc -c`; inspect
ZIP entries with an available `unzip -l`/`zipinfo` tool. Do not compare an APK to an AAB or a debug
artifact to release and call the delta an R8 saving.

No baseline means no measured saving. Report an opportunity, not a percentage.

## 5. Diagnose Missing Rules

For each material R8 warning or `missing_rules.txt` entry:

1. Identify the referencing code/dependency and whether the class is required at runtime.
2. Check dependency versions and their shipped consumer rules.
3. Distinguish optional compile-time references from a missing runtime dependency.
4. Prefer the narrowest justified keep/dontwarn rule only after understanding the path.
5. Preserve the original warning as evidence.

Never solve a missing-class warning with package-wide `-dontwarn` by default.

## 6. Retrace Obfuscated Crashes

Retrace only when all three are available:

- the obfuscated stack trace;
- `mapping.txt` from the exact app version/variant that produced it;
- a project-provided or locally available compatible retrace tool.

Keep original and retraced traces correlated. If build identity is uncertain, mark retrace
`BLOCKED — MAPPING IDENTITY UNKNOWN`; do not try nearby mappings until one looks plausible.

Do not paste a production mapping or complete production trace into an external service unless the
user explicitly authorizes the data transfer.

## 7. Plan A Future Change

If the report recommends enabling shrinking or refining rules, define a separate implementation
checkpoint with:

- baseline release artifact and size;
- build success with warnings reviewed;
- focused tests for every dynamic-reachability mechanism actually used;
- smoke tests on supported Android versions/device profiles;
- crash/ANR monitoring and rollback artifact retention;
- exact artifact-size comparison after the change.

Do not apply these changes as part of the analysis skill.
