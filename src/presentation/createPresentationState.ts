import type { Engine } from "../engine";
import type {
  PresentationConnection,
  PresentationNode,
  PresentationState,
} from "./PresentationState";

export function createPresentationState(engine: Engine): PresentationState {
  const focusedNodeId = engine.focusedNode?.id ?? null;
  const relatedNodeIds = new Set(engine.relatedNodes.map((node) => node.id));
  const focusedConnectionIds = new Set(
    engine.focusedConnections.map((connection) => connection.id),
  );

  const nodes: PresentationNode[] = engine.graph.nodes.map((node) => ({
    id: node.id,
    name: node.name,
    description: node.description,
    clusterId: node.clusterId,
    functionalState:
      engine.getFunctionalState(node.id) ?? node.functionalState,
    emphasis:
      node.id === focusedNodeId
        ? "primary"
        : relatedNodeIds.has(node.id)
          ? "related"
          : "context",
    isJourneyCurrent: engine.currentJourneyNode?.id === node.id,
    content: [...node.content],
  }));

  const connections: PresentationConnection[] = engine.graph.connections.map(
    (connection) => ({
      id: connection.id,
      sourceNodeId: connection.sourceNodeId,
      targetNodeId: connection.targetNodeId,
      direction: connection.direction,
      intensity: connection.intensity,
      priority: connection.priority,
      meaning: connection.meaning,
      emphasis: focusedConnectionIds.has(connection.id) ? "primary" : "context",
    }),
  );

  return {
    stage: engine.currentStage,
    timeline: [...engine.timeline.stages],
    nodes,
    connections,
    journey: engine.activeJourney
      ? {
          id: engine.activeJourney.id,
          name: engine.activeJourney.name,
          mode: engine.activeJourney.mode,
          currentNodeId: engine.currentJourneyNode?.id ?? null,
          completedNodeIds: [...engine.completedJourneyNodeIds],
          isComplete: engine.isJourneyComplete,
        }
      : null,
  };
}
