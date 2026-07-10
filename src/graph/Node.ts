export interface Node {
  id: string;
  name: string;
  description: string;
  category: string;
  clusterId: string;
  relationIds: string[];
  visualState: string;
  functionalState: string;
  content: string[];
  questions: string[];
  examples: string[];
  linkIds: string[];
}