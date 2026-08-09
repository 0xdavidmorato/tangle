"use client";

import { useState } from "react";
import {
  formatScore,
  type NodeAssessmentProgress,
  type NodeQuiz,
  type QuizAnswer,
  type QuizResult,
} from "../assessment";

interface QuizPanelProps {
  readonly quiz: NodeQuiz;
  readonly progress: NodeAssessmentProgress;
  readonly onBack: () => void;
  readonly onSubmit: (answers: readonly QuizAnswer[]) => QuizResult;
}

export function QuizPanel({ quiz, progress, onBack, onSubmit }: QuizPanelProps) {
  const [selectedOptionByQuestionId, setSelectedOptionByQuestionId] = useState<
    Readonly<Record<string, string>>
  >({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const allQuestionsAnswered = quiz.questions.every(
    (question) => selectedOptionByQuestionId[question.id],
  );

  function submit() {
    const answers = quiz.questions.map((question) => ({
      questionId: question.id,
      optionId: selectedOptionByQuestionId[question.id]!,
    }));
    setResult(onSubmit(answers));
  }

  function retry() {
    setSelectedOptionByQuestionId({});
    setResult(null);
  }

  if (result) {
    return (
      <section className="quiz-panel" aria-label="Resultado do teste">
        <div className={`quiz-result ${result.passed ? "is-passed" : "is-review"}`}>
          <span className="eyebrow">Resultado do teste</span>
          <strong>{formatScore(result.score)} <small>/ 10</small></strong>
          <p>{result.passed ? "Aprovado — muito bem." : "Por rever — tente novamente quando quiser."}</p>
        </div>
        <div className="quiz-correction">
          {result.questions.map((questionResult, index) => {
            const question = quiz.questions[index]!;
            const selectedLabel = question.options.find(
              (option) => option.id === questionResult.selectedOptionId,
            )?.label ?? "Sem resposta";
            const correctLabel = question.options.find(
              (option) => option.id === questionResult.correctOptionId,
            )!.label;

            return (
              <article key={questionResult.questionId} className={questionResult.isCorrect ? "is-correct" : "is-incorrect"}>
                <strong>{questionResult.isCorrect ? "Correta" : "A rever"}</strong>
                <p>{question.prompt}</p>
                <small>A sua resposta: {selectedLabel}</small>
                {!questionResult.isCorrect ? <small>Resposta correta: {correctLabel}</small> : null}
                <em>{questionResult.explanation}</em>
              </article>
            );
          })}
        </div>
        <div className="quiz-actions">
          <button className="secondary-button" type="button" onClick={onBack}>Voltar à leitura</button>
          <button className="complete-button" type="button" onClick={retry}>Repetir teste <span aria-hidden="true">↻</span></button>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-panel" aria-label="Teste de conhecimento">
      <div className="quiz-heading">
        <div><span className="eyebrow">Teste de conhecimento</span><h3>Confirme o que reteve</h3></div>
        <span>{quiz.questions.length} perguntas</span>
      </div>
      {progress.bestResult ? <p className="quiz-progress">Melhor resultado: {formatScore(progress.bestResult.score)}/10{progress.isPassed ? " · aprovado" : ""}</p> : null}
      <div className="quiz-questions">
        {quiz.questions.map((question, index) => (
          <fieldset key={question.id}>
            <legend>{index + 1}. {question.prompt}</legend>
            {question.options.map((option) => (
              <label key={option.id} className={selectedOptionByQuestionId[question.id] === option.id ? "is-selected" : ""}>
                <input type="radio" name={question.id} value={option.id} checked={selectedOptionByQuestionId[question.id] === option.id} onChange={() => setSelectedOptionByQuestionId((selected) => ({ ...selected, [question.id]: option.id }))} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <div className="quiz-actions">
        <button className="secondary-button" type="button" onClick={onBack}>Voltar à leitura</button>
        <button className="complete-button" type="button" onClick={submit} disabled={!allQuestionsAnswered}>Submeter respostas <span aria-hidden="true">→</span></button>
      </div>
    </section>
  );
}
