import {
  AssessmentSession,
  type AssessmentSessionSnapshot,
  type QuizResult,
} from "../../assessment";

export const ASSESSMENT_PROGRESS_STORAGE_KEY = "tangle.assessment-progress.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isQuizResult(value: unknown): value is QuizResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<QuizResult>;
  return typeof result.nodeId === "string"
    && typeof result.score === "number"
    && typeof result.passed === "boolean"
    && Array.isArray(result.questions);
}

function isSnapshot(value: unknown): value is AssessmentSessionSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<AssessmentSessionSnapshot>;
  return snapshot.version === 1
    && Array.isArray(snapshot.readNodeIds)
    && snapshot.readNodeIds.every((nodeId) => typeof nodeId === "string")
    && !!snapshot.attemptsByNodeId
    && Object.values(snapshot.attemptsByNodeId).every(
      (attempts) => Array.isArray(attempts) && attempts.every(isQuizResult),
    );
}

function browserStorage(): StorageLike | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function loadAssessmentSession(storage = browserStorage()) {
  if (!storage) return new AssessmentSession();

  try {
    const stored = storage.getItem(ASSESSMENT_PROGRESS_STORAGE_KEY);
    if (!stored) return new AssessmentSession();
    const snapshot: unknown = JSON.parse(stored);
    return isSnapshot(snapshot)
      ? AssessmentSession.fromSnapshot(snapshot)
      : new AssessmentSession();
  } catch {
    return new AssessmentSession();
  }
}

export function saveAssessmentSession(
  session: AssessmentSession,
  storage = browserStorage(),
) {
  if (!storage) return;
  storage.setItem(ASSESSMENT_PROGRESS_STORAGE_KEY, JSON.stringify(session.toSnapshot()));
}

export function clearAssessmentSession(storage = browserStorage()) {
  if (!storage) return;
  storage.removeItem(ASSESSMENT_PROGRESS_STORAGE_KEY);
}
