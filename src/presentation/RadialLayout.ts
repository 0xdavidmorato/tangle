import type {
  PresentationCluster,
  PresentationNode,
} from "./PresentationState";

export interface LayoutPoint {
  readonly x: number;
  readonly y: number;
}

export interface RadialNode extends PresentationNode, LayoutPoint {
  readonly clusterIndex: number;
  readonly nodeIndex: number;
  readonly colorIndex: number;
}

export interface RadialCluster extends LayoutPoint {
  readonly id: string;
  readonly name: string;
  readonly colorIndex: number;
}

export const networkCenter: LayoutPoint = { x: 520, y: 330 };

interface ClusterVisual {
  readonly x: number;
  readonly y: number;
  readonly colorIndex: number;
}

const clusterVisuals: Readonly<Record<string, ClusterVisual>> = {
  "boa-empresa": { x: 260, y: 225, colorIndex: 0 },
  "bom-negocio": { x: 780, y: 225, colorIndex: 1 },
  "bom-funcionario": { x: 780, y: 435, colorIndex: 2 },
  "bom-ordenado": { x: 520, y: 540, colorIndex: 3 },
  "boas-praticas": { x: 260, y: 435, colorIndex: 4 },
  "boas-pessoas": { x: 520, y: 120, colorIndex: 5 },
  "interligacoes": { x: 520, y: 495, colorIndex: 6 },
};

const fallbackClusterVisual: ClusterVisual = {
  x: networkCenter.x,
  y: networkCenter.y,
  colorIndex: 6,
};

export function getClusterVisual(clusterId: string): ClusterVisual {
  return clusterVisuals[clusterId] ?? fallbackClusterVisual;
}

function canonical(value: number): number {
  return Number(value.toFixed(4));
}

export function createRadialLayout(
  nodes: readonly PresentationNode[],
  clusters: readonly PresentationCluster[],
): RadialNode[] {
  const clusterLayout = createRadialClusterLayout(clusters);

  return nodes.map((node) => {
    const clusterIndex = clusters.findIndex(
      (cluster) => cluster.id === node.clusterId,
    );
    const cluster = clusters[clusterIndex];
    const nodeIndex = cluster?.nodeIds.indexOf(node.id) ?? -1;
    const hub = clusterLayout[clusterIndex] ?? networkCenter;
    const clusterAngle = Math.atan2(
      hub.y - networkCenter.y,
      hub.x - networkCenter.x,
    );
    const base = {
      ...node,
      clusterIndex,
      nodeIndex,
      colorIndex: getClusterVisual(node.clusterId).colorIndex,
    };

    const satelliteCount = Math.max(1, cluster?.nodeIds.length ?? 1);
    const fanPosition =
      satelliteCount === 1
        ? 0
        : nodeIndex / (satelliteCount - 1) - 0.5;
    const fanSpread =
      satelliteCount >= 5 ? 2 : satelliteCount === 4 ? 1.8 : 1.6;
    const satelliteAngle = clusterAngle + fanPosition * fanSpread;
    const standardSatelliteRadius =
      128 + Math.max(0, satelliteCount - 2) * 10 + (nodeIndex % 2) * 11;
    const satelliteRadius =
      cluster?.id === "bom-funcionario"
        ? 88 + (nodeIndex % 2) * 8
        : cluster?.id === "interligacoes"
          ? 72
          : standardSatelliteRadius;

    return {
      ...base,
      x: canonical(
        Math.min(
          960,
          Math.max(40, hub.x + Math.cos(satelliteAngle) * satelliteRadius),
        ),
      ),
      y: canonical(
        Math.min(
          650,
          Math.max(40, hub.y + Math.sin(satelliteAngle) * satelliteRadius),
        ),
      ),
    };
  });
}

export function createRadialClusterLayout(
  clusters: readonly PresentationCluster[],
): RadialCluster[] {
  return clusters.map((cluster) => {
    const placement = getClusterVisual(cluster.id);

    return {
      id: cluster.id,
      name: cluster.name,
      colorIndex: placement.colorIndex,
      x: canonical(placement.x),
      y: canonical(placement.y),
    };
  });
}

export function createCurvedPath(
  source: LayoutPoint,
  target: LayoutPoint,
  bend = 0.12,
): string {
  const midpointX = (source.x + target.x) / 2;
  const midpointY = (source.y + target.y) / 2;
  const normalX = -(target.y - source.y) * bend;
  const normalY = (target.x - source.x) * bend;
  return `M ${canonical(source.x)} ${canonical(source.y)} Q ${canonical(midpointX + normalX)} ${canonical(midpointY + normalY)} ${canonical(target.x)} ${canonical(target.y)}`;
}
