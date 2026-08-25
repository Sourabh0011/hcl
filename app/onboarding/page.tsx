"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  User,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Loader2,
  HelpCircle,
  BrainCircuit,
  Sliders,
  Check,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
  LearnerProfileData,
  DiagnosticQuestion,
  ProfilerChatMessage,
} from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    userProfile,
    setUserProfile,
    setCurrentRoadmap,
    geminiApiKey,
  } = useAppStore();

  const [messages, setMessages] = useState<ProfilerChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Welcome! I am your **AI Learning Architect**. Tell me: what career role or technology stack are you targeting (e.g. *AI Systems Engineer*, *Full-Stack Next.js*, *Cloud Architect*), and what is your current experience level?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // Live Extracted Profile State
  const [liveProfile, setLiveProfile] = useState<LearnerProfileData>({
    userId: `user-${Date.now()}`,
    targetGoal: userProfile?.targetGoal || "AI Systems Engineer",
    currentSkills: userProfile?.currentSkills || [
      { name: "Python / JavaScript", level: "Beginner" },
    ],
    skillLevel: userProfile?.skillLevel || "Beginner",
    weeklyHours: userProfile?.weeklyHours || 12,
    learningStyle: userProfile?.learningStyle || "Balanced",
    diagnosticScores: [],
  });

  // Diagnostic Quiz State
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>([
    {
      id: "dq1",
      topic: "Asynchronous Execution",
      question: "What is the primary advantage of asynchronous non-blocking I/O in backend services?",
      options: [
        "It uses zero memory",
        "It allows serving concurrent requests while waiting for slow I/O or AI API responses",
        "It eliminates runtime syntax errors",
        "It compiles Python to machine code"
      ],
      correctAnswer: 1,
      difficulty: "Beginner",
      skillTag: "Concurrency",
    },
    {
      id: "dq2",
      topic: "Vector Search & Embeddings",
      question: "Which metric is standard for calculating semantic similarity between normalized dense vectors?",
      options: [
        "Cosine Similarity / Dot Product",
        "Levenshtein Distance",
        "MD5 Checksum",
        "Hamming Distance"
      ],
      correctAnswer: 0,
      difficulty: "Intermediate",
      skillTag: "Vector Search",
    },
    {
      id: "dq3",
      topic: "Directed Acyclic Graphs (DAGs)",
      question: "Why is a DAG topology essential when sequencing prerequisite learning paths?",
      options: [
        "It prevents circular dependency deadlocks and enables parallel milestone progression",
        "It forces linear execution only",
        "It requires no database",
        "It is only usable for CSS"
      ],
      correctAnswer: 0,
      difficulty: "Intermediate",
      skillTag: "System Design",
    },
  ]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    "I want to become an AI Systems & LLM Engineer. I know basic Python and have 12 hours/week.",
    "I want to master Full-Stack Next.js 15 & Cloud Architecture. I know HTML/CSS/JS with 15h/week.",
    "I want to become a Cloud DevOps Solutions Architect. I know basic Linux and AWS.",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: ProfilerChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat/profiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();

      if (data.extractedProfile) {
        setLiveProfile((prev) => ({
          ...prev,
          targetGoal: data.extractedProfile.targetGoal || prev.targetGoal,
          currentSkills: data.extractedProfile.currentSkills?.length
            ? data.extractedProfile.currentSkills
            : prev.currentSkills,
          skillLevel: data.extractedProfile.skillLevel || prev.skillLevel,
          weeklyHours: data.extractedProfile.weeklyHours || prev.weeklyHours,
          learningStyle: data.extractedProfile.learningStyle || prev.learningStyle,
        }));
      }

      if (data.diagnosticQuestions && data.diagnosticQuestions.length > 0) {
        setDiagnosticQuestions(data.diagnosticQuestions);
      }

      const assistantMsg: ProfilerChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I have updated your profile with your preferences.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        extractedProfile: data.extractedProfile,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Profiler chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Profile calibrated! You can adjust your metrics on the right and generate your roadmap.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (qId: string, optIdx: number) => {
    const updated = { ...quizAnswers, [qId]: optIdx };
    setQuizAnswers(updated);

    if (Object.keys(updated).length === diagnosticQuestions.length) {
      let correct = 0;
      diagnosticQuestions.forEach((q) => {
        if (updated[q.id] === q.correctAnswer) correct++;
      });
      const scoreRatio = correct / diagnosticQuestions.length;
      const assessedLevel =
        scoreRatio >= 0.67 ? "Intermediate" : scoreRatio >= 0.33 ? "Beginner" : "Beginner";

      setLiveProfile((prev) => ({
        ...prev,
        skillLevel: assessedLevel,
      }));
      setQuizCompleted(true);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setUserProfile(liveProfile);

    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: liveProfile,
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.roadmap) {
        setCurrentRoadmap(data.roadmap);
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Generate roadmap error:", err);
      router.push("/dashboard");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#030712] overflow-hidden">
      {/* LEFT PANE: Conversational Chat Intake */}
      <div className="w-full lg:w-7/12 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 h-[calc(100vh-64px)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">AI Profiler & Career Architect</h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Interactive interview extracting goals, baseline, and time commitment
              </p>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex-shrink-0">
            Quick Start:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-left whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-200 transition-all flex-shrink-0 truncate max-w-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`p-2 rounded-xl flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-indigo-400 border border-slate-700"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800 shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] mt-2 ${
                    msg.role === "user" ? "text-indigo-200" : "text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900/90 rounded-2xl rounded-tl-none p-3.5 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Calibrating profile and analyzing target curriculum...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="e.g. I want to build AI agents, I have 10h/week, preference for project-first..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANE: Real-Time Extracted Profile & Calibration */}
      <div className="w-full lg:w-5/12 p-6 flex flex-col justify-between overflow-y-auto bg-slate-950/40 h-[calc(100vh-64px)] space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Real-Time Extracted Profile</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
              Live Calibrating
            </span>
          </div>

          {/* Goal Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              Target Specialization
            </span>
            <input
              type="text"
              value={liveProfile.targetGoal}
              onChange={(e) =>
                setLiveProfile((prev) => ({ ...prev, targetGoal: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Known Skills & Assessed Level */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Known Technical Skills
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                Level: {liveProfile.skillLevel}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {liveProfile.currentSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 flex items-center gap-1.5"
                >
                  <span>{skill.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono">({skill.level})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Weekly Commitment Slider */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Available Weekly Hours
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {liveProfile.weeklyHours} hrs / week
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={40}
              step={2}
              value={liveProfile.weeklyHours}
              onChange={(e) =>
                setLiveProfile((prev) => ({
                  ...prev,
                  weeklyHours: Number(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Learning Style */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">
              Learning Preference
            </span>
            <div className="grid grid-cols-2 gap-2">
              {["Theory-first", "Project-first", "Video-heavy", "Balanced"].map((style) => (
                <button
                  key={style}
                  onClick={() =>
                    setLiveProfile((prev) => ({ ...prev, learningStyle: style as any }))
                  }
                  className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                    liveProfile.learningStyle === style
                      ? "bg-indigo-600/30 border-indigo-500 text-white shadow-sm"
                      : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-750"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Question Diagnostic Calibration Quiz */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                3-Question Diagnostic Skill Calibration
              </span>
              <span className="text-[10px] font-mono text-purple-400">
                {Object.keys(quizAnswers).length} / {diagnosticQuestions.length} Answered
              </span>
            </div>

            <div className="space-y-3">
              {diagnosticQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 space-y-2"
                >
                  <p className="text-xs font-medium text-slate-200">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleQuizAnswer(q.id, optIdx)}
                        className={`text-left p-2 rounded-md text-[11px] border transition-all flex items-center justify-between ${
                          quizAnswers[q.id] === optIdx
                            ? "bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt}</span>
                        {quizAnswers[q.id] === optIdx && (
                          <Check className="w-3 h-3 text-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Roadmap Action Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleGenerateRoadmap}
            disabled={isGeneratingRoadmap}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
          >
            {isGeneratingRoadmap ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing DAG Learning Graph with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate My AI Learning Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
