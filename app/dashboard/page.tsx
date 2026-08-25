"use client";

import React, { useEffect, useState } from "react";
import MetricsBar from "@/components/dashboard/MetricsBar";
import RoadmapCanvas from "@/components/canvas/RoadmapCanvas";
import { useAppStore } from "@/lib/store";
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Bot,
  HelpCircle,
  FileJson,
  Check,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentRoadmap,
    resetProgress,
    openTutorDrawer,
    setAdaptModalOpen,
  } = useAppStore();

  const [copiedLink, setCopiedLink] = useState(false);

  const handleExportJSON = () => {
    if (!currentRoadmap) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(currentRoadmap, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${currentRoadmap.title.toLowerCase().replace(/\s+/g, "-")}-roadmap.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#030712]">
      {/* Top Metrics Bar */}
      <MetricsBar />

      {/* Main Graph Area */}
      <div className="flex-1 relative w-full h-full">
        <RoadmapCanvas />

        {/* Floating Quick Action Bar (Bottom Center) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl">
          {/* AI Tutor shortcut */}
          <button
            onClick={() => openTutorDrawer(currentRoadmap?.nodes[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-all"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Tutor</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors"
            title="Export full roadmap as JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export DAG</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Reset progress */}
          <button
            onClick={resetProgress}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 text-xs transition-colors"
            title="Reset marked completed nodes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
