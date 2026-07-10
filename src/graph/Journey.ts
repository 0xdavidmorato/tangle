export type JourneyMode = "linear" | "exploratory";

export interface Journey {
  id: string;
  name: string;
  mode: JourneyMode;
  nodeIds: string[];
}