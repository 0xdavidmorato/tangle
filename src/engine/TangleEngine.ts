import type { Graph } from "../graph";
import type { Engine } from "./Engine";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export class TangleEngine implements Engine {
  public currentStage: TimelineStage = "initialization";

  public timeline: Timeline = {
    stages: ["initialization"],
  };

  constructor(public readonly graph: Graph) {}

  public dispatch(event: EngineEvent): void {
    switch (event) {
      case "timelineChange":
        this.advanceTimeline();
        break;

      default:
        break;
    }
  }

  private advanceTimeline(): void {
    switch (this.currentStage) {
      case "initialization":
        this.currentStage = "introduction";
        break;

      case "introduction":
        this.currentStage = "exploration";
        break;

      case "exploration":
        this.currentStage = "focus";
        break;

      case "focus":
        this.currentStage = "reflection";
        break;

      case "reflection":
        this.currentStage = "conclusion";
        break;

      case "conclusion":
        break;
    }
  }
}