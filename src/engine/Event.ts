export type EngineEventType =
  | "mouseenter"
  | "mouseleave"
  | "blur"
  | "scroll"
  | "zoom"
  | "cameraMove"
  | "timelineChange"
  | "reset";

export type NodeEventType = "focus" | "activate" | "deactivate" | "complete";

export interface NodeEvent {
  type: NodeEventType;
  nodeId: string;
}

export interface JourneyStartEvent {
  type: "journeyStart";
  journeyId: string;
}

export type FocusEvent = NodeEvent & { type: "focus" };

export type EngineEvent = EngineEventType | NodeEvent | JourneyStartEvent;
