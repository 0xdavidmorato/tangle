import type { FunctionalState } from "./State";
import type { VisualState } from "./VisualState";
import type { ContentReference } from "./ContentReference";

export interface Node {
  id: string;
  name: string;
  description: string;
  category: string;
  clusterId: string;
  relationIds: string[];
  visualState: VisualState;
  functionalState: FunctionalState;
  content: ContentReference[];
  questions: string[];
  examples: string[];
  linkIds: string[];
}
