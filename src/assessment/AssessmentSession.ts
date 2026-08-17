import type { NodeQuiz, QuizAnswer, QuizResult } from "./Quiz";
import { scoreQuiz } from "./Quiz";

export interface NodeAssessmentProgress {
  readonly nodeId: string;
  readonly isRead: boolean;
  readonly attempts: readonly QuizResult[];
  readonly latestResult: QuizResult | null;
  readonly bestResult: QuizResult | null;
  readonly isPassed: boolean;
}

export interface AssessmentProgressSummary {
  readonly totalCount: number;
  readonly readCount: number;
  readonly passedCount: number;
}

export interface AssessmentSessionSnapshot {
  readonly version: 1;
  readonly readNodeIds: readonly string[];
  readonly attemptsByNodeId: Readonly<Record<string, readonly QuizResult[]>>;
}

function emptyProgress(nodeId: string): NodeAssessmentProgress {
  return {
    nodeId,
    isRead: false,
    attempts: [],
    latestResult: null,
    bestResult: null,
    isPassed: false,
  };
}

export class AssessmentSession {
  private readonly attemptsByNodeId = new Map<string, QuizResult[]>();
  private readonly readNodeIds = new Set<string>();

  static fromSnapshot(snapshot: AssessmentSessionSnapshot) {
    if (snapshot.version !== 1) throw new Error("Unsupported assessment snapshot.");

    const session = new AssessmentSession();
    snapshot.readNodeIds.forEach((nodeId) => session.readNodeIds.add(nodeId));
    Object.entries(snapshot.attemptsByNodeId).forEach(([nodeId, attempts]) => {
      session.attemptsByNodeId.set(nodeId, [...attempts]);
    });
    return session;
  }

  markContentRead(nodeId: string) {
    this.readNodeIds.add(nodeId);
  }

  submit(quiz: NodeQuiz, answers: readonly QuizAnswer[]): QuizResult {
    const result = scoreQuiz(quiz, answers);
    const attempts = this.attemptsByNodeId.get(result.nodeId) ?? [];
    this.attemptsByNodeId.set(result.nodeId, [...attempts, result]);
    return result;
  }

  getProgress(nodeId: string): NodeAssessmentProgress {
    const attempts = this.attemptsByNodeId.get(nodeId) ?? [];
    if (attempts.length === 0) {
      return {
        ...emptyProgress(nodeId),
        isRead: this.readNodeIds.has(nodeId),
      };
    }

    const bestResult = attempts.reduce((best, attempt) =>
      attempt.score > best.score ? attempt : best,
    );

    return {
      nodeId,
      isRead: this.readNodeIds.has(nodeId),
      attempts: [...attempts],
      latestResult: attempts.at(-1) ?? null,
      bestResult,
      isPassed: bestResult.passed,
    };
  }

  summarize(nodeIds: readonly string[]): AssessmentProgressSummary {
    const progress = nodeIds.map((nodeId) => this.getProgress(nodeId));
    return {
      totalCount: progress.length,
      readCount: progress.filter((node) => node.isRead).length,
      passedCount: progress.filter((node) => node.isPassed).length,
    };
  }

  isCertificateEligible(requiredNodeIds: readonly string[]) {
    if (requiredNodeIds.length === 0) {
      throw new Error("A certificate requires at least one assessed Node.");
    }
    if (new Set(requiredNodeIds).size !== requiredNodeIds.length) {
      throw new Error("Required assessment Nodes must be unique.");
    }

    return requiredNodeIds.every((nodeId) => this.getProgress(nodeId).isPassed);
  }

  getOverallScore(requiredNodeIds: readonly string[]) {
    if (!this.isCertificateEligible(requiredNodeIds)) return null;

    const bestScores = requiredNodeIds.map((nodeId) =>
      this.getProgress(nodeId).bestResult!.score,
    );
    return bestScores.reduce((total, score) => total + score, 0) / bestScores.length;
  }

  toSnapshot(): AssessmentSessionSnapshot {
    return {
      version: 1,
      readNodeIds: [...this.readNodeIds],
      attemptsByNodeId: Object.fromEntries(
        [...this.attemptsByNodeId.entries()].map(([nodeId, attempts]) => [
          nodeId,
          [...attempts],
        ]),
      ),
    };
  }
}
