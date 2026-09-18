/**
 * Content aggregator. Components import from here (or from ./assemble for the
 * view model) and never reach into an individual module.
 */
export { getLanding } from "./assemble";
export type { Action, DayModel, IntroVideoModel, LandingModel, MarkKind, NavItem, RouteModel, SheetModel, SheetSection, TeamCard, ResourceModel } from "./assemble";
export { DEFAULT_LOCALE, isLocale, LANGUAGES, LANGUAGE_BY_CODE, LOCALES } from "./languages";
export type { Language, Locale } from "./languages";
export { event, edition, site } from "./site";
export { MEDIA, brand, fonts, getMedia, surfaceVar } from "./media";
export type { Media, MediaVariant } from "./media";
export { format } from "./copy";
export type { Copy } from "./copy";
export type { SurfaceToken } from "./data/types";
