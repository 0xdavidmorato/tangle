"use client";

import type {
  AssessmentProgressSummary,
  NodeAssessmentProgress,
} from "../assessment";
import type {
  PresentationCluster,
  PresentationConnection,
  PresentationNode,
} from "../presentation";
import {
  createCurvedPath,
  createRadialClusterLayout,
  createRadialLayout,
  networkCenter,
} from "../presentation";
import { NodeIcon } from "./NodeIcon";

interface KnowledgeNetworkProps {
  readonly nodes: readonly PresentationNode[];
  readonly clusters: readonly PresentationCluster[];
  readonly connections: readonly PresentationConnection[];
  readonly level: 0 | 1 | 2;
  readonly activeClusterId: string | null;
  readonly assessmentByNodeId: Readonly<Record<string, NodeAssessmentProgress>>;
  readonly assessmentByClusterId: Readonly<Record<string, AssessmentProgressSummary>>;
  readonly onCoreFocus: () => void;
  readonly onClusterFocus: (clusterId: string) => void;
  readonly onFocus: (nodeId: string, trigger: SVGGElement) => void;
}

const palette = ["cyan", "gold", "orange", "violet", "green", "rose", "coral"];

const connectionBends: Readonly<Record<string, number>> = {
  "empresa-pessoas": 0.1,
  "pessoas-negocio": 0.1,
  "funcionario-ordenado": 0.1,
  "praticas-empresa": 0.1,
  "funcionario-negocio": -0.1,
  "praticas-ordenado": -0.1,
};

interface CoreWordProps {
  readonly value: string;
  readonly startDelay: number;
  readonly className: string;
}

function CoreWord({ value, startDelay, className }: CoreWordProps) {
  return (
    <g className={`core-word ${className}`} aria-hidden="true">
      <text className="core-title">
        <textPath href="#core-word-arc" startOffset="50%" textAnchor="middle">
          {Array.from(value).map((letter, index) => (
            <tspan key={`${letter}-${index}`} opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.06;0.82;1"
                dur="15s"
                begin={`${(startDelay + index * 0.085).toFixed(3)}s`}
                repeatCount="indefinite"
              />
              {letter}
            </tspan>
          ))}
        </textPath>
      </text>
    </g>
  );
}

