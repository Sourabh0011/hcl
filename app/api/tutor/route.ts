import { NextRequest, NextResponse } from "next/server";
import { queryAITutor } from "@/lib/gemini";
import { RoadmapNodeData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { node, question, mode, apiKey } = body;

    if (!node || !question) {
      return NextResponse.json(
        { error: "Node object and user question are required" },
        { status: 400 }
      );
    }

    const answer = await queryAITutor(
      node as RoadmapNodeData,
      question,
      mode || "general",
      apiKey
    );

    return NextResponse.json({ success: true, answer });
  } catch (error: any) {
    console.error("AI Tutor Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to query AI tutor" },
      { status: 500 }
    );
  }
}
