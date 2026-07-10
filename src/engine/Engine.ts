import type { Graph } from "../graph";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export interface Engine {
  readonly graph: Graph;
  currentStage: TimelineStage;
  timeline: Timeline;

  dispatch(event: EngineEvent): void;
}