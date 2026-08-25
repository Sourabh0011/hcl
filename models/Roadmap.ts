import mongoose, { Schema, Document, Model } from "mongoose";
import { RoadmapData, RoadmapNodeData, RoadmapEdgeData } from "@/types";

export interface IRoadmap extends Document {
  userId: string;
  title: string;
  targetGoal: string;
  summary?: string;
  estimatedTotalHours: number;
  nodes: RoadmapNodeData[];
  edges: RoadmapEdgeData[];
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    platform: { type: String, required: true },
    type: { type: String, default: "course" },
    free: { type: Boolean, default: true },
  },
  { _id: false }
);

const QuizQuestionSchema = new Schema(
  {
    id: { type: String },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const MilestoneTaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deliverables: [{ type: String }],
    rubric: [{ type: String }],
    quizQuestions: [QuizQuestionSchema],
  },
  { _id: false }
);

const RoadmapNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["course", "project", "assessment"],
      default: "course",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    estimatedHours: { type: Number, required: true },
    prerequisites: [{ type: String }],
    recommendationReason: { type: String, required: true },
    skillsGained: [{ type: String }],
    resources: [ResourceSchema],
    milestoneTask: MilestoneTaskSchema,
    status: {
      type: String,
      enum: ["locked", "active", "completed"],
      default: "locked",
    },
    score: { type: Number },
    completedAt: { type: String },
    isCustomBridge: { type: Boolean, default: false },
  },
  { _id: false }
);

const RoadmapEdgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    animated: { type: Boolean, default: true },
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    targetGoal: { type: String, required: true },
    summary: { type: String },
    estimatedTotalHours: { type: Number, default: 0 },
    nodes: [RoadmapNodeSchema],
    edges: [RoadmapEdgeSchema],
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export const Roadmap: Model<IRoadmap> =
  mongoose.models.Roadmap || mongoose.model<IRoadmap>("Roadmap", RoadmapSchema);
