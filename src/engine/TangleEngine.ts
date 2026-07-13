import type {
  Connection,
  FunctionalState,
  Graph,
  Journey,
  Node,
} from "../graph";
import type { Engine } from "./Engine";
import type { EngineEvent } from "./Event";
import type { Timeline, TimelineStage } from "./Timeline";

export class TangleEngine implements Engine {
  public currentStage: TimelineStage;

  public timeline: Timeline;

  public focusedNode: Node | null = null;

  public focusedConnections: readonly Connection[] = [];

  public relatedNodes: readonly Node[] = [];

  public activeJourney: Journey | null = null;

  public currentJourneyNode: Node | null = null;

  public completedJourneyNodeIds: readonly string[] = [];

  public isJourneyComplete = false;

  private functionalStates = new Map<string, FunctionalState>();

  private currentJourneyIndex = -1;

  constructor(public readonly graph: Graph) {
    this.validateGraph();

    const [initialStage] = graph.narrativeTimeline;

    if (!initialStage) {
      throw new Error("The graph narrative timeline must not be empty.");
    }

    this.currentStage = initialStage;
    this.timeline = { stages: [initialStage] };
    this.restoreFunctionalStates();
  }

  public dispatch(event: EngineEvent): void {
    if (typeof event !== "string") {
      if (event.type === "journeyStart") {
        this.startJourney(event.journeyId);
        return;
      }

      this.handleNodeEvent(event.type, event.nodeId);
      return;
    }

    switch (event) {
      case "blur":
        this.clearFocus();
        break;

      case "timelineChange":
        this.advanceTimeline();
        break;

      case "reset":
        this.reset();
        break;

      default:
        break;
    }
  }

  public getFunctionalState(nodeId: string): FunctionalState | null {
    return this.functionalStates.get(nodeId) ?? null;
  }

  private handleNodeEvent(
    type: "focus" | "activate" | "deactivate" | "complete",
    nodeId: string,
  ): void {
    switch (type) {
      case "focus":
        this.focusNode(nodeId);
        break;
      case "activate":
        this.transitionNode(nodeId, ["unlocked", "inactive"], "active");
        break;
      case "deactivate":
        this.transitionNode(nodeId, ["active"], "inactive");
        break;
      case "complete":
        if (
          this.transitionNode(
            nodeId,
            ["unlocked", "active", "inactive"],
            "completed",
          ) ||
          this.getFunctionalState(nodeId) === "completed"
        ) {
          this.recordJourneyCompletion(nodeId);
        }
        break;
    }
  }

  private focusNode(nodeId: string): void {
    const node = this.graph.nodes.find((candidate) => candidate.id === nodeId);

    if (
      !node ||
      this.getFunctionalState(nodeId) === "locked" ||
      !this.isNodeAvailableInJourney(nodeId)
    ) {
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

  private transitionNode(
    nodeId: string,
    allowedStates: readonly FunctionalState[],
    targetState: FunctionalState,
  ): boolean {
    const currentState = this.functionalStates.get(nodeId);

    if (!currentState || !allowedStates.includes(currentState)) {
      return false;
    }

    this.functionalStates.set(nodeId, targetState);
    return true;
  }

  private startJourney(journeyId: string): void {
    const journey = this.graph.journeys.find(
      (candidate) => candidate.id === journeyId,
    );

    if (!journey) {
      return;
    }

    this.clearFocus();
    this.activeJourney = journey;
    this.completedJourneyNodeIds = [];
    this.isJourneyComplete = false;
    this.currentJourneyIndex = journey.mode === "linear" ? 0 : -1;
    this.currentJourneyNode =
      journey.mode === "linear"
        ? this.findNode(journey.nodeIds[this.currentJourneyIndex]!)
        : null;
  }

  private recordJourneyCompletion(nodeId: string): void {
    const journey = this.activeJourney;

    if (
      !journey ||
      !journey.nodeIds.includes(nodeId) ||
      this.completedJourneyNodeIds.includes(nodeId)
    ) {
      return;
    }

    if (
      journey.mode === "linear" &&
      journey.nodeIds[this.currentJourneyIndex] !== nodeId
    ) {
      return;
    }

    this.completedJourneyNodeIds = [
      ...this.completedJourneyNodeIds,
      nodeId,
    ];
    this.isJourneyComplete =
      this.completedJourneyNodeIds.length === journey.nodeIds.length;

    if (journey.mode === "linear") {
      this.currentJourneyIndex += 1;
      this.currentJourneyNode = this.isJourneyComplete
        ? null
        : this.findNode(journey.nodeIds[this.currentJourneyIndex]!);
    }
  }

  private isNodeAvailableInJourney(nodeId: string): boolean {
    if (!this.activeJourney) {
      return true;
    }

    if (this.activeJourney.mode === "linear") {
      return this.currentJourneyNode?.id === nodeId;
    }

    return this.activeJourney.nodeIds.includes(nodeId);
  }

  private reset(): void {
    const initialStage = this.graph.narrativeTimeline[0]!;

    this.currentStage = initialStage;
    this.timeline = { stages: [initialStage] };
    this.clearFocus();
    this.activeJourney = null;
    this.currentJourneyNode = null;
    this.completedJourneyNodeIds = [];
    this.isJourneyComplete = false;
    this.currentJourneyIndex = -1;
    this.restoreFunctionalStates();
  }

  private restoreFunctionalStates(): void {
    this.functionalStates = new Map(
      this.graph.nodes.map((node) => [node.id, node.functionalState]),
    );
  }

  private findNode(nodeId: string): Node {
    return this.graph.nodes.find((node) => node.id === nodeId)!;
  }

  private validateGraph(): void {
    const nodeIds = this.graph.nodes.map((node) => node.id);
    const journeyIds = this.graph.journeys.map((journey) => journey.id);

    if (new Set(nodeIds).size !== nodeIds.length) {
      throw new Error("The graph must not contain duplicate node identifiers.");
    }

    if (new Set(journeyIds).size !== journeyIds.length) {
      throw new Error(
        "The graph must not contain duplicate journey identifiers.",
      );
    }

    const knownNodeIds = new Set(nodeIds);
    for (const journey of this.graph.journeys) {
      if (
        journey.nodeIds.length === 0 ||
        journey.nodeIds.some((nodeId) => !knownNodeIds.has(nodeId))
      ) {
        throw new Error(
          `Journey "${journey.id}" must reference at least one existing node.`,
        );
      }
    }
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
