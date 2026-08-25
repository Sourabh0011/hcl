import dagre from "@dagrejs/dagre";
import { Node, Edge } from "@xyflow/react";
import { RoadmapNodeData, RoadmapEdgeData, NodeStatus } from "@/types";

const NODE_WIDTH = 280;
const NODE_HEIGHT = 160;

/**
 * Calculates topological Directed Acyclic Graph (DAG) layout using Dagre
 */
export function getLayoutedElements(
  nodes: RoadmapNodeData[],
  edges: RoadmapEdgeData[],
  direction: "LR" | "TB" = "TB",
  completedNodeIds: string[] = []
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 80 : 70,
    ranksep: isHorizontal ? 120 : 90,
    marginx: 50,
    marginy: 50,
  });

  // Calculate status for each node based on prerequisites and completedNodeIds
  const nodeStatusMap = new Map<string, NodeStatus>();
  const completedSet = new Set(completedNodeIds);

  nodes.forEach((node) => {
    if (completedSet.has(node.id)) {
      nodeStatusMap.set(node.id, "completed");
    } else {
      // Check if all prerequisites are completed
      const allPrereqsCompleted =
        !node.prerequisites ||
        node.prerequisites.length === 0 ||
        node.prerequisites.every((prereqId) => completedSet.has(prereqId));

      if (allPrereqsCompleted) {
        nodeStatusMap.set(node.id, "active");
      } else {
        nodeStatusMap.set(node.id, "locked");
      }
    }
  });

  // Add nodes to Dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to Dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Build React Flow Nodes
  const layoutedNodes: Node[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const calculatedStatus = nodeStatusMap.get(node.id) || node.status || "locked";

    return {
      id: node.id,
      type: "roadmapNode",
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      data: {
        ...node,
        status: calculatedStatus,
        label: node.title,
      },
    };
  });

  // Build React Flow Edges
  const layoutedEdges: Edge[] = edges.map((edge) => {
    const sourceStatus = nodeStatusMap.get(edge.source);
    const targetStatus = nodeStatusMap.get(edge.target);
    const isTraversed = sourceStatus === "completed";
    const isActiveNext = isTraversed && targetStatus === "active";

    return {
      id: edge.id || `e-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: isActiveNext,
      style: {
        stroke: isTraversed
          ? "#10b981" // Emerald when source completed
          : isActiveNext
          ? "#6366f1" // Indigo when path is active
          : "#475569", // Slate when locked
        strokeWidth: isTraversed || isActiveNext ? 2.5 : 1.5,
        strokeDasharray: !isTraversed && !isActiveNext ? "4,4" : undefined,
      },
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}
