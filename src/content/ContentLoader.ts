import type { ContentReference } from "../graph";
import type { LoadedContent } from "./LoadedContent";

export interface ContentLoader {
  load(reference: ContentReference): Promise<LoadedContent>;
}
