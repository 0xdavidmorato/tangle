"use client";

import { useRef, useState } from "react";
import type { EngineEvent } from "../engine";
import { TangleEngine } from "../engine";
import type { Graph } from "../graph";
import {
  createPresentationState,
  type PresentationState,
} from "../presentation";
import { ContentPanel } from "./ContentPanel";
import { KnowledgeNetwork } from "./KnowledgeNetwork";

interface TangleExperienceProps {
  readonly graph: Graph;
  readonly contentByNodeId: Readonly<Record<string, string>>;
}

export function TangleExperience({
  graph,
  contentByNodeId,
}: TangleExperienceProps) {
  const engineRef = useRef<TangleEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new TangleEngine(graph);
  }

  const [state, setState] = useState<PresentationState>(() =>
    createPresentationState(engineRef.current!),
  );

  function dispatch(event: EngineEvent) {
    engineRef.current!.dispatch(event);
    setState(createPresentationState(engineRef.current!));
  }

  const focusedNode = state.nodes.find(
    (node) => node.emphasis === "primary",
  );

  return (
    <main className={`experience ${focusedNode ? "has-focus" : ""}`}>
      <header className="experience-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <strong>TANGLE</strong>
            <small>Tudo está ligado.</small>
          </div>
        </div>
        <div className="experience-status" aria-live="polite">
          <span className="status-pulse" />
          <span>{state.stage}</span>
          <span className="status-separator">/</span>
          <span>{state.nodes.length} conceitos</span>
        </div>
      </header>

      <section className="experience-copy">
        <span className="eyebrow">Conhecimento organizacional</span>
        <h1>Uma organização é um organismo vivo.</h1>
        <p>
          Aproxime-se de um conceito e observe como cada decisão reverbera pela
          rede.
        </p>
      </section>

      <KnowledgeNetwork
        nodes={state.nodes}
        connections={state.connections}
        onFocus={(nodeId) => dispatch({ type: "focus", nodeId })}
      />

      <div className="journey-controls" aria-label="Percurso de exploração">
        <button
          type="button"
          className={state.journey?.id === "core-narrative" ? "active" : ""}
          onClick={() =>
            dispatch({ type: "journeyStart", journeyId: "core-narrative" })
          }
        >
          Percurso guiado
        </button>
        <button
          type="button"
          className={state.journey?.id === "free-exploration" ? "active" : ""}
          onClick={() =>
            dispatch({ type: "journeyStart", journeyId: "free-exploration" })
          }
        >
          Exploração livre
        </button>
      </div>

      <footer className="experience-footer">
        <span>Selecione um nó para explorar</span>
        <span className="footer-line" />
        <span>A rede completa permanece sempre presente</span>
      </footer>

      {focusedNode ? (
        <ContentPanel
          node={focusedNode}
          markdown={contentByNodeId[focusedNode.id] ?? ""}
          onClose={() => dispatch("blur")}
          onComplete={() =>
            dispatch({ type: "complete", nodeId: focusedNode.id })
          }
        />
      ) : null}
    </main>
  );
}
