"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  BookOpen,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import { RoadmapNodeData, NodeStatus } from "@/types";
import { cn, getDifficultyColor, formatHours } from "@/lib/utils";

const RoadmapNode = ({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as RoadmapNodeData;
  const status: NodeStatus = nodeData.status || "locked";
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isLocked = status === "locked";

  const diffColors = getDifficultyColor(nodeData.difficulty);

  const getTypeIcon = () => {
    switch (nodeData.type) {
      case "project":
        return <Terminal className="w-3.5 h-3.5 text-amber-400" />;
      case "assessment":
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div
      className={cn(
        "group relative w-[280px] rounded-xl p-4 transition-all duration-300 select-none cursor-pointer",
        "bg-slate-900/90 backdrop-blur-md",
        isLocked && "border border-slate-800/80 opacity-60 hover:opacity-80",
        isActive &&
          "border-2 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.35)] ring-2 ring-indigo-500/20",
        isCompleted &&
          "border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-slate-900/95",
        selected && "ring-2 ring-cyan-400 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]",
        nodeData.isCustomBridge && "border-amber-500/80 bg-slate-900/95"
      )}
    >
      {/* Target handle (incoming from prereqs) */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "!w-3 !h-3 !border-2 !border-slate-950 transition-colors",
          isCompleted ? "!bg-emerald-500" : isActive ? "!bg-indigo-500" : "!bg-slate-700"
        )}
      />

      {/* Custom Bridge Banner if stepping stone */}
      {nodeData.isCustomBridge && (
        <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-slate-950 flex items-center gap-1 shadow-md">
          <Sparkles className="w-2.5 h-2.5" /> Stepping Stone
        </div>
      )}

      {/* Header with Type, Difficulty and Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-slate-800/80 border border-slate-700/50">
            {getTypeIcon()}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {nodeData.type}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              diffColors.badge
            )}
          >
            {nodeData.difficulty}
          </span>

          {isCompleted && (
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              {nodeData.score ? `${nodeData.score}%` : "Done"}
            </div>
          )}

          {isActive && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}

          {isLocked && <Lock className="w-3 h-3 text-slate-500" />}
        </div>
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold text-sm leading-snug line-clamp-2 mb-1.5",
          isCompleted ? "text-slate-200 line-through decoration-emerald-500/50" : "text-white"
        )}
      >
        {nodeData.title}
      </h3>

      {/* Brief Description */}
      {nodeData.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {nodeData.description}
        </p>
      )}

      {/* Skills Badges */}
      {nodeData.skillsGained && nodeData.skillsGained.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {nodeData.skillsGained.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-750 font-mono"
            >
              {skill}
            </span>
          ))}
          {nodeData.skillsGained.length > 3 && (
            <span className="text-[9px] px-1 py-0.5 text-slate-400">
              +{nodeData.skillsGained.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Duration & Recommendation Reason hint */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{formatHours(nodeData.estimatedHours)}</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Inspect</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Source handle (outgoing to downstream nodes) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "!w-3 !h-3 !border-2 !border-slate-950 transition-colors",
          isCompleted ? "!bg-emerald-500" : "!bg-slate-700"
        )}
      />
    </div>
  );
};

export default memo(RoadmapNode);
