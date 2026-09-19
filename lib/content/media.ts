/**
 * MEDIA REGISTRY (brief §10.2 "config/media"). Every image the site can show,
 * addressed by a stable id. `srcset` variants are produced by
 * scripts/build-assets.sh from the untouched originals in assets/.
 * Alt text is NOT here: it is language and lives in the dictionary (a11y.*).
 */
import type { SurfaceToken } from "./data/types";

export type MediaVariant = { src: string; width: number };
export type Media = {
  id: string;
  variants: MediaVariant[];
  /** Intrinsic aspect ratio of the source, width / height. */
  ratio: number;
  /** Focal point in % used by object-position when the image is cropped. */
  focal?: { x: number; y: number };
  /** Original file, for traceability. Never served. */
  original: string;
  license: string;
};

const HERO_RATIO = 1672 / 941;
const HERO_CROP_RATIO = 1021 / 941;
const POSTER_RATIO = 1414 / 2000;

function poster(n: number): Media {
  return {
    id: `poster-${n}`,
    variants: [
      { src: `/talleres/cartel-${n}-560.webp`, width: 560 },
      { src: `/talleres/cartel-${n}-1000.webp`, width: 1000 },
    ],
    ratio: POSTER_RATIO,
    original: `assets/cep/talleres-carteles/${n}.png`,
    license: "Material del CEP de Almería para las JIA (uso interno del proyecto)",
  };
}

function card(n: number): Media {
  return {
    id: `card-${n}`,
    variants: [
      { src: `/equipo/card-${n}-420.webp`, width: 420 },
      { src: `/equipo/card-${n}-800.webp`, width: 800 },
    ],
    ratio: POSTER_RATIO,
    original: `assets/images-staff/${n}.png`,
    license: "Material del CEP de Almería para las JIA (uso interno del proyecto)",
  };
}

/** A collaborator's card image: its logotype on a western still, 4:3 like the slot it fills (cropped if it were not). */
function collaborator(slug: string): Media {
  return {
    id: `colabora-${slug}`,
    variants: [
      { src: `/colaboradores/${slug}-420.webp`, width: 420 },
      { src: `/colaboradores/${slug}-840.webp`, width: 840 },
    ],
    ratio: 1448 / 1086,
    original: `assets/images-logo-companies/logo-final-${slug}.png`,
    license: "Composición aportada por el promotor el 18-09-2026; el logotipo es propiedad de cada entidad",
  };
}

const COLLABORATOR_SLUGS = ["consejeria-educacion", "sds", "minihollywood", "leonardo", "kichi", "lagata"];

const CARD_NUMBERS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 31, 37, 39, 40, 41, 42, 43, 46];

