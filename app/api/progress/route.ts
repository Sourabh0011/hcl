import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, memoryStore } from "@/lib/mongodb";
import { LearnerProgress } from "@/models/LearnerProgress";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roadmapId, userId, completedNodeId, score } = body;

    if (!roadmapId || !userId || !completedNodeId) {
      return NextResponse.json(
        { error: "roadmapId, userId, and completedNodeId are required" },
        { status: 400 }
      );
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        await LearnerProgress.findOneAndUpdate(
          { roadmapId, userId },
          {
            $addToSet: { completedNodeIds: completedNodeId },
            $push: {
              scoreHistory: {
                nodeId: completedNodeId,
                score: score || 100,
                timestamp: new Date().toISOString(),
              },
            },
            activeNodeId: completedNodeId,
          },
          { upsert: true, new: true }
        );
      } else {
        const existing = memoryStore.getProgress(roadmapId, userId) || {
          roadmapId,
          userId,
          completedNodeIds: [],
          scoreHistory: [],
        };
        if (!existing.completedNodeIds.includes(completedNodeId)) {
          existing.completedNodeIds.push(completedNodeId);
        }
        existing.scoreHistory.push({
          nodeId: completedNodeId,
          score: score || 100,
          timestamp: new Date().toISOString(),
        });
        memoryStore.saveProgress(existing);
      }
    } catch (dbErr) {
      console.warn("DB progress update failed, fallback to memory:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Progress Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get("roadmapId");
    const userId = searchParams.get("userId") || "user-default";

    if (!roadmapId) {
      return NextResponse.json(
        { error: "roadmapId parameter is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (db) {
      const progress = await LearnerProgress.findOne({ roadmapId, userId });
      return NextResponse.json({ success: true, progress: progress || null });
    }

    const memProgress = memoryStore.getProgress(roadmapId, userId);
    return NextResponse.json({ success: true, progress: memProgress || null });
  } catch (error: any) {
    console.error("Fetch Progress Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
