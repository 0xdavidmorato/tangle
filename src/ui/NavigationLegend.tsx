"use client";

import type { AssessmentProgressSummary } from "../assessment";
import { getClusterVisual, type PresentationCluster } from "../presentation";
import { NodeIcon } from "./NodeIcon";

interface NavigationLegendProps {
  readonly clusters: readonly PresentationCluster[];
  readonly activeClusterId: string | null;
  readonly level: 0 | 1 | 2;
  readonly assessmentByClusterId: Readonly<Record<string, AssessmentProgressSummary>>;
  readonly onCoreSelect: () => void;
  readonly onClusterSelect: (clusterId: string) => void;
}

const tones = ["cyan", "gold", "orange", "violet", "green", "rose", "coral"];

export function NavigationLegend({
  clusters,
  activeClusterId,
  level,
  assessmentByClusterId,
  onCoreSelect,
  onClusterSelect,
}: NavigationLegendProps) {
  return (
    <aside className="navigation-legend" aria-label="Navegação pela rede">
      <button
        type="button"
        className={`legend-navigation-item tone-cyan ${level === 0 ? "is-active" : ""}`}
        onClick={onCoreSelect}
      >
        <span className="legend-navigation-icon core-legend-icon" aria-hidden="true" />
        <span>Tangle (Central)</span>
      </button>
      {clusters.map((cluster) => {
        const clusterVisual = getClusterVisual(cluster.id);
        const progress = assessmentByClusterId[cluster.id];
        return (
        <button
          key={cluster.id}
          type="button"
          className={`legend-navigation-item tone-${tones[clusterVisual.colorIndex]} ${activeClusterId === cluster.id ? "is-active" : ""}`}
          onClick={() => onClusterSelect(cluster.id)}
        >
          <span className="legend-navigation-icon" aria-hidden="true">
            <svg viewBox="-14 -14 28 28">
              <NodeIcon clusterIndex={clusterVisual.colorIndex} nodeIndex={0} size={17} />
            </svg>
          </span>
          <span className="legend-navigation-copy">
            <span>{cluster.name}</span>
            <small>{`${progress?.passedCount ?? 0}/${progress?.totalCount ?? 0} aprovados`}</small>
          </span>
        </button>
        );
      })}
      <p className="legend-hint">
        <span aria-hidden="true">◉</span>
        Clique num nó<br />para explorar
      </p>
    </aside>
  );
}
