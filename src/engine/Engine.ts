import type { Graph } from "../graph";
import type { EngineEvent } from "./Event";
import type { TimelineStage } from "./Timeline";

export interface Engine {
  readonly graph: Graph;
  currentStage: TimelineStage;

  dispatch(event: EngineEvent): void;
}