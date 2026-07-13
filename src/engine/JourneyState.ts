import type { Journey, Node } from "../graph";

export interface JourneyState {
  readonly activeJourney: Journey | null;
  readonly currentJourneyNode: Node | null;
  readonly completedJourneyNodeIds: readonly string[];
  readonly isJourneyComplete: boolean;
}
