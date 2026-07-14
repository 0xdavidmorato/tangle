"use client";

import type { PresentationCluster } from "../presentation";
import { NodeIcon } from "./NodeIcon";

interface NavigationLegendProps {
  readonly clusters: readonly PresentationCluster[];
  readonly activeClusterId: string | null;
  readonly level: 0 | 1 | 2;
  readonly onCoreSelect: () => void;
  readonly onClusterSelect: (clusterId: string) => void;
}

const tones = ["cyan", "gold", "orange", "violet", "green", "coral"];

export function NavigationLegend({
  clusters,
  activeClusterId,
  level,
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
      {clusters.map((cluster, index) => (
        <button
          key={cluster.id}
          type="button"
          className={`legend-navigation-item tone-${tones[index % tones.length]} ${activeClusterId === cluster.id ? "is-active" : ""}`}
          onClick={() => onClusterSelect(cluster.id)}
        >
          <span className="legend-navigation-icon" aria-hidden="true">
            <svg viewBox="-14 -14 28 28">
              <NodeIcon clusterIndex={index} nodeIndex={0} size={17} />
            </svg>
          </span>
          <span>{cluster.name}</span>
        </button>
      ))}
      <p className="legend-hint">
        <span aria-hidden="true">◉</span>
        Clique num nó<br />para explorar
      </p>
    </aside>
  );
}
