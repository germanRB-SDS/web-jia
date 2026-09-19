# Skill Catalog Authority

Load this only when adding, renaming, reclassifying or removing a skill, a catalog row or an
index — not for ordinary skill use. `skills/README.md` is the always-read router; this file owns
the rules that keep the catalogs from becoming competing authorities.

Three files describe skills. Each owns a different fact, and none may restate another's columns.

| File | Owns | Granularity | Maintained |
|---|---|---|---|
| `install-catalog.tsv` | Installation: capability identity, install handler, install scope, the harnesses the installer writes to, and the governance document that describes the capability | SDS capability package | By hand |
| `cross-agent-portability.tsv` | Propagation: whether one installed skill directory may be bridged to another agent, as `LINK` / `PORT` / `CLAUDE_ONLY`, plus the reason | Individual installed skill directory | By hand |
| `INDEX.md` | Observed reachability: which agent store currently resolves each classified skill | Individual installed skill directory | Generated; never hand-edited |

The table in this file is the human route into the capability documents. It carries no
installation, portability or reachability facts of its own: those live in the three files above.

A capability package expands into many skill directories — `threejs` installs 24 of them — so the
install catalog and the portability policy are deliberately at different granularities. They are
joined by the skill document named in the catalog's `doc` column, which `install-skills.sh` and
`check-governance.sh` both require to exist.

Ordering is a property of generated indexes and of the tables here, never of a filename. Skill
documents use stable semantic slugs so a route to `skills/spline.md` survives any reordering.
