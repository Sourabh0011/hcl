"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MetricsBar from "@/components/dashboard/MetricsBar";
import RoadmapCanvas from "@/components/canvas/RoadmapCanvas";
import { useAppStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function RoadmapDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { setCurrentRoadmap, currentRoadmap } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/roadmap/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.roadmap) {
            setCurrentRoadmap(data.roadmap);
          }
        })
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [id, setCurrentRoadmap]);

  if (loading && !currentRoadmap) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#030712]">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span>Loading dynamic learning graph...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#030712]">
      <MetricsBar />
      <div className="flex-1 relative w-full h-full">
        <RoadmapCanvas />
      </div>
    </div>
  );
}
