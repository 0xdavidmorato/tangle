import type { Graph, Node } from "../graph";
import type { Engine } from "./Engine";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export class TangleEngine implements Engine {
  public currentStage: TimelineStage = "initialization";

  public timeline: Timeline = {
    stages: ["initialization"],
  };

  public focusedNode: Node | null = null;

  constructor(public readonly graph: Graph) {}

  public dispatch(event: EngineEvent): void {
    if (typeof event !== "string") {
      this.focusNode(event.nodeId);
      return;
    }

    switch (event) {
      case "timelineChange":
        this.advanceTimeline();
        break;

      default:
        break;
    }
  }

  private focusNode(nodeId: string): void {
    const node = this.graph.nodes.find((candidate) => candidate.id === nodeId);

    if (!node || node.functionalState === "locked") {
      return;
    }

    this.focusedNode = node;
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
        return;
    }

    this.timeline.stages.push(this.currentStage);
  }
}
