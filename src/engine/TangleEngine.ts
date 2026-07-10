import type { Graph } from "../graph";
import type { Engine } from "./Engine";
import type { EngineEvent } from "./Event";
import type { TimelineStage } from "./Timeline";

export class TangleEngine implements Engine {
  public currentStage: TimelineStage = "initialization";

  constructor(public readonly graph: Graph) {}

  public dispatch(event: EngineEvent): void {
    // TODO: implementar o processamento de eventos
    void event;
  }
}