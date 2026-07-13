import type { ContentReference } from "../graph";

export interface LoadedContent {
  readonly reference: ContentReference;
  readonly body: string;
}
