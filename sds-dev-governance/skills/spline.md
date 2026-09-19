# Spline

Spline is a 3D and 2D design tool. Its V2 desktop app ships an MCP bridge that lets an agent drive
the running editor directly: build and edit 3D scenes, and author 2D screens in its Hana editor.

**Role:** Spline is an **asset source**, not a design authority. It produces 3D scenes, 2D frames
and embeddable runtime code. It never owns a project's UI decisions, `DESIGN.md`, constants
ownership, copy ownership or frontend memory. Impeccable and the project adapter keep that
authority.

## Source

- Vendor: Spline — `https://spline.design`
- Delivery: the MCP server is **bundled inside the V2 desktop app**. There is no separate package
  to install and no public REST API behind it.
- Entrypoint: `/Applications/Spline.app/Contents/Resources/spline-mcp.cjs` on macOS.

Community servers published as `spline-mcp-server` or `spline-mcp` are a different, unrelated
supply chain. They are unpinned and their scene tools target endpoints that do not exist. Do not
substitute them for the bundled bridge.

## Install

```bash
brew install --cask spline
```

Register the bridge explicitly rather than letting the app self-register, so the revision stays
pinned to an absolute path:

```bash
claude mcp add --scope user spline -- \
  /opt/homebrew/bin/node /Applications/Spline.app/Contents/Resources/spline-mcp.cjs
```

Launching the desktop app **auto-registers itself** into whichever agent clients it detects. Treat
anything it writes as a separate revision: review it, and remove the duplicate if the explicit
registration above is already present.

## How it actually works

The bridge is a proxy, not a self-contained server. It speaks MCP over stdio to the agent and
listens on a loopback WebSocket for the editor to attach and publish its tool manifest.

- **The desktop app must be running and signed in.** With the app closed, `tools/list` returns an
  empty array and nothing can be called.
- The manifest is dynamic (`listChanged: true`), so the tool surface comes from the app, not from
  the installed file.

Two prefixed families drive two editors. Guides name tools without the prefix; the callable name is
always prefixed.

- **Spline 3D — `3d_*`**: author scenes by writing Spline's editor DSL and running it with
  `3d_run_code`. Call `3d_load_skill("authoring-guide")` **once before the first** `3d_run_code`,
  then ground on `3d_get_scene_mcp`. Verify by re-reading the scene with `3d_get_scene` /
  `3d_get_objects`, never from a screenshot; review looks with `3d_set_view` +
  `3d_take_screenshot`.
- **Hana 2D — `2d_*`**: reserve a frame with `2d_reserve_frames`, then fill it with
  `2d_write_html`. Load **both** `2d_load_skill("authoring-guide")` and
  `2d_load_skill("authoring-guide-2")` before the first `2d_write_html`, plus any special-effect
  skill the design needs. Design exactly one frame per agent; several screens means one frame per
  sub-agent.

## SDS Usage

Use Spline only when a project genuinely needs authored 3D or a visual asset that cannot be
expressed in the project's own stack. For ordinary UI work, Impeccable and the project's design
system come first, and a three.js skill is the lighter answer when the need is runtime rendering
rather than authoring.

Recommended flow:

1. Confirm the capability's current status in `docs/governance/capability-registry.md` before
   invoking anything.
2. Author in a **disposable** Spline document. Never a client, production or shared scene.
3. Export the asset or the generated runtime code, then integrate it under the project's own rules:
   constants ownership, copy ownership, asset paths and performance budget all still apply.
4. Record the asset and its provenance in the shard routed by `docs/memory/index-frontend.md`.

## Security

Editor scenes are cloud-backed under the signed-in Spline account, so anything sent to a tool call
leaves the machine. Never pass repository secrets, real customer data, dumps, private keys or
untrusted third-party documents into a scene or a prompt to these tools.

The bridge opens a listening loopback socket that accepts browser origins and localhost. Treat a
running bridge as a locally reachable control surface: do not leave it running unattended alongside
untrusted local processes or browser sessions.

`3d_run_code` and `2d_write_html` execute code and markup inside the editor. Review generated
output before adopting it into a project, exactly as with any other generated artifact.
