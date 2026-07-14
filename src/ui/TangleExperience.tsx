"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { EngineEvent } from "../engine";
import { TangleEngine } from "../engine";
import type { Graph } from "../graph";
import {
  createPresentationState,
  type PresentationState,
} from "../presentation";
import { ContentPanel } from "./ContentPanel";
import { KnowledgeNetwork } from "./KnowledgeNetwork";
import { NavigationLegend } from "./NavigationLegend";
import { OrganicNavigation } from "./OrganicNavigation";

interface TangleExperienceProps {
  readonly graph: Graph;
  readonly contentByNodeId: Readonly<Record<string, string>>;
}

export function TangleExperience({
  graph,
  contentByNodeId,
}: TangleExperienceProps) {
  const engineRef = useRef<TangleEngine | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  if (!engineRef.current) {
    engineRef.current = new TangleEngine(graph);
  }

  const [state, setState] = useState<PresentationState>(() =>
    createPresentationState(engineRef.current!),
  );
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [networkLevel, setNetworkLevel] = useState<0 | 1 | 2>(0);
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  function dispatch(event: EngineEvent) {
    engineRef.current!.dispatch(event);
    setState(createPresentationState(engineRef.current!));
  }

  const focusedNode = state.nodes.find(
    (node) => node.emphasis === "primary",
  );

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--look-x", `${x * -9}px`);
    event.currentTarget.style.setProperty("--look-y", `${y * -7}px`);
  }

  function revealCore() {
    dispatch("blur");
    setActiveClusterId(null);
    setNetworkLevel(0);
  }

  function revealClusters() {
    dispatch("blur");
    setNetworkLevel(1);
  }

  function revealCluster(clusterId: string) {
    if (clusterId === "interligacoes") {
      exploreInterconnections();
      return;
    }

    dispatch("blur");
    setActiveClusterId(clusterId);
    setNetworkLevel(2);
  }

  function focusNode(nodeId: string) {
    const node = state.nodes.find((candidate) => candidate.id === nodeId);
    if (node) {
      if (node.clusterId === "interligacoes") {
        setActiveClusterId(null);
        setNetworkLevel(1);
      } else {
        setActiveClusterId(node.clusterId);
        setNetworkLevel(2);
      }
    }
    dispatch({ type: "focus", nodeId });
  }

  function exploreInterconnections() {
    const interconnections = state.nodes.find(
      (node) => node.clusterId === "interligacoes",
    );
    if (interconnections) focusNode(interconnections.id);
  }

  return (
    <main
      ref={experienceRef}
      className={`experience ${focusedNode ? "has-focus" : ""} ${motionEnabled ? "motion-on" : "motion-off"}`}
      onPointerMove={handlePointerMove}
    >
      <header className="experience-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <strong>TANGLE</strong>
            <small>David Morato</small>
          </div>
        </div>
        <div className="header-tools">
          <button
            type="button"
            className="motion-control"
            aria-pressed={motionEnabled}
            onClick={() => setMotionEnabled((enabled) => !enabled)}
          >
            <span className="motion-control-dot" aria-hidden="true" />
            Movimento {motionEnabled ? "ativo" : "pausado"}
          </button>
          <div className="experience-status" aria-live="polite">
            <span className="status-pulse" />
            <span>{state.stage}</span>
            <span className="status-separator">/</span>
            <span>{state.nodes.length} conceitos</span>
          </div>
        </div>
      </header>

      <NavigationLegend
        clusters={state.clusters}
        activeClusterId={activeClusterId}
        level={networkLevel}
        onCoreSelect={revealCore}
        onClusterSelect={revealCluster}
      />

      <KnowledgeNetwork
        nodes={state.nodes}
        clusters={state.clusters}
        connections={state.connections}
        level={networkLevel}
        activeClusterId={activeClusterId}
        onCoreFocus={revealClusters}
        onClusterFocus={revealCluster}
        onFocus={focusNode}
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

      <div className="experience-guidance" aria-live="polite">
        <span className="guidance-mark" aria-hidden="true" />
        <span>{focusedNode ? "Relações em foco" : "Selecione um nó para explorar"}</span>
        <span className="guidance-detail">{state.nodes.length} conceitos ligados</span>
      </div>

      <OrganicNavigation
        level={networkLevel}
        onCoreSelect={revealCore}
        onClusterSelect={() => {
          const nextCluster = activeClusterId ?? state.clusters[0]?.id;
          if (nextCluster) revealCluster(nextCluster);
        }}
        onInterconnections={exploreInterconnections}
      />

      {focusedNode ? (
        <ContentPanel
  node={focusedNode}
  markdown={contentByNodeId[focusedNode.id] ?? ""}
  onClose={() => dispatch("blur")}
  onComplete={() => {
    dispatch({ type: "complete", nodeId: focusedNode.id });

    const currentIndex = state.nodes.findIndex(
      (node) => node.id === focusedNode.id,
    );

    const nextNode = state.nodes[currentIndex + 1];

    if (nextNode) {
      focusNode(nextNode.id);
    } else {
      dispatch("blur");
    }
  }}
/>
      ) : null}
    </main>
  );
}
