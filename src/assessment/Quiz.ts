export const PASSING_SCORE = 5;

export interface QuizOption {
  readonly id: string;
  readonly label: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly QuizOption[];
  readonly correctOptionId: string;
  readonly explanation: string;
}

export interface NodeQuiz {
  readonly nodeId: string;
  readonly questions: readonly QuizQuestion[];
}

export interface QuizAnswer {
  readonly questionId: string;
  readonly optionId: string;
}

export interface QuestionResult {
  readonly questionId: string;
  readonly selectedOptionId: string | null;
  readonly correctOptionId: string;
  readonly explanation: string;
  readonly isCorrect: boolean;
}

export interface QuizResult {
  readonly nodeId: string;
  readonly totalQuestions: number;
  readonly correctAnswers: number;
  readonly score: number;
  readonly passed: boolean;
  readonly questions: readonly QuestionResult[];
}

function assertUniqueIds(
  values: readonly { readonly id: string }[],
  description: string,
) {
  const ids = new Set(values.map((value) => value.id));
  if (ids.size !== values.length) {
    throw new Error(`${description} must have unique identifiers.`);
  }
}

export function validateQuiz(quiz: NodeQuiz) {
  if (!quiz.nodeId) throw new Error("A quiz must belong to a Node.");
  if (quiz.questions.length === 0) {
    throw new Error("A quiz must contain at least one question.");
  }

  assertUniqueIds(quiz.questions, "Quiz questions");
  for (const question of quiz.questions) {
    if (question.options.length < 2) {
      throw new Error(`Question ${question.id} must have at least two options.`);
    }

    assertUniqueIds(question.options, `Options for question ${question.id}`);
    if (!question.options.some((option) => option.id === question.correctOptionId)) {
      throw new Error(`Question ${question.id} must reference a valid correct option.`);
    }
  }
}

export function calculateScore(correctAnswers: number, totalQuestions: number) {
  if (!Number.isInteger(correctAnswers) || !Number.isInteger(totalQuestions)) {
    throw new Error("Score inputs must be integers.");
  }
  if (totalQuestions <= 0 || correctAnswers < 0 || correctAnswers > totalQuestions) {
    throw new Error("Score inputs are outside the valid range.");
  }

  return (correctAnswers / totalQuestions) * 10;
}

export function formatScore(score: number) {
  return Number(score.toFixed(1));
}

export function scoreQuiz(
  quiz: NodeQuiz,
  answers: readonly QuizAnswer[],
): QuizResult {
  validateQuiz(quiz);
  if (new Set(answers.map((answer) => answer.questionId)).size !== answers.length) {
    throw new Error("Quiz answers must contain one answer per question.");
  }

  const answerByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer.optionId]),
  );
  const questions = quiz.questions.map((question) => {
    const selectedOptionId = answerByQuestionId.get(question.id) ?? null;

    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
      isCorrect: selectedOptionId === question.correctOptionId,
    };
  });
  const correctAnswers = questions.filter((question) => question.isCorrect).length;
  const score = calculateScore(correctAnswers, quiz.questions.length);

  return {
    nodeId: quiz.nodeId,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    score,
    passed: score >= PASSING_SCORE,
    questions,
  };
}
