import type { GlobalState } from "../graph/GlobalState";

export type TimelineStage = GlobalState;

  export interface Timeline {
  stages: TimelineStage[];
}
