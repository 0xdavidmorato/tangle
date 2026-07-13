"use client";

import ReactMarkdown from "react-markdown";
import type { PresentationNode } from "../presentation";

interface ContentPanelProps {
  readonly node: PresentationNode;
  readonly markdown: string;
  readonly onClose: () => void;
  readonly onComplete: () => void;
}

export function ContentPanel({
  node,
  markdown,
  onClose,
  onComplete,
}: ContentPanelProps) {
  return (
    <aside className="content-panel" aria-label={`Conteúdo: ${node.name}`}>
      <div className="panel-topline">
        <span className="eyebrow">Conceito em foco</span>
        <button className="icon-button" type="button" onClick={onClose}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Fechar conteúdo</span>
        </button>
      </div>
      <h2>{node.name}</h2>
      <p className="panel-description">{node.description}</p>
      <div className="markdown-content">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      <button className="complete-button" type="button" onClick={onComplete}>
        Marcar como explorado
        <span aria-hidden="true">→</span>
      </button>
    </aside>
  );
}
