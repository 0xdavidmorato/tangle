export type TimelineStage =
  | "initialization"
  | "introduction"
  | "exploration"
  | "focus"
  | "reflection"
  | "conclusion";

  export interface Timeline {
  stages: TimelineStage[];
}