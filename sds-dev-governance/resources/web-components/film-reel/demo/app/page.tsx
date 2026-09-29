import type { CSSProperties } from "react";
import { FilmReel } from "../../component/FilmReel";
import { content } from "./content";
export default function Page() { return <main style={{"--reel-frame-image": content.assets.frame, "--reel-stains-image": content.assets.stains} as CSSProperties}><h1>{content.title}</h1><FilmReel reel={content.reel} /></main>; }
