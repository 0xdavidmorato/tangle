import type { Graph } from "../graph";
import type { Node } from "../graph";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export interface Engine {
  readonly graph: Graph;
  currentStage: TimelineStage;
  timeline: Timeline;
  readonly focusedNode: Node | null;

  dispatch(event: EngineEvent): void;
}
