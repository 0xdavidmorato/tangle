export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  direction: string;
  intensity: number;
  priority: number;
  meaning: string;
  animation: string;
}