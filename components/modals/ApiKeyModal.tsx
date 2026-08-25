"use client";

import React, { useState, useEffect } from "react";
import { X, Key, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function ApiKeyModal() {
  const { isApiKeyModalOpen, setApiKeyModalOpen, geminiApiKey, setGeminiApiKey } =
    useAppStore();

  const [inputKey, setInputKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gemini_api_key") || "";
      setInputKey(stored);
    }
  }, [isApiKeyModalOpen]);

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    setGeminiApiKey(inputKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setApiKeyModalOpen(false);
    }, 1200);
  };

  const handleClear = () => {
    setInputKey("");
    setGeminiApiKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">Configure your personal AI credentials</p>
            </div>
          </div>

          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Antigravity uses the <strong>Google Gemini API</strong> for custom DAG roadmap generation, dynamic prerequisite stepping-stone adaptation, and real-time concept tutoring.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Your API key is saved exclusively in your local browser session and sent directly to the Gemini API endpoint.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear Key
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApiKeyModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition-colors flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
