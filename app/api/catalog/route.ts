import { NextResponse } from "next/server";
import { CATALOG_ROADMAPS } from "@/lib/mock-catalog";
import { connectToDatabase, memoryStore } from "@/lib/mongodb";
import { Roadmap } from "@/models/Roadmap";
import { RoadmapData } from "@/types";

export async function GET() {
  try {
    let allRoadmaps: RoadmapData[] = [...CATALOG_ROADMAPS];

    try {
      const db = await connectToDatabase();
      if (db) {
        const customRoadmaps = await Roadmap.find({ status: "active" }).sort({ createdAt: -1 });
        const customClean: RoadmapData[] = customRoadmaps.map((r) => {
          const obj = r.toObject();
          return {
            ...obj,
            id: r._id.toString(),
            _id: r._id.toString(),
            createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : new Date().toISOString(),
          } as unknown as RoadmapData;
        });
        allRoadmaps = [...customClean, ...CATALOG_ROADMAPS];
      } else {
        const memRoadmaps = memoryStore.getAllRoadmaps();
        allRoadmaps = [...memRoadmaps, ...CATALOG_ROADMAPS];
      }
    } catch (err) {
      console.warn("Error fetching custom roadmaps, falling back to catalog:", err);
    }

    // Unique by id or title
    const unique = Array.from(
      new Map(allRoadmaps.map((item) => [item.id || item.title, item])).values()
    );

    return NextResponse.json({ success: true, roadmaps: unique });
  } catch (error: any) {
    console.error("Catalog Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch catalog" },
      { status: 500 }
    );
  }
}
