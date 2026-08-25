"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Sparkles,
  BookOpen,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  HelpCircle,
  ArrowRight,
  Zap,
  RotateCcw,
  Bot,
  AlertCircle,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getDifficultyColor, formatHours, cn } from "@/lib/utils";
import { QuizQuestion } from "@/types";

export default function NodeDetailDrawer() {
  const {
    selectedNode,
    isNodeDrawerOpen,
    closeNodeDrawer,
    markNodeComplete,
    markNodeSkipped,
    openTutorDrawer,
    currentRoadmap,
    updateRoadmapData,
    geminiApiKey,
  } = useAppStore();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [isAdaptingBridge, setIsAdaptingBridge] = useState<boolean>(false);
  const [adaptSuccess, setAdaptSuccess] = useState<string | null>(null);

  if (!isNodeDrawerOpen || !selectedNode) return null;

  const diffColors = getDifficultyColor(selectedNode.difficulty);
  const isCompleted = selectedNode.status === "completed";
  const isActive = selectedNode.status === "active";

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (showQuizResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleVerifyQuiz = () => {
    const questions = selectedNode.milestoneTask?.quizQuestions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    setShowQuizResults(true);

    if (scorePercent >= 60) {
      triggerConfetti();
      markNodeComplete(selectedNode.id, scorePercent);
    }
  };

  const handleMarkCompleteManual = () => {
    triggerConfetti();
    markNodeComplete(selectedNode.id, 100);
  };

  const handleSkipNode = async () => {
    markNodeSkipped(selectedNode.id);
  };

  const handleInsertSteppingStone = async () => {
    if (!currentRoadmap) return;
    setIsAdaptingBridge(true);
    setAdaptSuccess(null);

    try {
      const res = await fetch("/api/roadmap/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRoadmap,
          action: "insert_bridge",
          payload: {
            nodeId: selectedNode.id,
            struggleNotes: "Found the current node conceptually challenging. Needs foundational stepping stone.",
          },
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.roadmap) {
        updateRoadmapData(data.roadmap);
        setAdaptSuccess("Stepping-Stone bridge inserted into your DAG!");
        setTimeout(() => setAdaptSuccess(null), 4000);
      }
    } catch (err) {
      console.error("Adapt error:", err);
    } finally {
      setIsAdaptingBridge(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#38bdf8", "#f43f5e"],
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-900/60">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                diffColors.badge
              )}
            >
              {selectedNode.difficulty}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {formatHours(selectedNode.estimatedHours)}
            </span>
            {isCompleted && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
              </span>
            )}
            {selectedNode.isCustomBridge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Stepping Stone
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white leading-tight">
            {selectedNode.title}
          </h2>
        </div>

        <button
          onClick={closeNodeDrawer}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Success Notification if bridge inserted */}
      {adaptSuccess && (
        <div className="mx-5 mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{adaptSuccess}</span>
        </div>
      )}

      {/* Drawer Body Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Transparent AI Explainability Callout */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/25 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Why This Is In Your Personalized Path</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedNode.recommendationReason}
          </p>
        </div>

        {/* Overview & Syllabus */}
        {selectedNode.description && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Concept Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
              {selectedNode.description}
            </p>
          </div>
        )}

        {/* Competencies / Skills Gained */}
        {selectedNode.skillsGained && selectedNode.skillsGained.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Target Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Curated Resources Hub */}
        {selectedNode.resources && selectedNode.resources.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Curated Learning Resources</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {selectedNode.resources.length} verified links
              </span>
            </h3>
            <div className="space-y-2">
              {selectedNode.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:text-indigo-300">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {res.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {res.platform}
                        </span>
                        {res.free && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Milestone Verification & Diagnostic Mini-Quiz */}
        {selectedNode.milestoneTask && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Milestone Task & Verification
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                Hands-On Mastery
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-1">
                {selectedNode.milestoneTask.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedNode.milestoneTask.description}
              </p>
            </div>

            {/* Deliverables Checklist */}
            {selectedNode.milestoneTask.deliverables &&
              selectedNode.milestoneTask.deliverables.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">
                    Deliverables Checklist:
                  </span>
                  <ul className="space-y-1">
                    {selectedNode.milestoneTask.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-300 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Interactive Verification Quiz */}
            {selectedNode.milestoneTask.quizQuestions &&
              selectedNode.milestoneTask.quizQuestions.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Diagnostic Concept Check
                  </div>
                  {selectedNode.milestoneTask.quizQuestions.map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-850 space-y-2.5"
                    >
                      <p className="text-xs font-medium text-slate-200">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          const isCorrect = optIdx === q.correctIndex;
                          let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";

                          if (isSelected) {
                            btnStyle = "bg-indigo-600/20 border-indigo-500 text-indigo-300";
                          }
                          if (showQuizResults) {
                            if (isCorrect) {
                              btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300";
                            } else if (isSelected && !isCorrect) {
                              btnStyle = "bg-rose-950/60 border-rose-500 text-rose-300";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerSelect(q.id, optIdx)}
                              className={`w-full text-left p-2.5 rounded-md text-xs border transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {showQuizResults && isCorrect && (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizResults && q.explanation && (
                        <div className="p-2 rounded bg-slate-900 text-[11px] text-slate-400 border border-slate-800">
                          <strong className="text-slate-300">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleVerifyQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length <
                      (selectedNode.milestoneTask.quizQuestions?.length || 1)
                    }
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Submit & Verify Mastery</span>
                  </button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Ask AI Tutor */}
          <button
            onClick={() => {
              closeNodeDrawer();
              openTutorDrawer(selectedNode);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold border border-slate-700 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Ask AI Tutor</span>
          </button>

          {/* Mark as Mastered button */}
          <button
            onClick={handleMarkCompleteManual}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg ${
              isCompleted
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? "Marked Complete" : "Mark as Mastered"}</span>
          </button>
        </div>

        {/* Adaptation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
          <button
            onClick={handleSkipNode}
            className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>I already know this</span>
          </button>

          <button
            onClick={handleInsertSteppingStone}
            disabled={isAdaptingBridge}
            className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3" />
            <span>{isAdaptingBridge ? "Generating Bridge..." : "Too difficult? Insert Stepping Stone"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
