export type NodeStatus = "locked" | "active" | "completed";
export type NodeType = "course" | "project" | "assessment";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type LearningStyle = "Theory-first" | "Project-first" | "Video-heavy" | "Balanced";

export interface ResourceItem {
  title: string;
  url: string;
  platform: "Coursera" | "YouTube" | "GitHub" | "Docs" | "Interactive" | "Udemy" | "edX" | "Article";
  type?: "video" | "documentation" | "code_repo" | "exercise" | "course";
  free?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MilestoneTask {
  title: string;
  description: string;
  deliverables?: string[];
  rubric?: string[];
  quizQuestions?: QuizQuestion[];
}

export interface RoadmapNodeData {
  id: string;
  title: string;
  description?: string;
  type: NodeType;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  prerequisites: string[]; // array of node IDs
  recommendationReason: string;
  skillsGained: string[];
  resources: ResourceItem[];
  milestoneTask: MilestoneTask;
  status?: NodeStatus;
  score?: number;
  completedAt?: string;
  isCustomBridge?: boolean;
}

export interface RoadmapEdgeData {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface RoadmapData {
  id: string;
  _id?: any;
  userId: string;
  title: string;
  targetGoal: string;
  summary?: string;
  estimatedTotalHours: number;
  nodes: RoadmapNodeData[];
  edges: RoadmapEdgeData[];
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface LearnerProfileData {
  userId: string;
  targetGoal: string;
  currentSkills: { name: string; level: "Beginner" | "Intermediate" | "Advanced" }[];
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  weeklyHours: number;
  learningStyle: LearningStyle;
  diagnosticScores?: {
    quizId: string;
    topic: string;
    score: number;
    total: number;
  }[];
  createdAt?: string;
}

export interface LearnerProgressData {
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
  updatedAt?: string;
}

export interface DiagnosticQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skillTag: string;
}

export interface ProfilerChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  extractedProfile?: Partial<LearnerProfileData>;
  diagnosticQuestions?: DiagnosticQuestion[];
  isDiagnosticStep?: boolean;
}
