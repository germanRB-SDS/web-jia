# Three.js skill package

## Purpose

The OpenAEC Foundation / Impertio Studio package supplies 24 deterministic Three.js skills for
rendering, scene graphs, math, loaders, materials, shaders, animation, React Three Fiber, Drei,
WebGPU, XR, IFC and performance diagnosis.

## Installation contract

- Upstream: `https://github.com/OpenAEC-Foundation/Three.js-Claude-Skill-Package.git`.
- Default revision: `6c190f0db95d6e4b77d7843d181c6d3325c09d0e`.
- Claude owns the user-level materialized copy under `~/.claude/skills/threejs-*`.
- Codex reuses each compatible Claude skill through a symbolic link under `~/.codex/skills/`.
- Existing non-managed destinations are preserved and reported; the installer never replaces them.
- Tests may set `SDS_THREEJS_SOURCE_DIR` to an unpacked package and
  `SDS_THREEJS_EXPECTED_COUNT` to a fixture count, avoiding network and home-directory writes.

Run through the catalog orchestrator:

```bash
./sds-dev-governance/scripts/install-skills.sh .
```

The revision can be overridden deliberately with `SDS_THREEJS_SKILLS_REVISION`; that changes the
effective capability revision and therefore reopens the project admission gate before use.

## Admission boundary

Installation only makes the skills discoverable. A project may use them for SDS work only when the
effective revision and operating mode are admitted in `docs/governance/capability-registry.md`.
