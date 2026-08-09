import type { AssessmentSession } from "../assessment";

export interface CertificateDetails {
  readonly participantName: string;
  readonly issuedAt: Date;
  readonly completedQuizCount: number;
  readonly overallScore: number;
}

export function createCertificateDetails(session: AssessmentSession, requiredNodeIds: readonly string[], participantName: string, issuedAt = new Date()): CertificateDetails {
  const normalizedName = participantName.trim();
  if (!normalizedName) throw new Error("A participant name is required.");
  if (!session.isCertificateEligible(requiredNodeIds)) throw new Error("All required quizzes must be approved before certification.");
  return { participantName: normalizedName, issuedAt, completedQuizCount: requiredNodeIds.length, overallScore: session.getOverallScore(requiredNodeIds)! };
}
