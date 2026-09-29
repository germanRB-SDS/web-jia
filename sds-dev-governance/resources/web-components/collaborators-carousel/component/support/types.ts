export type Media = { id: string; variants: { src: string; width: number }[]; ratio: number; focal?: {x: number; y: number}; original?: string; license?: string };
export type SurfaceToken = string;
export function surfaceVar(token: SurfaceToken) { return `var(--wc-${token})`; }
export type CarouselModel = { label: string; items: {id: string; name: string; link: {href: string; label: string} | null; logo: Media | null; surface: SurfaceToken}[] };
export type PartnersModel = {id: string; kicker: string; title: string; text: ({kind: "text"; value: string} | {kind: "org"; id: string; name: string; url: string | null})[]; thanks: string; carousel: CarouselModel};
export type ReelModel = {posters: {id: string; media: Media; label: string; alt: string}[]; labels: {region: string; pause: string; play: string; previous: string; next: string; close: string}};
