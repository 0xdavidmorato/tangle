export type EngineEventType =
  | "mouseenter"
  | "mouseleave"
  | "blur"
  | "activate"
  | "deactivate"
  | "complete"
  | "scroll"
  | "zoom"
  | "cameraMove"
  | "timelineChange";

export interface FocusEvent {
  type: "focus";
  nodeId: string;
}

export type EngineEvent = EngineEventType | FocusEvent;
