import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, memoryStore } from "@/lib/mongodb";
import { Roadmap } from "@/models/Roadmap";
import { CATALOG_ROADMAPS } from "@/lib/mock-catalog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check catalog mock presets first
    const catalogMatch = CATALOG_ROADMAPS.find((r) => r.id === id);
    if (catalogMatch) {
      return NextResponse.json({ success: true, roadmap: catalogMatch });
    }

    // Check memory store
    const memMatch = memoryStore.getRoadmap(id);
    if (memMatch) {
      return NextResponse.json({ success: true, roadmap: memMatch });
    }

    // Check MongoDB
    const db = await connectToDatabase();
    if (db) {
      const roadmapDoc = await Roadmap.findById(id);
      if (roadmapDoc) {
        return NextResponse.json({ success: true, roadmap: roadmapDoc });
      }
    }

    // Fallback to first catalog roadmap
    return NextResponse.json({ success: true, roadmap: CATALOG_ROADMAPS[0] });
  } catch (error: any) {
    console.error("Fetch Roadmap Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}
