# Deployment continuation — 2026-09-25

Change ID REL-2026-09-25-02. Branch feat/REL-2026-09-25-02-talleres-baraja; prior HEAD 41b4d1b. Owner authorizes exactly one SSH deployment; no enduring access-policy change. MCP remains blocked.

SSH public-key authentication succeeds via existing alias; no password retrieved. Existing site: Caddy root /srv/web-jia/current -> releases/20260920-5b4d363. Config /etc/caddy/web-jia.caddy maps clean /almeria-2026 to almeria-2026.html and redirects root with query preserved. Do not rerun initial installation, create another site or modify unrelated services.

Historical branch feat/REL-2026-09-20-48-production-deployment contains the earlier route/build configuration and deployment docs, never merged into main. Recover only edition route/canonical and flat export over latest UI; do not merge old UI or historical access admissions. Root preview remains available locally.

Sudo requires password. Generic/internet Keychain lookup for sdsadmin and generic lookup for sds-prod-01 found no accessible match. Owner asked only for item name, never password. Pending privileged activation; do not repurpose other projects’ NOPASSWD wrappers.

Build, TypeScript and content PASS. Seven production-route browser checks PASS; five isolated Linux simulations of success/checksum/stale state/unsafe archive/rollback PASS. Initial sandbox build failed fetching Google Fonts; permitted network build succeeded with fonts bundled. Next: stage unique release and checksum; retrieve credential directly into sudo only if exact Keychain item identified; activate once, verify origin/public, finish requested deployment guide and push code/docs.

Latest: implementation b410b77; new package 20260925-b410b77 (203 files, 50464056 bytes), SHA c04bf2fdca4f96d475cc316376d394b80ce234d236e4556ba219d157a60d7ce7. Uploaded to /home/sdsadmin/web-jia-release-review-Xstzs4/release.tar.gz; remote hash matches. update-web-jia-release.sh hash 3092111323183328ac71797a842698a64c119988b71ede2c95e2818f7ee084eb also matches. Owner launcher activate-once.sh is staged and syntax-valid, NOT executed. Current remains releases/20260920-5b4d363.

Guide completed at sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md. Next: identify the exact Keychain item (owner question pending) and pipe it directly to sudo without displaying it, OR owner executes the prepared launcher in their own authenticated SSH terminal. Then verify origin/public and update this checkpoint. No additional deployment permission is needed for this occasion.
