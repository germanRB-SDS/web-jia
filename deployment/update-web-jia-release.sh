#!/usr/bin/env bash
# Update the existing static site only. Run once with sudo after reviewing the artifact.
set -euo pipefail
if [[ $EUID -ne 0 || $# -ne 4 ]]; then
  echo 'Usage (root): update-web-jia-release.sh ARCHIVE SHA256 RELEASE EXPECTED_CURRENT' >&2
  exit 2
fi
archive=$1
archive_sha=$2
release=$3
expected_current=$4
[[ "$archive" = /* && -f "$archive" && ! -L "$archive" ]]
[[ "$archive_sha" =~ ^[a-f0-9]{64}$ ]]
[[ "$release" =~ ^[0-9]{8}-[a-f0-9]{7,40}$ ]]
[[ "$expected_current" =~ ^releases/[0-9]{8}-[a-f0-9]{7,40}$ ]]
base=/srv/web-jia
current="$base/current"
destination="$base/releases/$release"
next_link="$base/current.next-$release"
rollback_link="$base/current.rollback-$release"
exec 9>/run/lock/web-jia-deploy.lock
flock -n 9
[[ -L "$current" && "$(readlink "$current")" = "$expected_current" ]]
[[ ! -e "$destination" && ! -L "$destination" && ! -e "$next_link" && ! -L "$next_link" && ! -e "$rollback_link" && ! -L "$rollback_link" ]]
# Snapshot the user-owned upload into root-owned storage before verifying/extracting it.
upload="$base/upload-$release.tar.gz"
[[ ! -e "$upload" && ! -L "$upload" ]]
install -m 600 "$archive" "$upload"
archive=$upload
[[ "$(sha256sum "$archive" | cut -d' ' -f1)" = "$archive_sha" ]]
# Reject links, traversal, special files and duplicate archive entries before root extraction.
python3 - "$archive" <<'PY'
import sys,tarfile,pathlib
with tarfile.open(sys.argv[1],'r:gz') as archive:
    members=archive.getmembers()
    names=set()
    for member in members:
        path=pathlib.PurePosixPath(member.name)
        assert not path.is_absolute() and '..' not in path.parts
        assert member.isfile() or member.isdir()
        assert member.name not in names
        names.add(member.name)
    assert 'almeria-2026.html' in names
    assert 'index.html' not in names
PY
before_config=$(sha256sum /etc/caddy/Caddyfile /etc/caddy/*.caddy)
before_service=$(systemctl show caddy -p MainPID -p ActiveEnterTimestampMonotonic)
old_html_sha=$(sha256sum "$current/almeria-2026.html" | cut -d' ' -f1)
mkdir -m 755 "$destination"
tar --no-same-owner --no-same-permissions -xzf "$archive" -C "$destination"
# Preserve content-addressed assets for clients still holding the preceding HTML.
cp -an "$current/_next/static/." "$destination/_next/static/"
find "$destination" -type d -exec chmod 755 {} +
find "$destination" -type f -exec chmod 644 {} +
new_html_sha=$(sha256sum "$destination/almeria-2026.html" | cut -d' ' -f1)
grep -Fq 'https://jornadasdeinnovacion.com/almeria-2026' "$destination/almeria-2026.html"
[[ "$(readlink "$current")" = "$expected_current" ]]
[[ "$(sha256sum /etc/caddy/Caddyfile /etc/caddy/*.caddy)" = "$before_config" ]]
activated=0
restore_on_error() {
  local status=$?
  trap - ERR
  if [[ $activated = 1 && "$(readlink "$current")" = "releases/$release" ]]; then
    ln -s "$expected_current" "$rollback_link"
    mv -Tf "$rollback_link" "$current"
    echo "ROLLED_BACK to $expected_current" >&2
  fi
  exit "$status"
}
trap restore_on_error ERR
ln -s "releases/$release" "$next_link"
mv -Tf "$next_link" "$current"
activated=1
health_file="$base/verified-$release.html"
curl --noproxy '*' --fail --silent --show-error --max-time 30 \
  --resolve jornadasdeinnovacion.com:443:127.0.0.1 \
  https://jornadasdeinnovacion.com/almeria-2026 -o "$health_file"
[[ "$(sha256sum "$health_file" | cut -d' ' -f1)" = "$new_html_sha" ]]
[[ "$(sha256sum /etc/caddy/Caddyfile /etc/caddy/*.caddy)" = "$before_config" ]]
[[ "$(systemctl show caddy -p MainPID -p ActiveEnterTimestampMonotonic)" = "$before_service" ]]
printf 'release=%s\nprevious=%s\nhtml_sha256=%s\nprevious_html_sha256=%s\n' "$release" "$expected_current" "$new_html_sha" "$old_html_sha" > "$base/deploy-$release.txt"
trap - ERR
printf 'ACTIVATED %s; previous retained: %s; Caddy configuration and process unchanged\n' "$release" "$expected_current"
