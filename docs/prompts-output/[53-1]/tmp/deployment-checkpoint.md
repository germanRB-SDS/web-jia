# Deployment continuation — 2026-09-25

Change ID REL-2026-09-25-02. Branch feat/REL-2026-09-25-02-talleres-baraja; prior HEAD 41b4d1b. Owner authorizes exactly one SSH deployment; no enduring access-policy change. MCP remains blocked.

SSH public-key authentication succeeds via existing alias; no password retrieved. Existing site: Caddy root /srv/web-jia/current -> releases/20260920-5b4d363. Config /etc/caddy/web-jia.caddy maps clean /almeria-2026 to almeria-2026.html and redirects root with query preserved. Do not rerun initial installation, create another site or modify unrelated services.

Historical branch feat/REL-2026-09-20-48-production-deployment contains the earlier route/build configuration and deployment docs, never merged into main. Recover only edition route/canonical and flat export over latest UI; do not merge old UI or historical access admissions. Root preview remains available locally.

Sudo requires password. Generic/internet Keychain lookup for sdsadmin and generic lookup for sds-prod-01 found no accessible match. Owner asked only for item name, never password. Pending privileged activation; do not repurpose other projects’ NOPASSWD wrappers.

Build, TypeScript and content PASS. Seven production-route browser checks PASS; five isolated Linux simulations of success/checksum/stale state/unsafe archive/rollback PASS. Initial sandbox build failed fetching Google Fonts; permitted network build succeeded with fonts bundled. Next: stage unique release and checksum; retrieve credential directly into sudo only if exact Keychain item identified; activate once, verify origin/public, finish requested deployment guide and push code/docs.
