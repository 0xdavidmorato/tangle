import type { Cluster } from "./Cluster";
import type { Connection } from "./Connection";
import type { Journey } from "./Journey";
import type { Node } from "./Node";

export interface Graph {
  nodes: Node[];
  connections: Connection[];
  clusters: Cluster[];
  journeys: Journey[];
  timeline: string[];
}