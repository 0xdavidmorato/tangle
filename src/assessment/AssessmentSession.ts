import type { NodeQuiz, QuizAnswer, QuizResult } from "./Quiz";
import { scoreQuiz } from "./Quiz";

export interface NodeAssessmentProgress {
  readonly nodeId: string;
  readonly attempts: readonly QuizResult[];
  readonly latestResult: QuizResult | null;
  readonly bestResult: QuizResult | null;
  readonly isPassed: boolean;
}

function emptyProgress(nodeId: string): NodeAssessmentProgress {
  return {
    nodeId,
    attempts: [],
    latestResult: null,
    bestResult: null,
    isPassed: false,
  };
}

export class AssessmentSession {
  private readonly attemptsByNodeId = new Map<string, QuizResult[]>();

  submit(quiz: NodeQuiz, answers: readonly QuizAnswer[]): QuizResult {
    const result = scoreQuiz(quiz, answers);
    const attempts = this.attemptsByNodeId.get(result.nodeId) ?? [];
    this.attemptsByNodeId.set(result.nodeId, [...attempts, result]);
    return result;
  }

  getProgress(nodeId: string): NodeAssessmentProgress {
    const attempts = this.attemptsByNodeId.get(nodeId) ?? [];
    if (attempts.length === 0) return emptyProgress(nodeId);

    const bestResult = attempts.reduce((best, attempt) =>
      attempt.score > best.score ? attempt : best,
    );

    return {
      nodeId,
      attempts: [...attempts],
      latestResult: attempts.at(-1) ?? null,
      bestResult,
      isPassed: bestResult.passed,
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
}
