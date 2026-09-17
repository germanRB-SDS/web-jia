#!/usr/bin/env bash
# Captures review screenshots of the static build into .impeccable/review/.
# Usage: bash scripts/qa-screenshots.sh   (after `npm run build`; starts a server on :3005 if needed)
set -euo pipefail
cd "$(dirname "$0")/.."
CH="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT=.impeccable/review
mkdir -p "$OUT"
cp scripts/qa/shot.html out/shot.html
if ! curl -s -o /dev/null http://localhost:3005/; then
  (cd out && python3 -m http.server 3005 >/dev/null 2>&1 &)
  sleep 1
fi
shot() { # name window_w window_h url [crop_w]
  "$CH" --headless=new --disable-gpu --hide-scrollbars --no-sandbox --virtual-time-budget=8000 \
    --window-size="$2,$3" --screenshot="$OUT/$1.png" "$4" >/dev/null 2>&1
  if [ -n "${5:-}" ]; then magick "$OUT/$1.png" -crop "${5}x$3+0+0" +repage "$OUT/$1.png"; fi
  echo "$1: $(magick identify -format '%wx%h' "$OUT/$1.png")"
}
shot desktop 1440 900 "http://localhost:3005/"
shot desktop-full 1440 9800 "http://localhost:3005/"
shot desktop-footer 1440 900 "http://localhost:3005/shot.html?w=1440&h=900&scroll=99999" 1440
shot desktop-dialog 1440 900 "http://localhost:3005/shot.html?w=1440&h=900&open=dialog&scroll=2600" 1440
shot tablet-full 768 9000 "http://localhost:3005/shot.html?w=768&h=9000" 768
shot mobile 600 844 "http://localhost:3005/shot.html?w=390&h=844" 390
shot mobile-full 600 12500 "http://localhost:3005/shot.html?w=390&h=12500" 390
shot mobile-nav 600 844 "http://localhost:3005/shot.html?w=390&h=844&open=nav" 390
shot mobile-dialog 600 844 "http://localhost:3005/shot.html?w=390&h=844&open=dialog" 390
shot mobile-360-full 600 12500 "http://localhost:3005/shot.html?w=360&h=12500" 360
