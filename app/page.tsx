import { Experiences } from "@/components/site/Experiences";
import { Hero } from "@/components/site/Hero";
import { Host } from "@/components/site/Host";
import { Jornadas } from "@/components/site/Jornadas";
import { Partners } from "@/components/site/Partners";
import { Proposals } from "@/components/site/Proposals";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Waypoints } from "@/components/site/Waypoints";
import { DEFAULT_LOCALE, getLanding } from "@/lib/content";

/**
 * The landing, in reading order (brief §3):
 * hero → signpost → Jornadas (programa, cómo funcionan, talleres) →
 * Experiencias → Propuestas → Acoge JIA → footer.
 * The locale is resolved once here; every section receives its assembled model.
 */
export default function Home() {
  const m = getLanding(DEFAULT_LOCALE);
  const showMarks = m.markProvisional;

  return (
    <>
      <a href="#contenido" className="skip">
        {m.copy.nav.skip}
      </a>
      <SiteHeader nav={m.nav} brand={m.brand} event={m.event} copy={m.copy} />
      <main id="contenido">
        <Hero hero={m.hero} brand={m.brand} markLabels={m.copy.states} showMarks={showMarks} />
        <Waypoints waypoints={m.waypoints} title={m.copy.waypoints.title} regionLabel={m.copy.a11y.waypointsRegion} />
        <Jornadas jornadas={m.jornadas} copy={m.copy} showMarks={showMarks} />
        <Experiences experiencias={m.experiencias} copy={m.copy} showMarks={showMarks} />
        <Proposals propuestas={m.propuestas} copy={m.copy} showMarks={showMarks} />
        <Partners partners={m.partners} />
        <Host acoge={m.acoge} copy={m.copy} />
      </main>
      <SiteFooter footer={m.footer} brand={m.brand} event={m.event} copy={m.copy} />
    </>
  );
}
