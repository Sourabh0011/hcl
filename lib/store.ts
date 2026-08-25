"use client";

import { create } from "zustand";
import {
  RoadmapData,
  RoadmapNodeData,
  LearnerProfileData,
  LearnerProgressData,
} from "@/types";
import { CATALOG_ROADMAPS } from "./mock-catalog";

interface AppState {
  // Current active roadmap & profile
  currentRoadmap: RoadmapData | null;
  userProfile: LearnerProfileData | null;
  savedRoadmaps: RoadmapData[];
  completedNodeIds: string[];
  selectedNode: RoadmapNodeData | null;
  
  // Custom API Key
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;

  // Drawers & Modals
  isNodeDrawerOpen: boolean;
  isTutorDrawerOpen: boolean;
  isApiKeyModalOpen: boolean;
  isAdaptModalOpen: boolean;
  
  // Visualization settings
  layoutDirection: "TB" | "LR";
  searchTerm: string;
  difficultyFilter: string;
  
  // Actions
  setCurrentRoadmap: (roadmap: RoadmapData) => void;
  setUserProfile: (profile: LearnerProfileData) => void;
  setSelectedNode: (node: RoadmapNodeData | null) => void;
  openNodeDrawer: (node: RoadmapNodeData) => void;
  closeNodeDrawer: () => void;
  openTutorDrawer: (node?: RoadmapNodeData) => void;
  closeTutorDrawer: () => void;
  setApiKeyModalOpen: (open: boolean) => void;
  setAdaptModalOpen: (open: boolean) => void;
  setLayoutDirection: (dir: "TB" | "LR") => void;
  setSearchTerm: (term: string) => void;
  setDifficultyFilter: (diff: string) => void;
  
  // Node progress mutations
  markNodeComplete: (nodeId: string, score?: number) => void;
  markNodeSkipped: (nodeId: string) => void;
  addBridgeNode: (updatedRoadmap: RoadmapData) => void;
  updateRoadmapData: (updatedRoadmap: RoadmapData) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRoadmap: CATALOG_ROADMAPS[0],
  userProfile: {
    userId: "user-default",
    targetGoal: "AI Systems Engineer",
    currentSkills: [
      { name: "Python", level: "Beginner" },
      { name: "FastAPI", level: "Beginner" },
    ],
    skillLevel: "Beginner",
    weeklyHours: 12,
    learningStyle: "Balanced",
  },
  savedRoadmaps: [...CATALOG_ROADMAPS],
  completedNodeIds: [],
  selectedNode: null,
  geminiApiKey: "",
  
  isNodeDrawerOpen: false,
  isTutorDrawerOpen: false,
  isApiKeyModalOpen: false,
  isAdaptModalOpen: false,
  layoutDirection: "TB",
  searchTerm: "",
  difficultyFilter: "ALL",

  setGeminiApiKey: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gemini_api_key", key);
    }
    set({ geminiApiKey: key });
  },

  setCurrentRoadmap: (roadmap: RoadmapData) => {
    set((state) => {
      // Check if already in savedRoadmaps
      const exists = state.savedRoadmaps.some((r) => r.id === roadmap.id);
      return {
        currentRoadmap: roadmap,
        savedRoadmaps: exists
          ? state.savedRoadmaps.map((r) => (r.id === roadmap.id ? roadmap : r))
          : [roadmap, ...state.savedRoadmaps],
      };
    });
  },

  setUserProfile: (profile: LearnerProfileData) => set({ userProfile: profile }),
  
  setSelectedNode: (node: RoadmapNodeData | null) => set({ selectedNode: node }),
  
  openNodeDrawer: (node: RoadmapNodeData) =>
    set({ selectedNode: node, isNodeDrawerOpen: true }),
    
  closeNodeDrawer: () => set({ isNodeDrawerOpen: false }),
  
  openTutorDrawer: (node?: RoadmapNodeData) =>
    set((state) => ({
      selectedNode: node || state.selectedNode,
      isTutorDrawerOpen: true,
    })),
    
  closeTutorDrawer: () => set({ isTutorDrawerOpen: false }),
  
  setApiKeyModalOpen: (open: boolean) => set({ isApiKeyModalOpen: open }),
  
  setAdaptModalOpen: (open: boolean) => set({ isAdaptModalOpen: open }),
  
  setLayoutDirection: (dir: "TB" | "LR") => set({ layoutDirection: dir }),
  
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  
  setDifficultyFilter: (diff: string) => set({ difficultyFilter: diff }),

  markNodeComplete: (nodeId: string, score: number = 100) => {
    const { currentRoadmap, completedNodeIds } = get();
    if (!currentRoadmap) return;

    if (!completedNodeIds.includes(nodeId)) {
      const nextCompleted = [...completedNodeIds, nodeId];

      const updatedNodes = currentRoadmap.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            status: "completed" as const,
            score,
            completedAt: new Date().toISOString(),
          };
        }
        return node;
      });

      const updatedRoadmap = {
        ...currentRoadmap,
        nodes: updatedNodes,
        updatedAt: new Date().toISOString(),
      };

      set({
        completedNodeIds: nextCompleted,
        currentRoadmap: updatedRoadmap,
        selectedNode:
          get().selectedNode?.id === nodeId
            ? { ...get().selectedNode!, status: "completed", score }
            : get().selectedNode,
      });

      // Sync to API asynchronously
      if (typeof window !== "undefined") {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roadmapId: currentRoadmap.id,
            userId: currentRoadmap.userId || "user-default",
            completedNodeId: nodeId,
            score,
          }),
        }).catch(console.warn);
      }
    }
  },

  markNodeSkipped: (nodeId: string) => {
    get().markNodeComplete(nodeId, 100);
  },

  addBridgeNode: (updatedRoadmap: RoadmapData) => {
    set({ currentRoadmap: updatedRoadmap });
  },

  updateRoadmapData: (updatedRoadmap: RoadmapData) => {
    set({ currentRoadmap: updatedRoadmap });
  },

  resetProgress: () => {
    const { currentRoadmap } = get();
    if (!currentRoadmap) return;

    const resetNodes = currentRoadmap.nodes.map((n, idx) => ({
      ...n,
      status: (idx === 0 ? "active" : "locked") as any,
      score: undefined,
      completedAt: undefined,
    }));

    set({
      completedNodeIds: [],
      currentRoadmap: { ...currentRoadmap, nodes: resetNodes },
    });
  },
}));
