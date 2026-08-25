"use client";

import React, { useState } from "react";
import { X, Target, Sparkles, Loader2, Clock, BookOpen, Compass } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function AdaptGoalModal() {
  const {
    isAdaptModalOpen,
    setAdaptModalOpen,
    currentRoadmap,
    updateRoadmapData,
    geminiApiKey,
  } = useAppStore();

  const [newGoal, setNewGoal] = useState(currentRoadmap?.targetGoal || "AI Systems Engineer");
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [learningStyle, setLearningStyle] = useState("Balanced");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdaptModalOpen || !currentRoadmap) return null;

  const popularGoals = [
    "AI Systems & LLM Engineer",
    "Full-Stack Next.js Developer",
    "Cloud Solutions & DevOps Architect",
    "Data Science & ML Specialist",
    "Cybersecurity & DevSecOps",
    "Distributed Systems Engineer",
  ];

  const handleRecalculate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/roadmap/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRoadmap,
          action: "change_goal",
          payload: { newGoal },
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.roadmap) {
        updateRoadmapData(data.roadmap);
        setAdaptModalOpen(false);
      }
    } catch (err) {
      console.error("Adapt goal failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Adapt Learning Trajectory</h3>
              <p className="text-xs text-slate-400">Update career target while preserving completed milestones</p>
            </div>
          </div>

          <button
            onClick={() => setAdaptModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Target Goal Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Target Career Role / Specialization
            </label>
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Quantitative AI Developer"
            />

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularGoals.map((goal, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewGoal(goal)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    newGoal === goal
                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-750"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Commitment Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Weekly Commitment</span>
              <span className="font-mono text-indigo-400 font-bold">{weeklyHours} hours / week</span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              step={2}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Light (4h)</span>
              <span>Balanced (12h)</span>
              <span>Intensive (40h)</span>
            </div>
          </div>

          {/* Learning Style */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Learning Preference</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Theory-First", val: "Theory-first", desc: "Rigorous academic & mental models" },
                { label: "Project-First", val: "Project-first", desc: "Build hands-on prototypes immediately" },
                { label: "Video-Heavy", val: "Video-heavy", desc: "Visual explanations & walkthroughs" },
                { label: "Balanced", val: "Balanced", desc: "Equal mix of theory and code" },
              ].map((style) => (
                <button
                  key={style.val}
                  onClick={() => setLearningStyle(style.val)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    learningStyle === style.val
                      ? "bg-indigo-950/60 border-indigo-500 text-white"
                      : "bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200">{style.label}</div>
                  <div className="text-[10px] text-slate-500">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-3">
          <button
            onClick={() => setAdaptModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRecalculate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recalculating Trajectory...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recalculate Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
