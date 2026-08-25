"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatHours } from "@/lib/utils";

export default function MetricsBar() {
  const { currentRoadmap, completedNodeIds, userProfile, setAdaptModalOpen } =
    useAppStore();

  if (!currentRoadmap) return null;

  const totalNodes = currentRoadmap.nodes.length;
  const completedNodesCount = currentRoadmap.nodes.filter(
    (n) => n.status === "completed" || completedNodeIds.includes(n.id)
  ).length;

  const completionPercent =
    totalNodes > 0 ? Math.round((completedNodesCount / totalNodes) * 100) : 0;

  const totalHours = currentRoadmap.estimatedTotalHours || 100;
  const hoursCompleted = currentRoadmap.nodes
    .filter((n) => n.status === "completed" || completedNodeIds.includes(n.id))
    .reduce((acc, n) => acc + (n.estimatedHours || 0), 0);
  const hoursRemaining = Math.max(0, totalHours - hoursCompleted);

  const weeklyHours = userProfile?.weeklyHours || 12;
  const weeksRemaining = Math.ceil(hoursRemaining / weeklyHours);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + weeksRemaining * 7);
  const formattedTargetDate = targetDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Target Goal & Fast Adapt Trigger */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                Active Career Trajectory
              </span>
              <button
                onClick={() => setAdaptModalOpen(true)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                Adapt
              </button>
            </div>
            <h1 className="text-base font-bold text-white leading-tight">
              {currentRoadmap.title}
            </h1>
          </div>
        </div>

        {/* Center: Stat Badges Grid */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          {/* Progress % */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative bg-slate-950 font-mono font-bold text-[11px] text-white">
              <div
                className="absolute inset-0 rounded-full border-2 border-indigo-500 transition-all duration-700"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${completionPercent}%, 0 ${completionPercent}%)`,
                }}
              />
              {completionPercent}%
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Mastery</div>
              <div className="font-semibold text-white">
                {completedNodesCount} / {totalNodes} Modules
              </div>
            </div>
          </div>

          {/* Hours Remaining */}
          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-800">
            <div className="p-2 rounded-lg bg-slate-850 text-cyan-400 border border-slate-750">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Hours Invested</div>
              <div className="font-semibold text-white">
                {hoursCompleted}h <span className="text-slate-500 font-normal">/ {totalHours}h</span>
              </div>
            </div>
          </div>

          {/* Target ETA */}
          <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-slate-800">
            <div className="p-2 rounded-lg bg-slate-850 text-emerald-400 border border-slate-750">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Estimated ETA</div>
              <div className="font-semibold text-white">{formattedTargetDate}</div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Study Streak</div>
              <div className="font-semibold text-amber-300">5 Days 🔥</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
