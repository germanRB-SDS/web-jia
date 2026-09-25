/**
 * ENLACES EXTERNOS — the one place that holds the URLs the site links out to (JIA-2026-09-25).
 * Nothing links to a hard-coded address: sections/*.ts and assemble.ts read from here. The button texts
 * live in copy/es/buttons.ts; a link left `null` makes its button render as unavailable.
 */
export const ENLACES = {
  /** «Dispara tu idea» (section «Tu propuesta JIA»): Google Form to propose the next edition's theme. */
  formularioPropuesta: "https://docs.google.com/forms/d/e/1FAIpQLSfI_UsxUpuS22csNSY0rQ4kPLPRir9Tmk4YLh7Dkv7d58ncRQ/viewform?usp=header",
  /** «Quiero acoger las JIA» (section «Dispara tu centro»): Google Form for centres offering to host an edition. */
  formularioAcoger: "https://docs.google.com/forms/d/e/1FAIpQLSe_J5mKeGUYmipuKeZvcBg3asMYh4cp8-9docFSTrjCijbeFw/viewform?usp=header",
} as const satisfies Record<string, string | null>;
