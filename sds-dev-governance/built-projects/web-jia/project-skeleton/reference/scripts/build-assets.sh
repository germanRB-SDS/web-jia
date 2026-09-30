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
# (hoguera-02.png, 1672x941, 2026-09-29, [58-0]: the same scene as hoguera-nuevos-temas.png of 2026-09-20, which
# stays beside it unused, with a different woman on the left). No crop: the column's veil already decides how much
# of the left of the frame is read. The vault stays above, unused: originals are never overwritten nor renamed.
magick assets/images-website/hoguera-02.png -resize 960x -strip -quality 80 "public/propuestas/hoguera-960.webp"
magick assets/images-website/hoguera-02.png -strip -quality 82 "public/propuestas/hoguera-1672.webp"

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
for name in consejeria-educacion sds minihollywood leonardo kichi lagata aribaldi; do
  src="assets/images-logo-companies/logo-final-$name.png"
  magick "$src" -resize 420x -strip -quality 80 "public/colaboradores/$name-420.webp"
  magick "$src" -resize 840x -strip -quality 82 "public/colaboradores/$name-840.webp"
done

# Programme revolver ([56-0]): the promoter's watercolour, vectorised into thousands of paths over a flat
# #F4F2EE rectangle (4 MB, 1200x675). The rectangle's group is dropped so the gun keeps its own edge, then it is
# rasterised at 2x and trimmed to the gun (2229x1009). At the size it is drawn a long barrel reads as a stick
# (promoter, 29-09-2026), so a uniform stretch of barrel and ejector rod (x 1115-1600) is cut out and the muzzle
# end is set back on, 24 px lower because the barrel climbs towards the muzzle: a short-barrelled Colt,
# 1744x985. Served with alpha, drawn ~2.75rem wide: 96 covers density 1, 192 densities 2-3.
out public/programa/x
rev_tmp="$(mktemp -d)"
perl -0pe 's{<g id="Background">.*?</g>}{}s' assets/icons/revolver.svg > "$rev_tmp/revolver.svg"
magick -background none -density 192 "$rev_tmp/revolver.svg" -trim +repage "$rev_tmp/long.png"
magick "$rev_tmp/long.png" -crop 1115x1009+0+0 +repage "$rev_tmp/grip.png"
magick "$rev_tmp/long.png" -crop 629x1009+1600+0 +repage "$rev_tmp/muzzle.png"
magick -size 1744x1040 xc:none "$rev_tmp/grip.png" -geometry +0+0 -composite "$rev_tmp/muzzle.png" -geometry +1115+24 -composite \
  -trim +repage "$rev_tmp/revolver.png"
magick "$rev_tmp/revolver.png" -resize 96x -strip -quality 88 -define webp:alpha-quality=100 "public/programa/revolver-96.webp"
magick "$rev_tmp/revolver.png" -resize 192x -strip -quality 88 -define webp:alpha-quality=100 "public/programa/revolver-192.webp"
rm -rf "$rev_tmp"

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

