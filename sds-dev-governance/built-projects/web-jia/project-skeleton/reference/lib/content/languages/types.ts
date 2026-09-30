/** What one language IS (code and tags), as opposed to what it SAYS (see ../copy). */
export type Language = {
  readonly code: string;
  readonly htmlLang: string;
  readonly openGraph: string;
  readonly label: string;
  readonly quote: { readonly open: string; readonly close: string };
  readonly fallback?: true;
};