export const MEDIA: Record<string, Media> = Object.fromEntries(
  [
    {
      /** Hero crop without the signpost (its baked-in words were cut mid-word at 1440). */
      id: "hero-1",
      variants: [
        { src: "/hero/hero-almeria-docentes-crop-960.webp", width: 960 },
        { src: "/hero/hero-almeria-docentes-crop-1021.webp", width: 1021 },
      ],
      ratio: HERO_CROP_RATIO,
      focal: { x: 50, y: 42 },
      original: "assets/images-website/hero-almeria-docentes.png (crop 1021x941+300+0)",
      license: "Imagen generada para el proyecto (ver JIA_IDENTIDAD_VISUAL.md §8)",
    },
    {
      id: "hero-1-full",
      variants: [
        { src: "/hero/hero-almeria-docentes-960.webp", width: 960 },
        { src: "/hero/hero-almeria-docentes-1672.webp", width: 1672 },
      ],
      ratio: HERO_RATIO,
      focal: { x: 62, y: 42 },
      original: "assets/images-website/hero-almeria-docentes.png",
      license: "Imagen generada para el proyecto (ver JIA_IDENTIDAD_VISUAL.md §8)",
    },
    {
      id: "hero-2",
      variants: [
        { src: "/hero/hero-2-almeria-docentes-crop-960.webp", width: 960 },
        { src: "/hero/hero-2-almeria-docentes-crop-1021.webp", width: 1021 },
      ],
      ratio: HERO_CROP_RATIO,
      focal: { x: 50, y: 42 },
      original: "assets/images-website/hero-2-almeria-docentes.png (crop 1021x941+300+0)",
      license: "Imagen generada para el proyecto (ver JIA_IDENTIDAD_VISUAL.md §8)",
    },
    {
      /** The same second frame framed on the place (castle and town) rather than the people; used by Acoge JIA. */
      id: "hero-2-place",
      variants: [
        { src: "/hero/hero-2-almeria-docentes-960.webp", width: 960 },
        { src: "/hero/hero-2-almeria-docentes-1672.webp", width: 1672 },
      ],
      ratio: HERO_RATIO,
      focal: { x: 66, y: 34 },
      original: "assets/images-website/hero-2-almeria-docentes.png",
      license: "Imagen generada para el proyecto (ver JIA_IDENTIDAD_VISUAL.md §8)",
    },
    {
      /** Jornadas band. The rider stands on the left; the valley and the road open to the right. */
      id: "jornadas-jinete",
      variants: [
        { src: "/jornadas/jinete-960.webp", width: 960 },
        { src: "/jornadas/jinete-1916.webp", width: 1916 },
      ],
      ratio: 1916 / 821,
      focal: { x: 30, y: 48 },
      original: "assets/images-website/jornadas-jinete.png",
      license: "Imagen aportada por el promotor el 18-09-2026 (origen y licencia por confirmar)",
    },
    {
      /** Propuestas visual column: the vault with the JIA books. */
      id: "propuestas-camara",
      variants: [
        { src: "/propuestas/camara-800.webp", width: 800 },
        { src: "/propuestas/camara-1059.webp", width: 1059 },
      ],
      ratio: 1059 / 755,
      focal: { x: 55, y: 50 },
      original: "assets/images-website/propuestas-camara.png (bottom 8% cropped at build)",
      license: "Imagen aportada por el promotor el 18-09-2026 (origen y licencia por confirmar)",
    },
    {
      /** Experiencias ground. The teacher stands on the left; the right half is clear paper for the text. */
      id: "experiencias-aula",
      variants: [
        { src: "/experiencias/aula-960.webp", width: 960 },
        { src: "/experiencias/aula-1916.webp", width: 1916 },
      ],
      ratio: 1916 / 821,
      focal: { x: 0, y: 50 },
      original: "assets/images-website/aula-maestra2.png",
      license: "Imagen aportada por el promotor el 18-09-2026 (origen y licencia por confirmar)",
    },
    {
      /** Acoge JIA band. The subject stands on the left; the right two thirds are clear ground for text. */
      id: "acoge-arquero",
      variants: [
        { src: "/acoge/arquero-960.webp", width: 960 },
        { src: "/acoge/arquero-1922.webp", width: 1922 },
      ],
      ratio: 1922 / 818,
      focal: { x: 22, y: 40 },
      original: "assets/images-website/acoge-arquero.png",
      license: "Imagen aportada por el promotor el 18-09-2026 (origen y licencia por confirmar)",
    },
    {
      id: "badge-jia26",
      variants: [
        { src: "/brand/jia26-badge-320.png", width: 320 },
        { src: "/brand/jia26-badge-640.png", width: 640 },
      ],
      ratio: 1,
      original: "assets/cep/logo-variantes/#jIA26 LOGO.png",
      license: "Distintivo oficial #JIA26 del CEP de Almería",
    },
    {
      id: "cartel-jia26",
      variants: [
        { src: "/cartel/cartel-jia26-720.webp", width: 720 },
        { src: "/cartel/cartel-jia26-1200.webp", width: 1200 },
      ],
      ratio: 2268 / 3440,
      original: "assets/cep/CARTEL #JIA26 (9).png",
      license: "Cartel oficial #JIA26 del CEP de Almería",
    },
    {
      /** The #JIA26 seal beside the Jornadas statement (JIA-2026-09-19-29); as tall as the paragraph, never on a phone.
          Also the back of the workshop sheets' flip card (JIA-2026-09-19-30). */
      id: "sello-jia26",
      variants: [
        { src: "/jornadas/sello-jia26-240.webp", width: 240 },
        { src: "/jornadas/sello-jia26-480.webp", width: 480 },
        { src: "/jornadas/sello-jia26-640.webp", width: 640 },
      ],
      ratio: 1,
      original: "assets/images-website/sello-jia26.png",
      license: "Sello #JIA26 aportado por el promotor (chat, 19-09-2026)",
    },
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(poster),
    ...CARD_NUMBERS.map(card),
    ...COLLABORATOR_SLUGS.map(collaborator),
  ].map((m) => [m.id, m]),
);

/** Brand vectors served from public/brand. */
export const brand = {
  /** Traced from the approved render; provisional until the vector master exists. */
  wordmark: { src: "/brand/jia-wordmark-derived.svg", width: 1032, height: 728, provisional: true },
} as const;

export function getMedia(id: string | null | undefined): Media | null {
  if (!id) return null;
  return MEDIA[id] ?? null;
}

/** Maps a surface token to the CSS custom property that paints it. */
export function surfaceVar(token: SurfaceToken): string {
  return `var(--jia-surface-${token})`;
}

/**
 * Fonts. assets/fonts/ was empty, so no western face was supplied. These four
 * Google Fonts (SIL Open Font License) are self-hosted at build time by
 * next/font in app/layout.tsx. Swap them there; components only use the CSS vars.
 */
export const fonts = {
  display: { family: "Rokkitt", role: "Nombre de las jornadas y títulos de sección (slab estrecha, tipo de imprenta)", license: "OFL" },
  body: { family: "Alegreya", role: "Párrafos y fichas", license: "OFL" },
  ui: { family: "Barlow Semi Condensed", role: "Navegación, botones y etiquetas", license: "OFL" },
  script: { family: "Homemade Apple", role: "Nota manuscrita decorativa (un solo uso)", license: "OFL" },
} as const;