export function KnowledgeNetwork({
  nodes,
  clusters,
  connections,
  level,
  activeClusterId,
  assessmentByNodeId,
  assessmentByClusterId,
  onCoreFocus,
  onClusterFocus,
  onFocus,
}: KnowledgeNetworkProps) {
  const positionedNodes = createRadialLayout(nodes, clusters);
  const positionedClusters = createRadialClusterLayout(clusters);
  const clusterPositions = new Map(
    positionedClusters.map((cluster) => [cluster.id, cluster]),
  );
  const clusterRoots = clusters.map((cluster, index) => ({
    cluster,
    root: positionedClusters[index]!,
  })).filter(({ cluster }) => cluster.id !== "interligacoes");

  return (
    <div className="network-shell">
      <svg
        className="knowledge-network"
        viewBox="-65 -25 1170 700"
        role="group"
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
          <radialGradient id="atmosphere-gradient">
            <stop offset="0%" stopColor="#167b97" stopOpacity="0.22" />
            <stop offset="48%" stopColor="#0d405c" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#020814" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="core-word-tangle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9ffff" />
            <stop offset="52%" stopColor="#58eff7" />
            <stop offset="100%" stopColor="#9effff" />
          </linearGradient>
          <linearGradient id="core-word-emaranhado-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff0a8" />
            <stop offset="55%" stopColor="#ffc75c" />
            <stop offset="100%" stopColor="#ffe2a0" />
          </linearGradient>
          <linearGradient id="core-word-teia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd3ef" />
            <stop offset="52%" stopColor="#ee78cf" />
            <stop offset="100%" stopColor="#d7b5ff" />
          </linearGradient>
          <path id="core-word-arc" d="M 471 339 Q 520 308 569 339" />
        </defs>

        <ellipse
          cx={networkCenter.x}
          cy={networkCenter.y}
          rx="490"
          ry="300"
          fill="url(#atmosphere-gradient)"
          className="network-atmosphere"
          aria-hidden="true"
        />

        <g className="ambient-particles" aria-hidden="true">
          {Array.from({ length: 42 }, (_, index) => {
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
          {Array.from({ length: 64 }, (_, index) => (
            <circle
              key={index}
              cx={(index * 83 + 47) % 980}
              cy={(index * 137 + 31) % 710}
              r={(index % 3) * 0.45 + 0.55}
              style={{ animationDelay: `${(index % 9) * -0.7}s` }}
            />
          ))}
        </g>

        {level > 0 ? <g className="cluster-structure">
          {clusterRoots.map(({ cluster, root }, clusterIndex) => {
            const tone = palette[root.colorIndex];
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
                  r="66"
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
                      x: Number(
                        (
                          root.x +
                          Math.cos(outwardAngle + spread) * distance
                        ).toFixed(4),
                      ),
                      y: Number(
                        (
                          root.y +
                          Math.sin(outwardAngle + spread) * distance
                        ).toFixed(4),
                      ),
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

                {cluster.nodeIds.map((nodeId, index) => {
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
        </g> : null}

        {level > 0 ? <g className="domain-connections">
          {connections.map((connection) => {
            const sourceNode = nodes.find(
              (node) => node.id === connection.sourceNodeId,
            );
            const targetNode = nodes.find(
              (node) => node.id === connection.targetNodeId,
            );
            const source = sourceNode
              ? clusterPositions.get(sourceNode.clusterId)
              : null;
            const target = targetNode
              ? clusterPositions.get(targetNode.clusterId)
              : null;
            if (!source || !target) return null;

            const path = createCurvedPath(
              source,
              target,
              connectionBends[connection.id] ?? -0.12,
            );
            return (
              <g key={connection.id}>
                <path
                  d={path}
                  className={`domain-link is-${connection.emphasis}`}
                  style={{
                    strokeWidth: 1.1 + connection.intensity * 1.45,
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
        </g> : null}

        <g
          className="tangle-core"
          role="button"
          tabIndex={0}
          aria-label="Mostrar os pilares principais"
          onClick={onCoreFocus}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onCoreFocus();
            }
          }}
        >
          <circle cx={networkCenter.x} cy={networkCenter.y} r="110" fill="url(#core-gradient)" />
          <circle cx={networkCenter.x} cy={networkCenter.y} r="66" className="core-pulse-ring ring-one" />
          <circle cx={networkCenter.x} cy={networkCenter.y} r="82" className="core-pulse-ring ring-two" />
          <circle
            cx={networkCenter.x}
            cy={networkCenter.y}
            r="54"
            className="core-orb"
            filter="url(#core-glow)"
          />
          <CoreWord value="TANGLE" startDelay={0} className="core-word-tangle" />
          <CoreWord value="EMARANHADO" startDelay={4.35} className="core-word-emaranhado" />
          <CoreWord value="TEIA" startDelay={9.45} className="core-word-teia" />
        </g>

        {level > 0 ? <g className="cluster-hubs">
          {positionedClusters
            .filter((cluster) => cluster.id !== "interligacoes")
            .map((cluster) => {
            const progress = assessmentByClusterId[cluster.id];
            const inwardX = networkCenter.x - cluster.x;
            const inwardY = networkCenter.y - cluster.y;
            const length = Math.hypot(inwardX, inwardY) || 1;
            const labelX = (inwardX / length) * 52;
            const labelY = (inwardY / length) * 52 + 4;

            return (
              <g
                key={cluster.id}
                className={`cluster-hub tone-${palette[cluster.colorIndex]} ${activeClusterId === cluster.id ? "is-active" : ""}`}
                transform={`translate(${cluster.x} ${cluster.y})`}
                role="button"
                tabIndex={0}
                aria-label={`Mostrar conceitos de ${cluster.name}: ${progress?.passedCount ?? 0} de ${progress?.totalCount ?? 0} quizzes aprovados`}
                onClick={() => onClusterFocus(cluster.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClusterFocus(cluster.id);
                  }
                }}
              >
                <circle r="43" className="cluster-hub-aura" />
                <circle r="29" className="cluster-hub-orb" />
                <NodeIcon
                  clusterIndex={cluster.colorIndex}
                  nodeIndex={0}
                  size={24}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={
                    labelX > 8 ? "start" : labelX < -8 ? "end" : "middle"
                  }
                  className="cluster-label"
                >
                  {cluster.name}
                </text>
                <text
                  x={labelX}
                  y={labelY + 14}
                  textAnchor={
                    labelX > 8 ? "start" : labelX < -8 ? "end" : "middle"
                  }
                  className="cluster-progress"
                  aria-hidden="true"
                >
                  {`${progress?.passedCount ?? 0}/${progress?.totalCount ?? 0} aprovados`}
                </text>
              </g>
            );
            })}
        </g> : null}

        {level > 1 ? <g className="knowledge-nodes">
          {positionedNodes
            .filter((node) => node.clusterId !== "interligacoes")
            .map((node) => {
            const assessment = assessmentByNodeId[node.id];
            const learningState = assessment?.isPassed
              ? "passed"
              : assessment?.isRead
                ? "read"
                : "unread";
            const learningLabel = assessment?.isPassed
              ? "teste aprovado"
              : assessment?.isRead
                ? "conteúdo lido; teste por concluir"
                : "conteúdo por ler";
            const isPrimary = node.emphasis === "primary";
            const cluster = clusters.find(
              (candidate) => candidate.id === node.clusterId,
            );
            const { clusterIndex, nodeIndex } = node;
            const radius = isPrimary ? 23 : 15;
            return (
              <g
                key={node.id}
                className={`network-node is-${node.emphasis} is-learning-${learningState} ${node.clusterId === activeClusterId ? "is-cluster-active" : "is-cluster-context"} ${node.isJourneyCurrent ? "is-journey-current" : ""} ${node.functionalState === "completed" ? "is-completed" : ""} tone-${palette[node.colorIndex]}`}
                transform={`translate(${node.x} ${node.y})`}
                role="button"
                tabIndex={node.functionalState === "locked" ? -1 : 0}
                aria-label={`Explorar ${node.name}: ${learningLabel}`}
                aria-disabled={node.functionalState === "locked"}
                onClick={(event) => onFocus(node.id, event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onFocus(node.id, event.currentTarget);
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
                {learningState === "passed" ? <>
                  <circle cx={radius * 0.74} cy={-radius * 0.74} r="6" className="node-progress-badge is-passed" aria-hidden="true" />
                  <text x={radius * 0.74} y={-radius * 0.74 + 3.1} textAnchor="middle" className="node-progress-check" aria-hidden="true">✓</text>
                </> : learningState === "read" ? (
                  <circle cx={radius * 0.74} cy={-radius * 0.74} r="4" className="node-progress-badge is-read" aria-hidden="true" />
                ) : null}
                <NodeIcon
                  clusterIndex={clusterIndex}
                  nodeIndex={nodeIndex + 1}
                  size={radius * 0.92}
                />
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
        </g> : null}
      </svg>
    </div>
  );
}
