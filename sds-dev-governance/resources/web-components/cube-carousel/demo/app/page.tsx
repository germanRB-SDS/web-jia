import { CubeCarousel } from "../../component";
import { content } from "./content";
export default function Page() { return <main><h1>{content.title}</h1><CubeCarousel items={content.items} labels={content.labels}/></main>; }
