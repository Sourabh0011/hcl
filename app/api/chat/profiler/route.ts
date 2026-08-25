import { NextRequest, NextResponse } from "next/server";
import { runProfilerConversation } from "@/lib/gemini";
import { connectToDatabase, memoryStore } from "@/lib/mongodb";
import { LearnerProfile } from "@/models/LearnerProfile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const result = await runProfilerConversation(messages, apiKey);

    // If profile extraction is complete, optionally persist to database
    if (result.extractedProfile && result.isComplete) {
      try {
        const db = await connectToDatabase();
        const profileData = {
          userId: `user-${Date.now()}`,
          targetGoal: result.extractedProfile.targetGoal || "AI Systems Engineer",
          currentSkills: result.extractedProfile.currentSkills || [],
          skillLevel: result.extractedProfile.skillLevel || "Beginner",
          weeklyHours: result.extractedProfile.weeklyHours || 10,
          learningStyle: result.extractedProfile.learningStyle || "Balanced",
        };

        if (db) {
          await LearnerProfile.findOneAndUpdate(
            { userId: profileData.userId },
            profileData,
            { upsert: true, new: true }
          );
        } else {
          memoryStore.saveProfile(profileData);
        }
      } catch (dbErr) {
        console.warn("Could not persist profile to DB, fallback to memory:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Profiler Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process profiler chat" },
      { status: 500 }
    );
  }
}
