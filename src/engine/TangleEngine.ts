import type { Connection, Graph, Node } from "../graph";
import type { Engine } from "./Engine";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export class TangleEngine implements Engine {
  public currentStage: TimelineStage;

  public timeline: Timeline;

  public focusedNode: Node | null = null;

  public focusedConnections: readonly Connection[] = [];

  public relatedNodes: readonly Node[] = [];

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
      case "blur":
        this.clearFocus();
        break;

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

    this.focusedConnections = this.graph.connections.filter(
      (connection) =>
        connection.sourceNodeId === nodeId || connection.targetNodeId === nodeId,
    );

    const relatedNodeIds = new Set(
      this.focusedConnections.map((connection) =>
        connection.sourceNodeId === nodeId
          ? connection.targetNodeId
          : connection.sourceNodeId,
      ),
    );

    this.relatedNodes = this.graph.nodes.filter((candidate) =>
      relatedNodeIds.has(candidate.id),
    );
  }

  private clearFocus(): void {
    this.focusedNode = null;
    this.focusedConnections = [];
    this.relatedNodes = [];
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
