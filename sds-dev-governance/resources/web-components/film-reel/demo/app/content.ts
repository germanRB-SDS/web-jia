import type { Media } from "../../component/support/types";
export const media: Media[] = Array.from({length: 6}, (_, i) => ({id: `sample-${i+1}`, ratio: 400/566, variants: [{src: `/media/sample-${i+1}.svg`, width: 400}]}));
export const content = {title: "Ideas de cine", reel: {posters: media.map((m,i) => ({id: m.id, media: m, label: `Ampliar cartel ${i+1}`, alt: `Composición geométrica ${i+1}`})), labels: {region: "Tira de cine", pause: "Pausar", play: "Reanudar", previous: "Anterior", next: "Siguiente", close: "Cerrar"}}, assets: {frame: "url(/media/frame.svg)", stains: "none"}};