# Workshop posters in use (1414x2000, supplied on 2026-09-29, [55-0]): one per workshop, read from the promoter's
# inbox, where they stay. The nine above are kept, unused: originals are never overwritten.
for f in assets/whatsapp/section-talleres/*.png; do
  n=$(basename "$f" .png)
  magick "$f" -resize 560x -strip -quality 80 "public/talleres/cartel-2026-09-29-$n-560.webp"
  magick "$f" -resize 1000x -strip -quality 80 "public/talleres/cartel-2026-09-29-$n-1000.webp"
done

# Talleres backdrop ([59-0]): the saloon's round table in watercolour, supplied by the promoter (2164x727). It sits
# under the workshops' row from 760 px, faded, so a light WebP is enough.
out public/talleres/x
magick assets/images-website/subsection-talleres.png -resize 1200x -strip -quality 76 "public/talleres/fondo-1200.webp"
magick assets/images-website/subsection-talleres.png -strip -quality 78 "public/talleres/fondo-2164.webp"

# The team cube's cards ([59-0]): the final set of 49 (1414x2000, numbered 10-58), and nothing else. The earlier
# cards (assets/images-staff/, assets/whatsapp/item-cubo/) stay where they are, unused. The zip beside the PNGs
# is only their archive.
out public/cubo/x
for f in assets/cube-staff-final/*.png; do
  n=$(basename "$f" .png)
  magick "$f" -resize 420x -strip -quality 78 "public/cubo/cubo-$n-420.webp"
  magick "$f" -resize 800x -strip -quality 80 "public/cubo/cubo-$n-800.webp"
done

# Experiencias, film reel ([61-0]). The artwork (cine-fotogramas.png, 1774x887, no alpha) is hand drawn: its four
# windows are 370-375 px wide at a 397-402 px pitch, both ends are cut frames, and every sprocket hole shows a
# different stain. Repeated whole, it would show a seam every 1774 px. So two layers are derived from it, and the
# original stays as it is:
#   - the MODULE, one frame (400x412): cut from the middle of one divider to the middle of the next (x 488 -> 888,
#     film y 231 -> 642), so modules always meet on a divider. Its sprocket holes are all repainted with one hole of
#     the drawing itself (x 600), at their measured centres; the hole the seam splits is then the same piece on both
#     sides and meets itself. Window inside the module: x 14..383, y 61..350 (components/site/film-reel/config.ts).
#   - the STAINS, the whole drawing with its paper taken to white (channel levels at the paper's own colour,
#     rgb 243 229 211) and then white turned into transparency (colour-to-alpha: over white it gives back exactly
#     the drawing; over the section's paper, what `multiply` would). Not a blend mode in CSS: the reel's fade is a
#     mask, and a mask isolates its content, so a `multiply` inside it would only multiply against nothing.
#     The film's own band is blanked in it: the moving modules cover that band, and nothing static may show under them.
out public/experiencias/reel/x
reel_src=assets/images-website/cine-fotogramas.png
reel_tmp=$(mktemp -d)
magick "$reel_src" -crop 48x38+597+243 +repage "$reel_tmp/hole-top.png"
magick "$reel_src" -crop 48x39+595+591 +repage "$reel_tmp/hole-bottom.png"
reel_args=()
for c in -1 66 132 199 266 333 399; do reel_args+=("$reel_tmp/hole-top.png" -geometry "+$((c - 24))+12" -composite); done
for c in -2 64 130 197 264 330 398; do reel_args+=("$reel_tmp/hole-bottom.png" -geometry "+$((c - 24))+360" -composite); done
magick "$reel_src" -crop 400x412+488+231 +repage "${reel_args[@]}" "$reel_tmp/module.png"
magick "$reel_tmp/module.png" -strip -quality 86 "public/experiencias/reel/fotograma-400.webp"
magick "$reel_src" -fill white -draw "rectangle 0,234 1773,639" \
  -channel R -level 0,95.3% -channel G -level 0,89.8% -channel B -level 0,82.7% +channel -resize 1200x \
  \( +clone -fx "1-min(min(r,g),b)" \) \
  \( -clone 0 -fx "ka=1-min(min(u.r,u.g),u.b); ka<0.004 ? 1 : 1-(1-u)/ka" \) \
  -delete 0 +swap -alpha off -compose CopyOpacity -composite \
  -strip -quality 74 -define webp:alpha-quality=75 "public/experiencias/reel/manchas-1200.webp"
rm -rf "$reel_tmp"

# The seven success-story posters ([61-0], 1414x2000, in their order): a small one for the frame and the full
# resolution for the viewer, which must never enlarge the small one.
for n in 1 2 3 4 5 6 7; do
  f="assets/images-staff-success-stories/exito-$n.png"
  magick "$f" -resize 240x -strip -quality 80 "public/experiencias/reel/exito-$n-240.webp"
  magick "$f" -resize 480x -strip -quality 80 "public/experiencias/reel/exito-$n-480.webp"
  magick "$f" -resize 1000x -strip -quality 86 "public/experiencias/reel/exito-$n-1000.webp"
  magick "$f" -strip -quality 90 "public/experiencias/reel/exito-$n-1414.webp"
done

echo "done: $(find public -type f | wc -l | tr -d ' ') files, $(du -sh public | cut -f1)"
