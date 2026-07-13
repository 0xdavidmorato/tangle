import type { Cluster } from "./Cluster";
import type { Connection } from "./Connection";
import type { Journey } from "./Journey";
import type { Node } from "./Node";
import type { NarrativeTimeline } from "./NarrativeTimeline";

export interface Graph {
  nodes: Node[];
  connections: Connection[];
  clusters: Cluster[];
  journeys: Journey[];
  narrativeTimeline: NarrativeTimeline;
}
