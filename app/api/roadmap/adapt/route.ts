import { NextRequest, NextResponse } from "next/server";
import { adaptRoadmapWithAI } from "@/lib/gemini";
import { connectToDatabase, memoryStore } from "@/lib/mongodb";
import { Roadmap } from "@/models/Roadmap";
import { RoadmapData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentRoadmap, action, payload, apiKey } = body;

    if (!currentRoadmap || !action) {
      return NextResponse.json(
        { error: "currentRoadmap and action ('insert_bridge' | 'skip_node' | 'change_goal') are required" },
        { status: 400 }
      );
    }

    const adaptedRoadmap = await adaptRoadmapWithAI(
      currentRoadmap as RoadmapData,
      action,
      payload || {},
      apiKey
    );

    // Save updated roadmap
    try {
      const db = await connectToDatabase();
      if (db && adaptedRoadmap.id) {
        await Roadmap.findByIdAndUpdate(
          adaptedRoadmap.id,
          {
            nodes: adaptedRoadmap.nodes,
            edges: adaptedRoadmap.edges,
            targetGoal: adaptedRoadmap.targetGoal,
            title: adaptedRoadmap.title,
            estimatedTotalHours: adaptedRoadmap.estimatedTotalHours,
          },
          { new: true }
        );
      } else {
        memoryStore.saveRoadmap(adaptedRoadmap);
      }
    } catch (dbErr) {
      console.warn("DB update failed, updated in memoryStore:", dbErr);
      memoryStore.saveRoadmap(adaptedRoadmap);
    }

    return NextResponse.json({ success: true, roadmap: adaptedRoadmap });
  } catch (error: any) {
    console.error("Roadmap Adapt Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to adapt roadmap" },
      { status: 500 }
    );
  }
}
