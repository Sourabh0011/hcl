import mongoose, { Schema, Document, Model } from "mongoose";
import { LearnerProfileData } from "@/types";

export interface ILearnerProfile extends Omit<LearnerProfileData, "userId">, Document {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
  },
  { _id: false }
);

const DiagnosticScoreSchema = new Schema(
  {
    quizId: { type: String },
    topic: { type: String },
    score: { type: Number },
    total: { type: Number },
  },
  { _id: false }
);

const LearnerProfileSchema = new Schema<ILearnerProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    targetGoal: { type: String, required: true },
    currentSkills: [SkillSchema],
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    weeklyHours: { type: Number, default: 10, min: 1, max: 80 },
    learningStyle: {
      type: String,
      enum: ["Theory-first", "Project-first", "Video-heavy", "Balanced"],
      default: "Balanced",
    },
    diagnosticScores: [DiagnosticScoreSchema],
  },
  {
    timestamps: true,
  }
);

export const LearnerProfile: Model<ILearnerProfile> =
  mongoose.models.LearnerProfile ||
  mongoose.model<ILearnerProfile>("LearnerProfile", LearnerProfileSchema);
