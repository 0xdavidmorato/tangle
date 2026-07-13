import type { Connection, FunctionalState, Graph, Node } from "../graph";
import type { EngineEvent } from "./Event";
import type { JourneyState } from "./JourneyState";
import type { Timeline, TimelineStage } from "./Timeline";

export interface Engine extends JourneyState {
  readonly graph: Graph;
  currentStage: TimelineStage;
  timeline: Timeline;
  readonly focusedNode: Node | null;
  readonly focusedConnections: readonly Connection[];
  readonly relatedNodes: readonly Node[];

  dispatch(event: EngineEvent): void;
  getFunctionalState(nodeId: string): FunctionalState | null;
}
