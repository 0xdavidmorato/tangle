"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { NodeAssessmentProgress, NodeQuiz, QuizAnswer, QuizResult } from "../assessment";
import type { PresentationNode } from "../presentation";
import { QuizPanel } from "./QuizPanel";
import { trapFocus } from "./focus";

interface ContentPanelProps {
  readonly node: PresentationNode;
  readonly markdown: string;
  readonly quiz: NodeQuiz | null;
  readonly assessmentProgress: NodeAssessmentProgress | null;
  readonly onQuizSubmit: (answers: readonly QuizAnswer[]) => QuizResult;
  readonly onClose: () => void;
  readonly onComplete: () => void;
}

function focusedTitle(node: PresentationNode) {
  return node.clusterName === "Interligações"
    ? `${node.clusterName}: ${node.name}`
    : `${node.name} de ${node.clusterName}`;
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setShowQuiz(false), [node.id]);
  useEffect(() => closeButtonRef.current?.focus(), [node.id]);

  return (
    <aside
      className="content-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`content-title-${node.id}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          return;
        }
        trapFocus(event, event.currentTarget);
      }}
    >
      <div className="panel-topline">
        <span className="eyebrow">Conceito em foco</span>
        <button ref={closeButtonRef} className="icon-button" type="button" onClick={onClose}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Fechar conteúdo</span>
        </button>
      </div>
      {showQuiz && quiz && assessmentProgress ? (
        <QuizPanel key={node.id} quiz={quiz} progress={assessmentProgress} onBack={() => setShowQuiz(false)} onSubmit={onQuizSubmit} />
      ) : <>
        <h2 id={`content-title-${node.id}`}>{focusedTitle(node)}</h2>
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null,
              table: ({ children }) => (
                <div className="markdown-table-wrap">
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
        {assessmentProgress?.isPassed ? <p className="assessment-status is-passed">✓ Teste aprovado · melhor nota: {assessmentProgress.bestResult!.score.toFixed(1)}/10</p> : assessmentProgress?.isRead ? <p className="assessment-status">✓ Conteúdo concluído · teste disponível</p> : null}
        {quiz ? <button className="quiz-start-button" type="button" onClick={() => setShowQuiz(true)}>Fazer teste <span aria-hidden="true">→</span></button> : null}
        <button className="complete-button" type="button" onClick={onComplete}>Próximo <span aria-hidden="true">→</span></button>
      </>}
    </aside>
  );
}
