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

export const networkCenter: LayoutPoint = { x: 500, y: 365 };

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
      colorIndex: clusterIndex % 6,
    };

    const satelliteCount = Math.max(1, cluster?.nodeIds.length ?? 1);
    const fanPosition =
      satelliteCount === 1
        ? 0
        : nodeIndex / (satelliteCount - 1) - 0.5;
    const fanSpread =
      satelliteCount >= 5 ? 2 : satelliteCount === 4 ? 1.8 : 1.6;
    const satelliteAngle = clusterAngle + fanPosition * fanSpread;
    const satelliteRadius =
      112 + Math.max(0, satelliteCount - 2) * 8 + (nodeIndex % 2) * 9;

    return {
      ...base,
      x: canonical(
        Math.min(
          955,
          Math.max(45, hub.x + Math.cos(satelliteAngle) * satelliteRadius),
        ),
      ),
      y: canonical(
        Math.min(
          680,
          Math.max(48, hub.y + Math.sin(satelliteAngle) * satelliteRadius),
        ),
      ),
    };
  });
}

export function createRadialClusterLayout(
  clusters: readonly PresentationCluster[],
): RadialCluster[] {
  return clusters.map((cluster, clusterIndex) => {
    const angle =
      -Math.PI / 2 + (clusterIndex / clusters.length) * Math.PI * 2;
    const radius = clusterIndex === clusters.length - 1 ? 190 : 265;

    return {
      id: cluster.id,
      name: cluster.name,
      colorIndex: clusterIndex % 6,
      x: canonical(networkCenter.x + Math.cos(angle) * radius),
      y: canonical(networkCenter.y + Math.sin(angle) * radius * 0.72),
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
