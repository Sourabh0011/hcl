"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Layers,
  Sparkles,
  Key,
  ChevronDown,
  Plus,
  BookOpen,
  Check,
  BrainCircuit,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const {
    currentRoadmap,
    savedRoadmaps,
    setCurrentRoadmap,
    setApiKeyModalOpen,
    geminiApiKey,
  } = useAppStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hasApiKey = Boolean(geminiApiKey);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                Antigravity <span className="text-indigo-400 font-medium">Path</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5 font-mono">
                AI Learning Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/dashboard"
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/catalog"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === "/catalog"
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Curriculum Catalog
            </Link>

            <Link
              href="/onboarding"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                pathname === "/onboarding"
                  ? "bg-slate-800 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Intake & Profiler</span>
            </Link>
          </nav>
        </div>

        {/* Right: Roadmap Switcher & API Key & New Map Button */}
        <div className="flex items-center gap-3">
          {/* Roadmap Selector Dropdown */}
          {savedRoadmaps.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-200 transition-colors max-w-[200px]"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{currentRoadmap?.title || "Select Roadmap"}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Your Roadmaps
                  </div>
                  {savedRoadmaps.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRoadmap(r);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate text-slate-300 group-hover:text-white">
                        {r.title}
                      </span>
                      {currentRoadmap?.id === r.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* API Key Modal Trigger */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Gemini AI</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-500"
              }`}
            />
          </button>

          {/* Create New Roadmap CTA */}
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Path</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
