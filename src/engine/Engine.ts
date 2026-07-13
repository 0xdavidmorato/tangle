import type { Connection, Graph, Node } from "../graph";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export interface Engine {
  readonly graph: Graph;
  currentStage: TimelineStage;
  timeline: Timeline;
  readonly focusedNode: Node | null;
  readonly focusedConnections: readonly Connection[];
  readonly relatedNodes: readonly Node[];

  dispatch(event: EngineEvent): void;
}
