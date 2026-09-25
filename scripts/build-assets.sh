#!/usr/bin/env bash
# Derives the web-ready images under public/ from the untouched originals in assets/.
# Originals are never renamed, moved or overwritten. Re-run after replacing an original.
# Requires: magick (ImageMagick 7) and cwebp; ffmpeg only for the intro video (optional). Widths are chosen per use (see lib/content/media.ts).
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
  # Crop that leaves out the baked-in words (identity §8.8): the signpost on the right
  # and the backpack lettering on the left would otherwise be cut mid-word at desktop widths.
  magick "$src" -crop 1021x941+300+0 +repage -resize 960x -strip -quality 80 "public/hero/$name-crop-960.webp"
  magick "$src" -crop 1021x941+300+0 +repage -strip -quality 82 "public/hero/$name-crop-1021.webp"
done

# Hero photograph in use: the three at the saloon porch supplied by the promoter (hero-salloon-vaqueros.png,
# 1916x821, 2026-09-20). Its left third is flat cream, which is what the hero's torn edge dissolves into. No
# crop here: the band's photo box is far more upright than the frame, so the sides are trimmed by object-fit
# and the focal point in media.ts decides which. The two earlier hero frames stay above, unused.
out public/hero/x
magick assets/images-website/hero-salloon-vaqueros.png -resize 960x -strip -quality 80 "public/hero/hero-saloon-960.webp"
magick assets/images-website/hero-salloon-vaqueros.png -strip -quality 82 "public/hero/hero-saloon-1916.webp"

# Jornadas band: the rider over the valley supplied by the promoter (1916x821). No longer in use since
# JIA-2026-09-20-45, kept because its entry stays in the media registry.
out public/jornadas/x
magick assets/images-website/jornadas-jinete.png -resize 960x -strip -quality 80 "public/jornadas/jinete-960.webp"
magick assets/images-website/jornadas-jinete.png -strip -quality 82 "public/jornadas/jinete-1916.webp"

# Jornadas band in use: the two riders over the valley supplied by the promoter (jornadas-jinete-niña.png,
# 1983x793, 2026-09-20). The first rider stays beside it, unused: originals are never overwritten nor renamed
# (this one keeps its ñ, the way the poster files keep their spaces).
magick "assets/images-website/jornadas-jinete-niña.png" -resize 960x -strip -quality 80 "public/jornadas/jinete-nina-960.webp"
magick "assets/images-website/jornadas-jinete-niña.png" -strip -quality 82 "public/jornadas/jinete-nina-1983.webp"

# Jornadas intro: the #JIA26 seal beside the statement (1080x1080, transparent; JIA-2026-09-19-29). The widest one
# is for the back of the workshop sheet's flip card (JIA-2026-09-19-30: 88 % of 320 px at density 2).
webp assets/images-website/sello-jia26.png public/jornadas/sello-jia26-240.webp 240 84
webp assets/images-website/sello-jia26.png public/jornadas/sello-jia26-480.webp 480 84
webp assets/images-website/sello-jia26.png public/jornadas/sello-jia26-640.webp 640 84

# Jornadas road: the wagon GLB exported from Blender (assets/3d/carruaje, JIA-2026-09-18-07), copied as is.
cp assets/3d/carruaje/jia-carruaje.glb public/jornadas/jia-carruaje.glb

# Footer: the worn horseshoe built by Blender headless (assets/3d/herradura/make-herradura.py, JIA-2026-09-19-27), copied as is.
out public/footer/x
cp assets/3d/herradura/herradura.glb public/footer/herradura.glb
# Footer ground: the stable supplied by the promoter (2172x724, JIA-2026-09-19-40; second version, supplied on
# 2026-09-20 — the first one stays beside it, unused: originals are never overwritten). The shoe hangs on its post.
stable_src="assets/images-website/footer-caballo-poste-2.png"
magick "$stable_src" -resize 1200x -strip -quality 80 "public/footer/establo-1200.webp"
magick "$stable_src" -strip -quality 82 "public/footer/establo-2172.webp"

