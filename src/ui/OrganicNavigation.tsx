"use client";

import type { AssessmentProgressSummary } from "../assessment";

interface OrganicNavigationProps {
  readonly activeStage: OrganicStage;
  readonly activeClusterName: string | null;
  readonly interconnectionsProgress: AssessmentProgressSummary | undefined;
  readonly onOverview: () => void;
  readonly onConcepts: () => void;
  readonly onRelations: () => void;
  readonly onDeepDive: () => void;
}

type OrganicStage = "overview" | "concepts" | "relations" | "deep-dive";

const stages = [
  { id: "overview" as const, number: "01", title: "Visão geral", detail: "Pilares", icon: "orbit" },
  { id: "concepts" as const, number: "02", title: "Um tema", detail: "Conceitos", icon: "focus" },
  { id: "relations" as const, number: "03", title: "Relações", detail: "Influências", icon: "links" },
  { id: "deep-dive" as const, number: "04", title: "Aprofundar", detail: "Leitura", icon: "layers" },
];

const stageDescriptions: Record<OrganicStage, string> = {
  overview: "Veja os pilares e os caminhos que os ligam.",
  concepts: "Escolha um pilar para revelar os seus conceitos.",
  relations: "Descubra como os pilares se influenciam mutuamente.",
  "deep-dive": "Abra um conceito para ler, refletir e continuar a explorar.",
};

function StageIcon({ name }: { readonly name: string }) {
  if (name === "orbit") {
    return <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="4" /><ellipse cx="16" cy="16" rx="12" ry="5.5" /><circle cx="26" cy="16" r="1.8" /></svg>;
  }
  if (name === "focus") {
    return <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="5" /><path d="M16 4v4M16 24v4M4 16h4M24 16h4" /><circle cx="16" cy="16" r="10" strokeDasharray="2 3" /></svg>;
  }
  if (name === "links") {
    return <svg viewBox="0 0 32 32" fill="none"><circle cx="8" cy="10" r="3" /><circle cx="24" cy="9" r="3" /><circle cx="16" cy="23" r="3" /><path d="m10.5 11.3 4 8.2m3-8.7-4 8.2m-2.6-8.6 10.1-1" /></svg>;
  }
  return <svg viewBox="0 0 32 32" fill="none"><path d="m16 4 10 5.7-10 5.7L6 9.7 16 4Z" /><path d="m6 15 10 5.7L26 15M6 20.3 16 26l10-5.7" /></svg>;
}

export function OrganicNavigation({
  activeStage,
  activeClusterName,
  interconnectionsProgress,
  onOverview,
  onConcepts,
  onRelations,
  onDeepDive,
}: OrganicNavigationProps) {
  const actions: Record<OrganicStage, () => void> = {
    overview: onOverview,
    concepts: onConcepts,
    relations: onRelations,
    "deep-dive": onDeepDive,
  };

  return (
    <>
    <section className="organic-navigation" aria-label="Navegação orgânica">
      <div className="organic-heading">
        <span className="organic-heading-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>Navegação orgânica</span>
        <span className="organic-heading-status">4 etapas</span>
      </div>
      <div className="organic-stages">
        {stages.map((stage, index) => (
          <div className="organic-stage-wrap" key={stage.number}>
            <button
              type="button"
              className={`organic-stage ${activeStage === stage.id ? "is-active" : ""}`}
              aria-pressed={activeStage === stage.id}
              onClick={actions[stage.id]}
            >
              <span className="organic-stage-topline">
                <span className="organic-stage-number">{stage.number}</span>
                <span className="organic-stage-icon" aria-hidden="true"><StageIcon name={stage.icon} /></span>
              </span>
              <span className="organic-stage-copy">
                <strong>{stage.title}</strong>
                <small>{stage.detail}</small>
              </span>
            </button>
            {index < stages.length - 1 ? <span className="organic-arrow" aria-hidden="true"><i /></span> : null}
          </div>
        ))}
      </div>
      <p><span aria-hidden="true">✦</span> {stageDescriptions[activeStage]}{activeStage === "concepts" && activeClusterName ? ` Agora: ${activeClusterName}.` : ""}</p>
    </section>
    <button
      type="button"
      className="interconnections-card"
      aria-label={`Explorar Interligações: ${interconnectionsProgress?.passedCount ?? 0} de ${interconnectionsProgress?.totalCount ?? 0} quizzes aprovados`}
      onClick={onRelations}
    >
      <span className="interconnections-card-icon" aria-hidden="true">↔</span>
      <span className="interconnections-card-copy">
        <strong>Interligações</strong>
        <small>{`${interconnectionsProgress?.passedCount ?? 0}/${interconnectionsProgress?.totalCount ?? 0} aprovados · veja como os seis pilares se influenciam.`}</small>
      </span>
      <span aria-hidden="true">→</span>
    </button>
    </>
  );
}
