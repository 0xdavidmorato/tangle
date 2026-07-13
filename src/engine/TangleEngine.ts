import type { Graph, Node } from "../graph";
import type { Engine } from "./Engine";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export class TangleEngine implements Engine {
  public currentStage: TimelineStage;

  public timeline: Timeline;

  public focusedNode: Node | null = null;

  constructor(public readonly graph: Graph) {
    const [initialStage] = graph.narrativeTimeline;

    if (!initialStage) {
      throw new Error("The graph narrative timeline must not be empty.");
    }

    this.currentStage = initialStage;
    this.timeline = { stages: [initialStage] };
  }

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
    const currentIndex = this.graph.narrativeTimeline.indexOf(this.currentStage);
    const nextStage = this.graph.narrativeTimeline[currentIndex + 1];

    if (!nextStage) {
      return;
    }

    this.currentStage = nextStage;

    this.timeline.stages.push(this.currentStage);
  }
}
