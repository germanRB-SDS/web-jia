export type Media = { id: string; variants: { src: string; width: number }[]; ratio: number; focal?: {x: number; y: number}; original?: string; license?: string };
export type ReelModel = {posters: {id: string; media: Media; label: string; alt: string}[]; labels: {region: string; pause: string; play: string; previous: string; next: string; close: string}};
