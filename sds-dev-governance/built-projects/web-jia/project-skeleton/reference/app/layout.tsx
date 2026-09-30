import type { Metadata, Viewport } from "next";
import { Alegreya, Barlow_Semi_Condensed, Homemade_Apple, Rokkitt } from "next/font/google";
import { MotionPreference } from "@/components/motion/MotionPreference";
import { CursorMark } from "@/components/site/CursorMark";
import { DEFAULT_LOCALE, event, LANGUAGE_BY_CODE, site } from "@/lib/content";
import { getDictionary } from "@/lib/content/copy/dictionaries";
import "./globals.css";

/**
 * FONTS. assets/fonts/ was empty, so no western face came with the project.
 * Four open-licensed families are self-hosted by next/font at build time:
 *  - Rokkitt (condensed slab, the printer's wood-type voice) for the name and titles;
 *  - Alegreya (warm, high x-height reading serif) for paragraphs and sheets;
 *  - Barlow Semi Condensed (sober, slightly narrow sans) for navigation and buttons;
 *  - Homemade Apple, one decorative handwriting: the chalk lettering on the classroom blackboard.
 * The JIA lettering itself is an SVG traced from the approved render (public/brand).
 */
const display = Rokkitt({ subsets: ["latin"], display: "swap", variable: "--font-display" });
const body = Alegreya({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--font-body" });
const ui = Barlow_Semi_Condensed({ subsets: ["latin"], weight: ["500", "600"], display: "swap", variable: "--font-ui" });
const script = Homemade_Apple({ subsets: ["latin"], weight: "400", display: "swap", preload: false, variable: "--font-script" });

const language = LANGUAGE_BY_CODE[DEFAULT_LOCALE];
const copy = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: copy.metadata.title,
  description: copy.metadata.description,
  applicationName: event.shortName,
  openGraph: {
    title: copy.metadata.title,
    description: copy.metadata.description,
    locale: language.openGraph,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1e7d8",
  width: "device-width",
  initialScale: 1,
};

const CONTRACT = `DIRECTION CONTRACT (Impeccable, seed 0634789a)
THESIS: a teacher's field notebook of the jornadas — the page is a set of
notebook spreads (running head in the margin, ruled programme lists, pinned
lobby cards on parchment), not a stack of event cards.
OWN-WORLD: warm paper (#f1e7d8) with grain, JIA ink, terracotta accents,
condensed slab titles, a reading serif, one handwritten note, the
"Tinta de frontera" line icons, posters held by a terracotta pin.
STORY: a teacher recognises JIA at once, sees the two dates, understands
the western thread is a language for classroom innovation, and goes to
the programme or the workshops.
FIRST VIEWPORT: render composition rebuilt — lockup left on quiet paper,
photograph bleeding from the right and dissolving into paper, italic
edition title, dateline, one paragraph, primary terracotta action.
FORM: field notebook, candidate 7 of 7 (dealt lead), seed 0634789a.
FINISH: unreviewed and undocumented is unfinished; this build ends with
the finish review, the verdict, DESIGN.md, and every shipping raster
carrying its provenance.`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={language.htmlLang} className={`${display.variable} ${body.variable} ${ui.variable} ${script.variable}`}>
      <body>
        {/* The direction contract is emitted as a real HTML comment so it survives the production build (grep "0634789a" in out/index.html). */}
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--
${CONTRACT}
-->` }} />
        <MotionPreference copy={copy.motion} />
        {children}
        <CursorMark />
      </body>
    </html>
  );
}
