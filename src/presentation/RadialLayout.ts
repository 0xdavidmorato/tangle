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
  readonly isClusterRoot: boolean;
}

export const networkCenter: LayoutPoint = { x: 500, y: 365 };

export function createRadialLayout(
  nodes: readonly PresentationNode[],
  clusters: readonly PresentationCluster[],
): RadialNode[] {
  return nodes.map((node) => {
    const clusterIndex = clusters.findIndex(
      (cluster) => cluster.id === node.clusterId,
    );
    const cluster = clusters[clusterIndex];
    const nodeIndex = cluster?.nodeIds.indexOf(node.id) ?? -1;
    const clusterAngle =
      -Math.PI / 2 + (clusterIndex / clusters.length) * Math.PI * 2;
    const clusterRadius = clusterIndex === clusters.length - 1 ? 190 : 275;
    const clusterX =
      networkCenter.x + Math.cos(clusterAngle) * clusterRadius;
    const clusterY =
      networkCenter.y + Math.sin(clusterAngle) * clusterRadius * 0.72;
    const base = {
      ...node,
      clusterIndex,
      nodeIndex,
      colorIndex: clusterIndex % 6,
      isClusterRoot: nodeIndex === 0,
    };

    if (nodeIndex <= 0) {
      return { ...base, x: clusterX, y: clusterY };
    }

    const satelliteCount = Math.max(1, (cluster?.nodeIds.length ?? 1) - 1);
    const fanPosition =
      satelliteCount === 1
        ? 0
        : (nodeIndex - 1) / (satelliteCount - 1) - 0.5;
    const satelliteAngle = clusterAngle + fanPosition * 1.4;
    const satelliteRadius = 96 + (nodeIndex % 2) * 17;

    return {
      ...base,
      x: Math.min(
        955,
        Math.max(45, clusterX + Math.cos(satelliteAngle) * satelliteRadius),
      ),
      y: Math.min(
        680,
        Math.max(48, clusterY + Math.sin(satelliteAngle) * satelliteRadius),
      ),
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
  return `M ${source.x} ${source.y} Q ${midpointX + normalX} ${midpointY + normalY} ${target.x} ${target.y}`;
}