# Jornadas intro video (JIA-2026-09-18-10): web version of the 4K original (2.1 GB, not in git) + its poster.
# Needs ffmpeg (brew install ffmpeg, or FFMPEG=/path/to/ffmpeg); skipped when the tool or the original is missing,
# so the committed derivatives stay as they are. URL/poster are wired in lib/content/sections/jornadas-intro-video.ts.
FFMPEG="${FFMPEG:-$(command -v ffmpeg || true)}"
intro_src="assets/videos-website/capitulo2corregidofran.mp4"
if [ -n "$FFMPEG" ] && [ -f "$intro_src" ]; then
  out public/jornadas/intro/x
  "$FFMPEG" -y -v error -i "$intro_src" -vf "scale=1280:720:flags=lanczos" -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 28 -maxrate 1800k -bufsize 3600k -preset slow -movflags +faststart -c:a aac -b:a 96k -ac 2 \
    public/jornadas/intro/intro-720.mp4
  "$FFMPEG" -y -v error -ss 8 -i "$intro_src" -frames:v 1 -vf "scale=1600:-2" /tmp/jia-intro-poster.png
  magick /tmp/jia-intro-poster.png -strip -quality 80 public/jornadas/intro/intro-poster.webp
  rm -f /tmp/jia-intro-poster.png
else
  echo "skip: intro video (ffmpeg or $intro_src missing)"
fi

# Propuestas visual column (1059x821)
out public/propuestas/x
# Bottom 8% cropped (promoter request); the original stays whole.
magick assets/images-website/propuestas-camara.png -gravity North -crop 100%x92%+0+0 +repage -resize 800x -strip -quality 80 "public/propuestas/camara-800.webp"
magick assets/images-website/propuestas-camara.png -gravity North -crop 100%x92%+0+0 +repage -strip -quality 82 "public/propuestas/camara-1059.webp"

# Propuestas visual column in use: the fireside conversation about the next theme supplied by the promoter
# (hoguera-nuevos-temas.png, 1672x941, 2026-09-20). No crop: the column's veil already decides how much of the
# left of the frame is read. The vault stays above, unused: originals are never overwritten nor renamed.
magick assets/images-website/hoguera-nuevos-temas.png -resize 960x -strip -quality 80 "public/propuestas/hoguera-960.webp"
magick assets/images-website/hoguera-nuevos-temas.png -strip -quality 82 "public/propuestas/hoguera-1672.webp"

# Experiencias ground: the teacher in her classroom supplied by the promoter (aula-maestra3.png, 1919x820,
# third version, supplied on 2026-09-20 — now she faces the room). She holds the left and the right half is
# clear paper for the heading and the sheets. The two earlier originals stay beside it, unused: originals are
# never overwritten.
out public/experiencias/x
magick assets/images-website/aula-maestra3.png -resize 960x -strip -quality 80 "public/experiencias/aula-960.webp"
magick assets/images-website/aula-maestra3.png -strip -quality 82 "public/experiencias/aula-1919.webp"

# Experiencias, layer 3 ([51-0]): the same teacher cut out of the same frame, with no background, supplied by the
# promoter on 2026-09-25 (1918x820). It is laid EXACTLY over the photograph above so that the light of layer 2 can
# pass behind her. Two conditions make that registration impossible to break:
#   - the extent to 1919x820 anchored north-west, so the cutout has the photograph's ratio to the pixel (the
#     source is one column short; padding beats resizing, which would resample and shift her half a pixel);
#   - "-define webp:alpha-quality" and no flattening, so the transparency survives the WebP. An opaque file here
#     would paint a cream rectangle over the classroom.
magick assets/images-website/aula-maestra3-cutout.png -background none -gravity NorthWest -extent 1919x820 \
  -resize 960x -strip -quality 84 -define webp:alpha-quality=100 "public/experiencias/maestra-960.webp"
magick assets/images-website/aula-maestra3-cutout.png -background none -gravity NorthWest -extent 1919x820 \
  -strip -quality 86 -define webp:alpha-quality=100 "public/experiencias/maestra-1919.webp"

# Acoge JIA band: the archer supplied by the promoter (indio.png, 1916x821, second version supplied on
# 2026-09-20). The first archer stays beside it as acoge-arquero.png, unused: originals are never overwritten.
out public/acoge/x
magick assets/images-website/indio.png -resize 960x -strip -quality 80 "public/acoge/indio-960.webp"
magick assets/images-website/indio.png -strip -quality 82 "public/acoge/indio-1916.webp"

# Collaborators' cards (JIA-2026-09-18-24): each entity's logotype composed on a western still (1448x1086, 4:3,
# the card's image slot). The slot is ~272 CSS px wide: 420 covers density 1, 840 densities 2-3.
out public/colaboradores/x
for name in consejeria-educacion sds minihollywood leonardo kichi lagata; do
  src="assets/images-logo-companies/logo-final-$name.png"
  magick "$src" -resize 420x -strip -quality 80 "public/colaboradores/$name-420.webp"
  magick "$src" -resize 840x -strip -quality 82 "public/colaboradores/$name-840.webp"
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
