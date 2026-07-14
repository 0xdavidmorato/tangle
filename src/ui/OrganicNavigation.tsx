"use client";

interface OrganicNavigationProps {
  readonly level: 0 | 1 | 2;
  readonly onCoreSelect: () => void;
  readonly onClusterSelect: () => void;
  readonly onInterconnections: () => void;
}

const stages = [
  { number: "1", title: "Visão Geral", level: 0 as const },
  { number: "2", title: "Foco no Conceito", level: 1 as const },
  { number: "3", title: "Explorar Relações", level: 2 as const },
  { number: "4", title: "Aprofundar", level: 2 as const },
];

export function OrganicNavigation({
  level,
  onCoreSelect,
  onClusterSelect,
  onInterconnections,
}: OrganicNavigationProps) {
  return (
    <>
    <section className="organic-navigation" aria-label="Navegação orgânica">
      <div className="organic-heading">Navegação orgânica</div>
      <div className="organic-stages">
        {stages.map((stage, index) => (
          <div className="organic-stage-wrap" key={stage.number}>
            <button
              type="button"
              className={`organic-stage ${level === stage.level ? "is-active" : ""}`}
              onClick={stage.level === 0 ? onCoreSelect : onClusterSelect}
            >
              <span className={`stage-network stage-network-${index + 1}`} aria-hidden="true">
                <i /><i /><i /><i /><i />
              </span>
              <span>{stage.number}. {stage.title}</span>
            </button>
            {index < stages.length - 1 ? <span className="organic-arrow" aria-hidden="true">→</span> : null}
          </div>
        ))}
      </div>
      <p>A rede revela-se por camadas: do todo aos conceitos e às relações.</p>
    </section>
    <button
      type="button"
      className="interconnections-card"
      onClick={onInterconnections}
    >
      <span className="interconnections-card-icon" aria-hidden="true">↔</span>
      <span className="interconnections-card-copy">
        <strong>Interligações</strong>
        <small>Veja como os cinco pilares se influenciam.</small>
      </span>
      <span aria-hidden="true">→</span>
    </button>
    </>
  );
}
