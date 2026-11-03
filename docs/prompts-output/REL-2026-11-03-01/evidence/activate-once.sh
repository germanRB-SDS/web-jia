#!/usr/bin/env bash
# web-jia REL-2026-11-03-01 — one-shot activation of release 20261103-151e382. Run ONCE by the owner (sudo).
set -euo pipefail
cd "/home/sdsadmin/web-jia-release-review-MK579PA6"
echo "c7570f314f6cbe3cb5ae66c2095ae3b4fe28abe3eaa25abfdd06552d862618e5  web-jia-release-151e382.tar.gz" | sha256sum -c -
echo "3092111323183328ac71797a842698a64c119988b71ede2c95e2818f7ee084eb  update-web-jia-release.sh" | sha256sum -c -
test "$(readlink /srv/web-jia/current)" = "releases/20261016-40d407d" || { echo "current changed: $(readlink /srv/web-jia/current)"; exit 1; }
test ! -e "/home/sdsadmin/web-jia-release-review-MK579PA6/.used" || { echo "launcher already used"; exit 1; }
touch "/home/sdsadmin/web-jia-release-review-MK579PA6/.used"
sudo bash "/home/sdsadmin/web-jia-release-review-MK579PA6/update-web-jia-release.sh" "/home/sdsadmin/web-jia-release-review-MK579PA6/web-jia-release-151e382.tar.gz" c7570f314f6cbe3cb5ae66c2095ae3b4fe28abe3eaa25abfdd06552d862618e5 20261103-151e382 releases/20261016-40d407d
