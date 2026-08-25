import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} mins`;
  if (hours === 1) return "1 hour";
  return `${hours} hours`;
}

export function getDifficultyColor(difficulty: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return {
        bg: "bg-emerald-950/40",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      };
    case "intermediate":
      return {
        bg: "bg-indigo-950/40",
        text: "text-indigo-400",
        border: "border-indigo-500/30",
        badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
      };
    case "advanced":
      return {
        bg: "bg-purple-950/40",
        text: "text-purple-400",
        border: "border-purple-500/30",
        badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      };
    default:
      return {
        bg: "bg-slate-900/40",
        text: "text-slate-400",
        border: "border-slate-700/40",
        badge: "bg-slate-800 text-slate-300 border-slate-700",
      };
  }
}
