const assert = require("node:assert/strict");
const test = require("node:test");

const {
  AssessmentSession,
  calculateScore,
  formatScore,
  scoreQuiz,
  tangleQuizzes,
  validateQuiz,
} = require("../.test-dist/assessment/index.js");
const { tangleGraph } = require("../.test-dist/graph/tangleGraph.js");
const { createCertificateDetails } = require("../.test-dist/certificate/index.js");
const {
  ASSESSMENT_PROGRESS_STORAGE_KEY,
  clearAssessmentSession,
  loadAssessmentSession,
  saveAssessmentSession,
} = require("../.test-dist/infrastructure/assessment/index.js");

const quiz = {
  nodeId: "boa-empresa.parcerias",
  questions: [
    {
      id: "trust",
      prompt: "Qual é a base de uma parceria sólida?",
      options: [
        { id: "a", label: "Confiança" },
        { id: "b", label: "Segredo" },
        { id: "c", label: "Lucro imediato" },
      ],
      correctOptionId: "a",
      explanation: "A confiança permite uma relação estratégica de longo prazo.",
    },
    {
      id: "transparency",
      prompt: "O que deve o fornecedor comunicar antecipadamente?",
      options: [
        { id: "a", label: "Apenas boas notícias" },
        { id: "b", label: "Alterações que afetem o serviço" },
        { id: "c", label: "Nada" },
      ],
      correctOptionId: "b",
      explanation: "A transparência reduz riscos e fortalece a confiança.",
    },
    {
      id: "problems",
      prompt: "Qual deve ser o objetivo perante um problema?",
      options: [
        { id: "a", label: "Encontrar culpados" },
        { id: "b", label: "Evitar comunicar" },
        { id: "c", label: "Encontrar uma solução conjunta" },
      ],
      correctOptionId: "c",
      explanation: "A parceria procura resolver o problema e aprender com ele.",
    },
  ],
};

test("scores a quiz from zero to ten and exposes the correction", () => {
  const result = scoreQuiz(quiz, [
    { questionId: "trust", optionId: "a" },
    { questionId: "transparency", optionId: "b" },
  ]);

  assert.equal(result.correctAnswers, 2);
  assert.equal(result.totalQuestions, 3);
  assert.equal(formatScore(result.score), 6.7);
  assert.equal(result.passed, true);
  assert.deepEqual(result.questions[2], {
    questionId: "problems",
    selectedOptionId: null,
    correctOptionId: "c",
    explanation: "A parceria procura resolver o problema e aprender com ele.",
    isCorrect: false,
  });
  assert.equal(calculateScore(0, 3), 0);
  assert.equal(calculateScore(3, 3), 10);
});

test("rejects invalid quiz definitions and duplicated answers", () => {
  assert.throws(() => validateQuiz({ ...quiz, questions: [] }));
  assert.throws(() => validateQuiz({
    ...quiz,
    questions: [{ ...quiz.questions[0], correctOptionId: "missing" }],
  }));
  assert.throws(() => scoreQuiz(quiz, [
    { questionId: "trust", optionId: "a" },
    { questionId: "trust", optionId: "b" },
  ]));
  assert.throws(() => calculateScore(4, 3));
});

test("preserves the best passing score across free repeats", () => {
  const session = new AssessmentSession();
  session.submit(quiz, [
    { questionId: "trust", optionId: "b" },
    { questionId: "transparency", optionId: "a" },
    { questionId: "problems", optionId: "a" },
  ]);
  session.submit(quiz, [
    { questionId: "trust", optionId: "a" },
    { questionId: "transparency", optionId: "b" },
    { questionId: "problems", optionId: "c" },
  ]);
  session.submit(quiz, [
    { questionId: "trust", optionId: "b" },
    { questionId: "transparency", optionId: "b" },
    { questionId: "problems", optionId: "a" },
  ]);

  const progress = session.getProgress(quiz.nodeId);
  assert.equal(progress.attempts.length, 3);
  assert.equal(formatScore(progress.latestResult.score), 3.3);
  assert.equal(progress.bestResult.score, 10);
  assert.equal(progress.isPassed, true);
  assert.equal(session.isCertificateEligible([quiz.nodeId]), true);
  assert.equal(session.getOverallScore([quiz.nodeId]), 10);
  assert.equal(session.isCertificateEligible([quiz.nodeId, "boas-pessoas.definicao"]), false);
});

test("summarizes reading and approval progress for a group of Nodes", () => {
  const session = new AssessmentSession();
  session.markContentRead(quiz.nodeId);
  session.submit(quiz, [
    { questionId: "trust", optionId: "a" },
    { questionId: "transparency", optionId: "b" },
    { questionId: "problems", optionId: "c" },
  ]);
  session.markContentRead("boas-pessoas.definicao");

  assert.deepEqual(
    session.summarize([quiz.nodeId, "boas-pessoas.definicao", "missing"]),
    { totalCount: 3, readCount: 2, passedCount: 1 },
  );
});

test("provides exactly three valid questions for every content Node", () => {
  const quizNodeIds = tangleQuizzes.map((quizDefinition) => quizDefinition.nodeId).sort();
  const graphNodeIds = tangleGraph.nodes.map((node) => node.id).sort();

  assert.deepEqual(quizNodeIds, graphNodeIds);
  assert.ok(tangleQuizzes.every((quizDefinition) => {
    validateQuiz(quizDefinition);
    return quizDefinition.questions.length === 3;
  }));
});

test("persists read content and assessment attempts locally", () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };
  const session = new AssessmentSession();
  session.markContentRead(quiz.nodeId);
  session.submit(quiz, [
    { questionId: "trust", optionId: "a" },
    { questionId: "transparency", optionId: "b" },
    { questionId: "problems", optionId: "c" },
  ]);

  saveAssessmentSession(session, storage);
  const restored = loadAssessmentSession(storage);

  assert.equal(restored.getProgress(quiz.nodeId).isRead, true);
  assert.equal(restored.getProgress(quiz.nodeId).isPassed, true);
  assert.ok(values.has(ASSESSMENT_PROGRESS_STORAGE_KEY));
});

test("clears only the locally persisted assessment session", () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
  const session = new AssessmentSession();
  session.markContentRead(quiz.nodeId);
  saveAssessmentSession(session, storage);

  clearAssessmentSession(storage);

  assert.equal(values.has(ASSESSMENT_PROGRESS_STORAGE_KEY), false);
  assert.equal(loadAssessmentSession(storage).getProgress(quiz.nodeId).isRead, false);
});

test("ignores invalid locally stored assessment data", () => {
  const storage = { getItem() { return "{not-json"; }, setItem() {} };
  const session = loadAssessmentSession(storage);

  assert.equal(session.getProgress(quiz.nodeId).isRead, false);
  assert.equal(session.getProgress(quiz.nodeId).attempts.length, 0);
});

test("creates a certificate only for a completed assessment", () => {
  const session = new AssessmentSession();
  session.submit(quiz, [
    { questionId: "trust", optionId: "a" },
    { questionId: "transparency", optionId: "b" },
    { questionId: "problems", optionId: "c" },
  ]);

  const details = createCertificateDetails(
    session,
    [quiz.nodeId],
    "  Ana Silva  ",
    new Date("2026-08-09T00:00:00Z"),
  );
  assert.equal(details.participantName, "Ana Silva");
  assert.equal(details.completedQuizCount, 1);
  assert.equal(details.overallScore, 10);
  assert.throws(() => createCertificateDetails(session, [quiz.nodeId], ""));
  assert.throws(() => createCertificateDetails(session, [quiz.nodeId, "missing"], "Ana Silva"));
});
