"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowDownUp,
  ArrowLeftRight,
} from "lucide-react";
import RoadmapNode from "./RoadmapNode";
import { useAppStore } from "@/lib/store";
import { getLayoutedElements } from "@/lib/dagre-layout";
import { RoadmapNodeData } from "@/types";

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

function FlowCanvas() {
  const {
    currentRoadmap,
    completedNodeIds,
    openNodeDrawer,
    layoutDirection,
    setLayoutDirection,
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
  } = useAppStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // Filter nodes based on search and difficulty
  const filteredNodes = useMemo(() => {
    if (!currentRoadmap) return [];
    return currentRoadmap.nodes.filter((node) => {
      const matchesSearch =
        searchTerm === "" ||
        node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.skillsGained.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDiff =
        difficultyFilter === "ALL" ||
        node.difficulty.toUpperCase() === difficultyFilter.toUpperCase();

      return matchesSearch && matchesDiff;
    });
  }, [currentRoadmap, searchTerm, difficultyFilter]);

  // Recalculate layout whenever roadmap or filters change
  const applyLayout = useCallback(
    (direction: "TB" | "LR") => {
      if (!currentRoadmap || filteredNodes.length === 0) {
        setNodes([]);
        setEdges([]);
        return;
      }

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        filteredNodes,
        currentRoadmap.edges,
        direction,
        completedNodeIds
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 50);
    },
    [currentRoadmap, filteredNodes, completedNodeIds, setNodes, setEdges, fitView]
  );

  useEffect(() => {
    applyLayout(layoutDirection);
  }, [applyLayout, layoutDirection]);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const nodeData = node.data as unknown as RoadmapNodeData;
      openNodeDrawer(nodeData);
    },
    [openNodeDrawer]
  );

  return (
    <div className="relative w-full h-full bg-[#030712] overflow-hidden flex flex-col">
      {/* Top Filter & Toolbar Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search & Filter bar (left) */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concepts, skills, tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52 md:w-64 transition-all"
            />
          </div>

          {/* Difficulty Dropdown / Filter */}
          <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-800/60">
            {["ALL", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                  difficultyFilter === level
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Graph Controls (right) */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          {/* Orientation Toggle */}
          <button
            onClick={() => setLayoutDirection(layoutDirection === "TB" ? "LR" : "TB")}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            title="Toggle Flow Direction (Vertical / Horizontal)"
          >
            {layoutDirection === "TB" ? (
              <>
                <ArrowDownUp className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Vertical</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Horizontal</span>
              </>
            )}
          </button>

          {/* Reset View */}
          <button
            onClick={() => fitView({ padding: 0.2, duration: 500 })}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            title="Fit graph to view"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Fit View</span>
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.8}
          defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={24} size={1} />
          <Controls position="bottom-right" className="m-4" />
          <MiniMap
            position="bottom-left"
            className="m-4 hidden md:block"
            nodeColor={(node) => {
              const status = (node.data as any)?.status;
              if (status === "completed") return "#10b981";
              if (status === "active") return "#6366f1";
              return "#334155";
            }}
            maskColor="rgba(3, 7, 18, 0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function RoadmapCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
