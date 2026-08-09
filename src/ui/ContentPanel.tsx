"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { NodeAssessmentProgress, NodeQuiz, QuizAnswer, QuizResult } from "../assessment";
import type { PresentationNode } from "../presentation";
import { QuizPanel } from "./QuizPanel";

interface ContentPanelProps {
  readonly node: PresentationNode;
  readonly markdown: string;
  readonly quiz: NodeQuiz | null;
  readonly assessmentProgress: NodeAssessmentProgress | null;
  readonly onQuizSubmit: (answers: readonly QuizAnswer[]) => QuizResult;
  readonly onClose: () => void;
  readonly onComplete: () => void;
}

export function ContentPanel({
  node,
  markdown,
  quiz,
  assessmentProgress,
  onQuizSubmit,
  onClose,
  onComplete,
}: ContentPanelProps) {
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => setShowQuiz(false), [node.id]);

  return (
    <aside className="content-panel" aria-label={`Conteúdo: ${node.name}`}>
      <div className="panel-topline">
        <span className="eyebrow">Conceito em foco</span>
        <button className="icon-button" type="button" onClick={onClose}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Fechar conteúdo</span>
        </button>
      </div>
      {showQuiz && quiz && assessmentProgress ? (
        <QuizPanel key={node.id} quiz={quiz} progress={assessmentProgress} onBack={() => setShowQuiz(false)} onSubmit={onQuizSubmit} />
      ) : <>
        <h2>{node.name}</h2>
        <p className="panel-description">{node.description}</p>
        <div className="markdown-content"><ReactMarkdown>{markdown}</ReactMarkdown></div>
        {assessmentProgress?.isPassed ? <p className="assessment-status is-passed">✓ Teste aprovado · melhor nota: {assessmentProgress.bestResult!.score.toFixed(1)}/10</p> : assessmentProgress?.isRead ? <p className="assessment-status">✓ Conteúdo concluído · teste disponível</p> : null}
        {quiz ? <button className="quiz-start-button" type="button" onClick={() => setShowQuiz(true)}>Fazer teste <span aria-hidden="true">→</span></button> : null}
        <button className="complete-button" type="button" onClick={onComplete}>Próximo <span aria-hidden="true">→</span></button>
      </>}
    </aside>
  );
}
