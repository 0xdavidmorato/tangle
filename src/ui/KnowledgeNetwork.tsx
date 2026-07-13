"use client";

import type {
  PresentationConnection,
  PresentationNode,
} from "../presentation";

interface Point {
  readonly x: number;
  readonly y: number;
}

interface PositionedNode extends PresentationNode, Point {
  readonly colorIndex: number;
}

interface KnowledgeNetworkProps {
  readonly nodes: readonly PresentationNode[];
  readonly connections: readonly PresentationConnection[];
  readonly onFocus: (nodeId: string) => void;
}

const palette = ["cyan", "gold", "orange", "violet", "green", "coral"];

function positionNodes(nodes: readonly PresentationNode[]): PositionedNode[] {
  const clusterIds = [...new Set(nodes.map((node) => node.clusterId))];

  return nodes.map((node) => {
    const clusterIndex = clusterIds.indexOf(node.clusterId);
    const clusterNodes = nodes.filter(
      (candidate) => candidate.clusterId === node.clusterId,
    );
    const nodeIndex = clusterNodes.findIndex(
      (candidate) => candidate.id === node.id,
    );
    const clusterAngle =
      -Math.PI / 2 + (clusterIndex / clusterIds.length) * Math.PI * 2;
    const clusterRadius = clusterIndex === clusterIds.length - 1 ? 190 : 275;
    const clusterX = 500 + Math.cos(clusterAngle) * clusterRadius;
    const clusterY = 365 + Math.sin(clusterAngle) * clusterRadius * 0.72;

    if (nodeIndex === 0) {
      return {
        ...node,
        x: clusterX,
        y: clusterY,
        colorIndex: clusterIndex % palette.length,
      };
    }

    const satelliteAngle =
      clusterAngle +
      Math.PI +
      ((nodeIndex - 1) / Math.max(1, clusterNodes.length - 1) - 0.5) * 1.25;
    const satelliteRadius = 82 + (nodeIndex % 2) * 20;

    return {
      ...node,
      x: clusterX + Math.cos(satelliteAngle) * satelliteRadius,
      y: clusterY + Math.sin(satelliteAngle) * satelliteRadius,
      colorIndex: clusterIndex % palette.length,
    };
  });
}

export function KnowledgeNetwork({
  nodes,
  connections,
  onFocus,
}: KnowledgeNetworkProps) {
  const positionedNodes = positionNodes(nodes);
  const positions = new Map(
    positionedNodes.map((node) => [node.id, { x: node.x, y: node.y }]),
  );

  return (
    <div className="network-shell">
      <svg
        className="knowledge-network"
        viewBox="0 0 1000 730"
        role="img"
        aria-labelledby="network-title network-description"
      >
        <title id="network-title">Rede de conhecimento TANGLE</title>
        <desc id="network-description">
          Explore os conceitos e as influências entre os pilares da organização.
        </desc>
        <defs>
          <radialGradient id="core-gradient">
            <stop offset="0%" stopColor="#2eefff" stopOpacity="0.75" />
            <stop offset="68%" stopColor="#0b7891" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#04151e" stopOpacity="0" />
          </radialGradient>
          <filter id="core-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="ambient-particles" aria-hidden="true">
          {Array.from({ length: 38 }, (_, index) => (
            <circle
              key={index}
              cx={(index * 83 + 47) % 980}
              cy={(index * 137 + 31) % 710}
              r={(index % 3) * 0.45 + 0.55}
              style={{ animationDelay: `${(index % 9) * -0.7}s` }}
            />
          ))}
        </g>

        <g className="cluster-structure" aria-hidden="true">
          {positionedNodes
            .filter(
              (node, index, all) =>
                all.findIndex(
                  (candidate) => candidate.clusterId === node.clusterId,
                ) !== index,
            )
            .map((node) => {
              const root = positionedNodes.find(
                (candidate) =>
                  candidate.clusterId === node.clusterId &&
                  candidate !== node &&
                  nodes.findIndex((item) => item.id === candidate.id) ===
                    nodes.findIndex(
                      (item) => item.clusterId === node.clusterId,
                    ),
              );
              return root ? (
                <line
                  key={`cluster-${node.id}`}
                  x1={root.x}
                  y1={root.y}
                  x2={node.x}
                  y2={node.y}
                  className={`cluster-link tone-${palette[node.colorIndex]}`}
                />
              ) : null;
            })}
        </g>

        <g className="domain-connections">
          {connections.map((connection) => {
            const source = positions.get(connection.sourceNodeId);
            const target = positions.get(connection.targetNodeId);
            if (!source || !target) return null;

            return (
              <line
                key={connection.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`domain-link is-${connection.emphasis}`}
                style={{
                  strokeWidth: 1.5 + connection.intensity * 2.4,
                  opacity:
                    connection.emphasis === "primary"
                      ? 1
                      : 0.2 + connection.priority * 0.25,
                }}
              />
            );
          })}
        </g>

        <g className="tangle-core" aria-hidden="true">
          <circle cx="500" cy="365" r="92" fill="url(#core-gradient)" />
          <circle
            cx="500"
            cy="365"
            r="48"
            className="core-orb"
            filter="url(#core-glow)"
          />
          <text x="500" y="362" textAnchor="middle" className="core-title">
            TANGLE
          </text>
          <text x="500" y="384" textAnchor="middle" className="core-subtitle">
            tudo está ligado
          </text>
        </g>

        <g className="knowledge-nodes">
          {positionedNodes.map((node) => {
            const isPrimary = node.emphasis === "primary";
            const radius = isPrimary ? 28 : node.name === "Definição" ? 19 : 16;
            return (
              <g
                key={node.id}
                className={`network-node is-${node.emphasis} ${node.isJourneyCurrent ? "is-journey-current" : ""} ${node.functionalState === "completed" ? "is-completed" : ""} tone-${palette[node.colorIndex]}`}
                transform={`translate(${node.x} ${node.y})`}
                role="button"
                tabIndex={node.functionalState === "locked" ? -1 : 0}
                aria-label={`Explorar ${node.name}`}
                aria-disabled={node.functionalState === "locked"}
                onClick={() => onFocus(node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onFocus(node.id);
                  }
                }}
              >
                <circle r={radius + 11} className="node-aura" />
                {node.isJourneyCurrent ? (
                  <circle r={radius + 17} className="journey-ring" />
                ) : null}
                <circle r={radius} className="node-orb" />
                <circle r={Math.max(3, radius * 0.2)} className="node-seed" />
                <text
                  y={radius + 24}
                  textAnchor="middle"
                  className="node-label"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
