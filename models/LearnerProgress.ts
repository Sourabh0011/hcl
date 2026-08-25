import mongoose, { Schema, Document, Model } from "mongoose";
import { LearnerProgressData } from "@/types";

export interface ILearnerProgress extends Document {
  roadmapId: string;
  userId: string;
  completedNodeIds: string[];
  activeNodeId?: string;
  scoreHistory: {
    nodeId: string;
    score: number;
    timestamp: string;
    quizScore?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ScoreHistorySchema = new Schema(
  {
    nodeId: { type: String, required: true },
    score: { type: Number, required: true },
    timestamp: { type: String, required: true },
    quizScore: { type: Number },
  },
  { _id: false }
);

const LearnerProgressSchema = new Schema<ILearnerProgress>(
  {
    roadmapId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    completedNodeIds: [{ type: String }],
    activeNodeId: { type: String },
    scoreHistory: [ScoreHistorySchema],
  },
  {
    timestamps: true,
  }
);

export const LearnerProgress: Model<ILearnerProgress> =
  mongoose.models.LearnerProgress ||
  mongoose.model<ILearnerProgress>("LearnerProgress", LearnerProgressSchema);
