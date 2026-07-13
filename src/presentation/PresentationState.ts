import type {
  ConnectionDirection,
  ContentReference,
  FunctionalState,
  GlobalState,
  JourneyMode,
} from "../graph";

export type PresentationEmphasis = "primary" | "related" | "context";

export interface PresentationNode {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly clusterId: string;
  readonly functionalState: FunctionalState;
  readonly emphasis: PresentationEmphasis;
  readonly isJourneyCurrent: boolean;
  readonly content: readonly ContentReference[];
}

export interface PresentationConnection {
  readonly id: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly direction: ConnectionDirection;
  readonly intensity: number;
  readonly priority: number;
  readonly meaning: string;
  readonly emphasis: Exclude<PresentationEmphasis, "related">;
}

export interface PresentationCluster {
  readonly id: string;
  readonly name: string;
  readonly nodeIds: readonly string[];
}

export interface PresentationJourney {
  readonly id: string;
  readonly name: string;
  readonly mode: JourneyMode;
  readonly currentNodeId: string | null;
  readonly completedNodeIds: readonly string[];
  readonly isComplete: boolean;
}

export interface PresentationState {
  readonly stage: GlobalState;
  readonly timeline: readonly GlobalState[];
  readonly nodes: readonly PresentationNode[];
  readonly connections: readonly PresentationConnection[];
  readonly clusters: readonly PresentationCluster[];
  readonly journey: PresentationJourney | null;
}
