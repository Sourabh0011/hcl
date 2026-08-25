"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Plus,
  Terminal,
  Cpu,
  Cloud,
  Shield,
  Search,
} from "lucide-react";
import { CATALOG_ROADMAPS } from "@/lib/mock-catalog";
import { useAppStore } from "@/lib/store";
import { RoadmapData } from "@/types";

export default function CatalogPage() {
  const router = useRouter();
  const { setCurrentRoadmap } = useAppStore();
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>(CATALOG_ROADMAPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.roadmaps) {
          setRoadmaps(data.roadmaps);
        }
      })
      .catch(console.warn);
  }, []);

  const handleSelectRoadmap = (r: RoadmapData) => {
    setCurrentRoadmap(r);
    router.push("/dashboard");
  };

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.summary && r.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === "ALL" ||
      r.targetGoal.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 bg-[#030712] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono mb-1">
              <Compass className="w-4 h-4" />
              <span>Standardized Curricula</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              AI &amp; Engineering Learning Paths
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Select an industry-calibrated blueprint or build your own custom AI-generated graph.
            </p>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom AI Path</span>
          </Link>
        </div>

        {/* Search & Tag Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex items-center w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tracks, roles, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["ALL", "AI Systems", "Full-Stack", "Cloud", "Data Science"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  selectedTag === tag
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((track) => (
            <div
              key={track.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                    {track.targetGoal}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {track.estimatedTotalHours} hrs
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {track.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                  {track.summary ||
                    "Comprehensive step-by-step modular learning graph with interactive milestones."}
                </p>

                {/* Node Pill Stack */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Curriculum Modules ({track.nodes.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {track.nodes.slice(0, 3).map((n, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {n.title}
                      </span>
                    ))}
                    {track.nodes.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                        +{track.nodes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Learn
                </span>

                <button
                  onClick={() => handleSelectRoadmap(track)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all flex items-center gap-1"
                >
                  <span>Launch Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
