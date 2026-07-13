"use client";

import type {
  PresentationCluster,
  PresentationConnection,
  PresentationNode,
} from "../presentation";
import {
  createCurvedPath,
  createRadialLayout,
  networkCenter,
} from "../presentation";
import { NodeIcon } from "./NodeIcon";

interface KnowledgeNetworkProps {
  readonly nodes: readonly PresentationNode[];
  readonly clusters: readonly PresentationCluster[];
  readonly connections: readonly PresentationConnection[];
  readonly onFocus: (nodeId: string) => void;
}

const palette = ["cyan", "gold", "orange", "violet", "green", "coral"];

export function KnowledgeNetwork({
  nodes,
  clusters,
  connections,
  onFocus,
}: KnowledgeNetworkProps) {
  const positionedNodes = createRadialLayout(nodes, clusters);
  const positions = new Map(
    positionedNodes.map((node) => [node.id, { x: node.x, y: node.y }]),
  );
  const clusterRoots = clusters
    .map((cluster) => {
      const root = positionedNodes.find(
        (node) => node.id === cluster.nodeIds[0],
      );
      return root ? { cluster, root } : null;
    })
    .filter((entry) => entry !== null);

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
          {Array.from({ length: 30 }, (_, index) => {
            const source = {
              x: (index * 83 + 47) % 980,
              y: (index * 137 + 31) % 710,
            };
            const target = {
              x: ((index + 7) * 83 + 47) % 980,
              y: ((index + 5) * 137 + 31) % 710,
            };
            return (
              <path
                key={`mesh-${index}`}
                d={createCurvedPath(source, target, index % 2 ? 0.035 : -0.035)}
                className="ambient-filament"
              />
            );
          })}
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
          {clusterRoots.map(({ cluster, root }, clusterIndex) => {
            const tone = palette[clusterIndex % palette.length];
            const corePath = createCurvedPath(networkCenter, root, 0.045);
            const outwardAngle = Math.atan2(
              root.y - networkCenter.y,
              root.x - networkCenter.x,
            );

            return (
              <g key={cluster.id}>
                <circle
                  cx={root.x}
                  cy={root.y}
                  r="52"
                  className={`cluster-halo tone-${tone}`}
                />
                <path
                  d={corePath}
                  className={`core-filament tone-${tone}`}
                />
                <path
                  d={createCurvedPath(networkCenter, root, -0.035)}
                  className={`core-filament is-echo tone-${tone}`}
                />
                <path
                  d={corePath}
                  className={`energy-trail is-core tone-${tone}`}
                  style={{
                    animationDelay: `${clusterIndex * -0.58}s`,
                    animationDuration: `${3.1 + clusterIndex * 0.22}s`,
                  }}
                />

                <g className="cluster-micro-network">
                  {Array.from({ length: 8 }, (_, microIndex) => {
                    const spread = (microIndex / 7 - 0.5) * 1.7;
                    const distance = 48 + (microIndex % 3) * 15;
                    const point = {
                      x: root.x + Math.cos(outwardAngle + spread) * distance,
                      y: root.y + Math.sin(outwardAngle + spread) * distance,
                    };
                    return (
                      <g key={`micro-${cluster.id}-${microIndex}`}>
                        <path
                          d={createCurvedPath(
                            root,
                            point,
                            microIndex % 2 ? 0.07 : -0.07,
                          )}
                          className={`micro-filament tone-${tone}`}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={microIndex % 3 === 0 ? 1.8 : 1.15}
                          className={`micro-node tone-${tone}`}
                        />
                      </g>
                    );
                  })}
                </g>

                {cluster.nodeIds.slice(1).map((nodeId, index) => {
                  const node = positionedNodes.find(
                    (candidate) => candidate.id === nodeId,
                  );
                  const path = node
                    ? createCurvedPath(
                        root,
                        node,
                        index % 2 === 0 ? 0.09 : -0.09,
                      )
                    : "";
                  return node ? (
                    <g key={`cluster-${node.id}`}>
                      <path
                        d={path}
                        className={`cluster-link tone-${palette[node.colorIndex]}`}
                      />
                      <path
                        d={path}
                        className={`energy-trail is-satellite tone-${palette[node.colorIndex]}`}
                        style={{
                          animationDelay: `${index * -0.72}s`,
                          animationDuration: `${2.7 + index * 0.36}s`,
                        }}
                      />
                    </g>
                  ) : null;
                })}
              </g>
            );
          })}
        </g>

        <g className="domain-connections">
          {connections.map((connection) => {
            const source = positions.get(connection.sourceNodeId);
            const target = positions.get(connection.targetNodeId);
            if (!source || !target) return null;

            const path = createCurvedPath(source, target);
            return (
              <g key={connection.id}>
                <path
                  d={path}
                  className={`domain-link is-${connection.emphasis}`}
                  style={{
                    strokeWidth: 1.5 + connection.intensity * 2.4,
                    opacity:
                      connection.emphasis === "primary"
                        ? 1
                        : 0.2 + connection.priority * 0.25,
                  }}
                />
                <path
                  d={path}
                  className={`energy-trail is-domain is-${connection.emphasis}`}
                  style={{
                    animationDuration: `${4.8 - connection.intensity * 1.8}s`,
                  }}
                />
              </g>
            );
          })}
        </g>

        <g className="tangle-core" aria-hidden="true">
          <circle cx="500" cy="365" r="92" fill="url(#core-gradient)" />
          <circle cx="500" cy="365" r="56" className="core-pulse-ring ring-one" />
          <circle cx="500" cy="365" r="68" className="core-pulse-ring ring-two" />
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
            const cluster = clusters.find(
              (candidate) => candidate.id === node.clusterId,
            );
            const isClusterRoot = cluster?.nodeIds[0] === node.id;
            const { clusterIndex, nodeIndex } = node;
            const radius = isClusterRoot
              ? isPrimary
                ? 34
                : 28
              : isPrimary
                ? 23
                : 15;
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
                <circle
                  r={radius + 11}
                  className="node-aura"
                  style={{ animationDelay: `${(clusterIndex + nodeIndex) * -0.38}s` }}
                />
                {node.isJourneyCurrent ? (
                  <circle r={radius + 17} className="journey-ring" />
                ) : null}
                <circle r={radius} className="node-orb" />
                <NodeIcon
                  clusterIndex={clusterIndex}
                  nodeIndex={nodeIndex}
                  size={radius * 0.92}
                />
                {isClusterRoot ? (
                  <text
                    y={-(radius + 20)}
                    textAnchor="middle"
                    className="cluster-label"
                  >
                    {cluster.name}
                  </text>
                ) : null}
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
