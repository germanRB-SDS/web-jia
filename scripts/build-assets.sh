#!/usr/bin/env bash
# Derives the web-ready images under public/ from the untouched originals in assets/.
# Originals are never renamed, moved or overwritten. Re-run after replacing an original.
# Requires: magick (ImageMagick 7) and cwebp. Widths are chosen per use (see lib/content/media.ts).
set -euo pipefail
cd "$(dirname "$0")/.."

out() { mkdir -p "$(dirname "$1")"; }

webp() { # src dst width quality
  out "$3"; magick "$1" -resize "${3}x>" -strip -quality "${4:-82}" "$2"
}

# Hero photographs (1672x941). Two widths: phone and desktop. Source stays PNG; delivered as WebP.
for name in hero-almeria-docentes hero-2-almeria-docentes; do
  src="assets/images-website/$name.png"
  out "public/hero/x"
  magick "$src" -resize 960x -strip -quality 80 "public/hero/$name-960.webp"
  magick "$src" -resize 1672x -strip -quality 82 "public/hero/$name-1672.webp"
done

# Official #JIA26 badge (has alpha). PNG keeps transparency for the header.
out public/brand/x
magick "assets/cep/logo-variantes/#jIA26 LOGO.png" -resize 320x -strip "public/brand/jia26-badge-320.png"
magick "assets/cep/logo-variantes/#jIA26 LOGO.png" -resize 640x -strip "public/brand/jia26-badge-640.png"

# Event poster
out public/cartel/x
magick "assets/cep/CARTEL #JIA26 (9).png" -resize 720x -strip -quality 80 "public/cartel/cartel-jia26-720.webp"
magick "assets/cep/CARTEL #JIA26 (9).png" -resize 1200x -strip -quality 80 "public/cartel/cartel-jia26-1200.webp"

# Workshop posters (1414x2000)
for f in assets/cep/talleres-carteles/*.png; do
  n=$(basename "$f" .png)
  out public/talleres/x
  magick "$f" -resize 560x -strip -quality 80 "public/talleres/cartel-$n-560.webp"
  magick "$f" -resize 1000x -strip -quality 80 "public/talleres/cartel-$n-1000.webp"
done

# Team cards (1414x2000)
for f in assets/images-staff/*.png; do
  n=$(basename "$f" .png)
  out public/equipo/x
  magick "$f" -resize 420x -strip -quality 78 "public/equipo/card-$n-420.webp"
  magick "$f" -resize 800x -strip -quality 80 "public/equipo/card-$n-800.webp"
done

echo "done: $(find public -type f | wc -l | tr -d ' ') files, $(du -sh public | cut -f1)"
