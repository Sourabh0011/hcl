"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  GitFork,
  Bot,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
  BookOpen,
  Cpu,
  Flame,
  Globe,
  Compass,
} from "lucide-react";
import { CATALOG_ROADMAPS } from "@/lib/mock-catalog";
import { useAppStore } from "@/lib/store";

export default function HomePage() {
  const { setCurrentRoadmap } = useAppStore();

  return (
    <div className="flex-1 flex flex-col bg-[#030712] overflow-hidden">
      {/* Background ambient glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 max-w-6xl mx-auto text-center z-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-md shadow-lg shadow-indigo-950/50">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by Google Gemini & React Flow DAGs</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Architect Your Dream Tech Career with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI-Engineered Roadmaps
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Say goodbye to generic tutorials. Our multi-stage AI profiler evaluates your
          existing baseline, calibrates diagnostic skills, and dynamically generates
          structured Directed Acyclic Graph (DAG) learning roadmaps with transparent explainability.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/onboarding"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Conversational Intake</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white text-sm font-semibold transition-all hover:border-slate-700 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Open Interactive Dashboard</span>
          </Link>
        </div>

        {/* Live Interactive Teaser Card */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 p-6 shadow-2xl relative overflow-hidden text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                active-roadmap.dag // AI Systems & LLM Engineer
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>Real-Time Dynamic Adaptation Engine</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Step 1 Node */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/50 relative">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                  Beginner
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </span>
              </div>
              <h3 className="font-semibold text-sm text-white mb-1">
                Modern Python & Async Architecture
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                Pydantic v2, non-blocking asyncio streaming for high-throughput AI microservices.
              </p>
            </div>

            {/* Step 2 Active Node */}
            <div className="p-4 rounded-xl bg-slate-950/90 border-2 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.35)] relative">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">
                  Intermediate
                </span>
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  Active
                </span>
              </div>
              <h3 className="font-semibold text-sm text-white mb-1">
                Vector DBs & Dense Embeddings
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                HNSW indexing, distance metrics, hybrid search with Qdrant and Pinecone.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-indigo-300">
                <span>AI Tutor Attached</span>
                <span>18 Hours</span>
              </div>
            </div>

            {/* Step 3 Locked Node */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 opacity-60">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">
                  Advanced
                </span>
                <span className="text-slate-500 font-mono">🔒 Locked</span>
              </div>
              <h3 className="font-semibold text-sm text-slate-300 mb-1">
                Autonomous Agentic Workflows
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                LangGraph cyclical state graphs, deterministic tool calling, human-in-the-loop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Why Static Learning Roadmaps Fail (And How We Fix It)
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Traditional roadmaps are one-size-fits-all checklists. Antigravity treats learning as an adaptive graph problem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Conversational Intake</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI interviews you on career ambitions, background skills, weekly hours, and runs a 3-question diagnostic skill calibration.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Strict DAG Topologies</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every course, project, and assessment is mathematically mapped in a Directed Acyclic Graph with explicit prerequisites.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Dynamic Adaptation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stuck on a node? Click &quot;Too Difficult&quot; to dynamically synthesize a bridging stepping-stone module with rewires.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all group">
            <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">On-Demand AI Tutor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant ELI5 conceptual analogies, executable production code snippets, and debugging challenges for every single node.
            </p>
          </div>
        </div>
      </section>

      {/* Preset Tracks Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Curated High-Impact Career Tracks
            </h2>
            <p className="text-xs text-slate-400">
              Jump straight into industry-calibrated blueprints.
            </p>
          </div>

          <Link
            href="/catalog"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Tracks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATALOG_ROADMAPS.map((track) => (
            <div
              key={track.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                    {track.targetGoal}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {track.nodes.length} Modules • {track.estimatedTotalHours} Hours
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{track.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {track.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex -space-x-2">
                  {track.nodes.slice(0, 4).map((n, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-300"
                      title={n.title}
                    >
                      {idx + 1}
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setCurrentRoadmap(track)}
                  className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-slate-900 bg-slate-950/60 text-center text-xs text-slate-500">
        <p>
          Antigravity Path Recommender • Built with Next.js 15, React 19, Google Gemini AI &amp; React Flow DAGs.
        </p>
      </footer>
    </div>
  );
}
