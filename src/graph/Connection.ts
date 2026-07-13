export type ConnectionDirection = "directed" | "bidirectional";

export type ConnectionIntensity = number;

export type ConnectionPriority = number;

export type ConnectionMeaning = string;

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  direction: ConnectionDirection;
  intensity: ConnectionIntensity;
  priority: ConnectionPriority;
  meaning: ConnectionMeaning;
  animation: string;
}
