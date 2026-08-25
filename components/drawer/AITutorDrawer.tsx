"use client";

import React, { useState } from "react";
import {
  X,
  Bot,
  Send,
  Sparkles,
  Code,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface TutorMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  timestamp: string;
}

export default function AITutorDrawer() {
  const {
    selectedNode,
    isTutorDrawerOpen,
    closeTutorDrawer,
    openNodeDrawer,
    geminiApiKey,
  } = useAppStore();

  const [inputQuestion, setInputQuestion] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: "init-1",
      sender: "tutor",
      text: `Hello! I'm your dedicated AI Tutor for **${selectedNode?.title || "this module"}**. What would you like to explore or clarify? You can ask for simplified analogies, code snippets, or practice interview questions!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isTutorDrawerOpen || !selectedNode) return null;

  const quickPrompts = [
    { label: "💡 Explain like I'm 5", mode: "eli5", query: "Can you explain this concept like I am 5 years old using a memorable analogy?" },
    { label: "💻 Code Example", mode: "code", query: "Show me a clean production-grade code example illustrating this concept." },
    { label: "🎯 Practice Challenge", mode: "quiz", query: "Give me a practical challenge or debugging problem to test my understanding." },
    { label: "💼 Interview Question", mode: "general", query: "What are common senior-level technical interview questions asked about this topic?" },
  ];

  const handleSendMessage = async (textToSend?: string, mode: "general" | "eli5" | "code" | "quiz" = "general") => {
    const q = textToSend || inputQuestion.trim();
    if (!q || isLoading) return;

    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node: selectedNode,
          question: q,
          mode,
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      const tutorReply: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: data.answer || "I ran into an issue formulating the response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, tutorReply]);
    } catch (err) {
      console.error("Tutor request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `tutor-err-${Date.now()}`,
          sender: "tutor",
          text: "Connection to AI tutor failed. Operating in offline mode.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/70">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">AI Concept Tutor</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
              Context: {selectedNode.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              closeTutorDrawer();
              openNodeDrawer(selectedNode);
            }}
            className="text-[11px] px-2.5 py-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Node Details
          </button>
          <button
            onClick={closeTutorDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.query, item.mode as any)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-200 transition-all flex-shrink-0"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-indigo-400 border border-slate-700"
              }`}
            >
              {msg.sender === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                  : "bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800 shadow-sm"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[9px] mt-1.5 ${
                  msg.sender === "user" ? "text-indigo-200" : "text-slate-500"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/90 rounded-2xl rounded-tl-none p-3 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing curriculum & formulating answer...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder={`Ask anything about ${selectedNode.title}...`}
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            className="w-full pl-3.5 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
