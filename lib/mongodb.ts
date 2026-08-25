import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    // Return null if no URI configured; memory mock fallback will handle persistence
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("Successfully connected to MongoDB");
        return m;
      })
      .catch((err) => {
        console.warn("MongoDB connection failed, operating with in-memory store:", err.message);
        cached.promise = null;
        return null as unknown as typeof mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

// In-memory persistent mock storage for zero-config mode
class InMemoryStore {
  profiles = new Map<string, any>();
  roadmaps = new Map<string, any>();
  progress = new Map<string, any>();

  saveProfile(profile: any) {
    this.profiles.set(profile.userId, profile);
    return profile;
  }

  getProfile(userId: string) {
    return this.profiles.get(userId);
  }

  saveRoadmap(roadmap: any) {
    const id = roadmap.id || roadmap._id || `map-${Date.now()}`;
    const clean = { ...roadmap, id, _id: id };
    this.roadmaps.set(id, clean);
    return clean;
  }

  getRoadmap(id: string) {
    return this.roadmaps.get(id);
  }

  getAllRoadmaps() {
    return Array.from(this.roadmaps.values());
  }

  saveProgress(progress: any) {
    const key = `${progress.roadmapId}_${progress.userId}`;
    this.progress.set(key, progress);
    return progress;
  }

  getProgress(roadmapId: string, userId: string) {
    const key = `${roadmapId}_${userId}`;
    return this.progress.get(key);
  }
}

declare global {
  var inMemoryStore: InMemoryStore | undefined;
}

export const memoryStore = global.inMemoryStore || new InMemoryStore();
if (!global.inMemoryStore) {
  global.inMemoryStore = memoryStore;
}
