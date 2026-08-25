import { NextRequest, NextResponse } from "next/server";
import { generateRoadmapFromProfile } from "@/lib/gemini";
import { connectToDatabase, memoryStore } from "@/lib/mongodb";
import { Roadmap } from "@/models/Roadmap";
import { LearnerProfileData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, apiKey } = body;

    if (!profile || !profile.targetGoal) {
      return NextResponse.json(
        { error: "Valid learner profile with targetGoal is required" },
        { status: 400 }
      );
    }

    const normalizedProfile: LearnerProfileData = {
      userId: profile.userId || `user-${Date.now()}`,
      targetGoal: profile.targetGoal,
      currentSkills: profile.currentSkills || [],
      skillLevel: profile.skillLevel || "Beginner",
      weeklyHours: Number(profile.weeklyHours) || 10,
      learningStyle: profile.learningStyle || "Balanced",
      diagnosticScores: profile.diagnosticScores || [],
    };

    const roadmapData = await generateRoadmapFromProfile(normalizedProfile, apiKey);

    // Save to Database / Memory
    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await Roadmap.create({
          userId: roadmapData.userId,
          title: roadmapData.title,
          targetGoal: roadmapData.targetGoal,
          summary: roadmapData.summary,
          estimatedTotalHours: roadmapData.estimatedTotalHours,
          nodes: roadmapData.nodes,
          edges: roadmapData.edges,
          status: roadmapData.status || "active",
        });
        roadmapData.id = saved._id.toString();
      } else {
        memoryStore.saveRoadmap(roadmapData);
      }
    } catch (dbErr) {
      console.warn("DB save failed, saved to memoryStore:", dbErr);
      memoryStore.saveRoadmap(roadmapData);
    }

    return NextResponse.json({ success: true, roadmap: roadmapData });
  } catch (error: any) {
    console.error("Roadmap Generation Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
