import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  LearnerProfileData,
  RoadmapData,
  RoadmapNodeData,
  RoadmapEdgeData,
  ProfilerChatMessage,
  DiagnosticQuestion,
} from "@/types";
import { CATALOG_ROADMAPS } from "./mock-catalog";

function getGeminiClient(customApiKey?: string) {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    return new GoogleGenerativeAI(key);
  } catch (e) {
    console.error("Failed to initialize GoogleGenerativeAI:", e);
    return null;
  }
}

/**
 * 1. Conversational Profiler AI
 */
export async function runProfilerConversation(
  messages: { role: string; content: string }[],
  apiKey?: string
): Promise<{
  reply: string;
  extractedProfile?: Partial<LearnerProfileData>;
  diagnosticQuestions?: DiagnosticQuestion[];
  isComplete?: boolean;
}> {
  const genAI = getGeminiClient(apiKey);

  const systemInstruction = `
You are an expert AI Career and Learning Architect. Your goal is to interview the user in a friendly, concise, and structured way to build a personalized learning roadmap.

During the conversation, extract:
1. targetGoal (e.g., "AI Systems Engineer", "Full-Stack Developer", "Cloud Solutions Architect", "Data Scientist")
2. currentSkills (array of { name: string, level: "Beginner" | "Intermediate" | "Advanced" })
3. weeklyHours (number of hours, default 10)
4. learningStyle ("Theory-first" | "Project-first" | "Video-heavy" | "Balanced")

If you have extracted enough details about the user's target goal and current skills, generate 3 specific multiple-choice diagnostic questions to calibrate their skill level.

You MUST respond strictly in valid JSON matching this schema:
{
  "reply": "Conversational reply to the user guiding them to the next step or explaining their profile",
  "extractedProfile": {
    "targetGoal": "string or undefined",
    "currentSkills": [{"name": "string", "level": "Beginner | Intermediate | Advanced"}],
    "skillLevel": "Beginner | Intermediate | Advanced",
    "weeklyHours": number,
    "learningStyle": "Theory-first | Project-first | Video-heavy | Balanced"
  },
  "diagnosticQuestions": [
    {
      "id": "q1",
      "topic": "Topic name",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "difficulty": "Beginner | Intermediate | Advanced",
      "skillTag": "Skill name"
    }
  ],
  "isComplete": true or false
}
Do NOT include markdown formatting outside the JSON code block.
`;

  if (!genAI) {
    // Generative fallback engine for profiler
    return fallbackProfiler(messages);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
      systemInstruction,
    });

    const chatContent = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const result = await model.generateContent(chatContent);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err: any) {
    console.warn("Gemini Profiler API error, using fallback:", err.message);
    return fallbackProfiler(messages);
  }
}

/**
 * 2. Multi-Stage AI Roadmap Generator
 */
export async function generateRoadmapFromProfile(
  profile: LearnerProfileData,
  apiKey?: string
): Promise<RoadmapData> {
  const genAI = getGeminiClient(apiKey);

  const prompt = `
Generate a structured, personalized Directed Acyclic Graph (DAG) learning roadmap for a learner with the following profile:
- Target Goal: ${profile.targetGoal}
- Current Skills: ${JSON.stringify(profile.currentSkills)}
- Assessed Skill Level: ${profile.skillLevel}
- Available Weekly Hours: ${profile.weeklyHours} hrs/week
- Learning Preference: ${profile.learningStyle}

Requirements:
1. Generate between 5 and 7 progressive nodes representing a rigorous topological path from their current skill level to their target goal.
2. For every node, provide:
   - "id": unique string (e.g., "node-1", "node-2")
   - "title": Concise, industry-standard skill or milestone title
   - "description": 2-3 sentence overview
   - "type": "course" | "project" | "assessment"
   - "difficulty": "Beginner" | "Intermediate" | "Advanced"
   - "estimatedHours": realistic number of hours to master
   - "prerequisites": array of prerequisite node IDs (empty for root nodes)
   - "recommendationReason": Clear explanation tailored to their background answering "Why is this recommended for your specific goal?"
   - "skillsGained": array of strings (e.g. ["Python", "FastAPI"])
   - "resources": 2-3 high quality real resources with title, url, platform ("Coursera" | "YouTube" | "GitHub" | "Docs" | "Interactive" | "Article"), free boolean
   - "milestoneTask": an object with "title", "description", "deliverables" (array), "rubric" (array), and "quizQuestions" (1-2 multiple-choice questions with id, question, options, correctIndex, explanation)
3. "edges": Array of { "id": "e1-2", "source": "node-1", "target": "node-2", "animated": true } matching all prerequisite relationships without cyclic dependencies.
4. "title": Catchy, ambitious roadmap title
5. "summary": 2-sentence executive summary of the journey.

Return ONLY valid JSON without markdown wrapping.
`;

  if (!genAI) {
    return generateFallbackRoadmap(profile);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    const totalHours = (data.nodes || []).reduce(
      (acc: number, n: any) => acc + (n.estimatedHours || 10),
      0
    );

    return {
      id: `map-${Date.now()}`,
      userId: profile.userId,
      title: data.title || `${profile.targetGoal} Mastery Roadmap`,
      targetGoal: profile.targetGoal,
      summary: data.summary || `Personalized path to becoming a ${profile.targetGoal}.`,
      estimatedTotalHours: totalHours,
      nodes: (data.nodes || []).map((node: any, idx: number) => ({
        ...node,
        status: idx === 0 ? "active" : "locked",
      })),
      edges: data.edges || [],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn("Gemini Roadmap Generation failed, using intelligent template:", err.message);
    return generateFallbackRoadmap(profile);
  }
}

/**
 * 3. Dynamic Adaptation Engine
 */
export async function adaptRoadmapWithAI(
  currentRoadmap: RoadmapData,
  action: "insert_bridge" | "skip_node" | "change_goal",
  payload: {
    nodeId?: string;
    newGoal?: string;
    struggleNotes?: string;
  },
  apiKey?: string
): Promise<RoadmapData> {
  const genAI = getGeminiClient(apiKey);

  if (action === "skip_node" && payload.nodeId) {
    // Mark node completed and unlock downstream dependencies
    const updatedNodes = currentRoadmap.nodes.map((n) => {
      if (n.id === payload.nodeId) {
        return { ...n, status: "completed" as const, completedAt: new Date().toISOString() };
      }
      return n;
    });

    return {
      ...currentRoadmap,
      nodes: updatedNodes,
      updatedAt: new Date().toISOString(),
    };
  }

  if (action === "insert_bridge" && payload.nodeId) {
    const targetNode = currentRoadmap.nodes.find((n) => n.id === payload.nodeId);
    if (!targetNode) return currentRoadmap;

    const bridgePrompt = `
A learner studying "${currentRoadmap.targetGoal}" is finding the module "${targetNode.title}" too difficult.
Target Node Description: ${targetNode.description}
Struggle notes: ${payload.struggleNotes || "Found the conceptual leap too steep."}

Create a single intermediate "Stepping-Stone" prerequisite module that bridges the gap.
Return JSON matching this schema:
{
  "bridgeNode": {
    "title": "Bridge Concept Title",
    "description": "2-sentence bridge overview",
    "type": "course",
    "difficulty": "Beginner",
    "estimatedHours": 8,
    "recommendationReason": "Created dynamically to solidify prerequisite foundations before tackling ${targetNode.title}.",
    "skillsGained": ["Skill 1", "Skill 2"],
    "resources": [
      { "title": "Resource Name", "url": "https://example.com", "platform": "Docs", "free": true }
    ],
    "milestoneTask": {
      "title": "Stepping-Stone Hands-on Exercise",
      "description": "Short practice task",
      "quizQuestions": [
        {
          "id": "bq1",
          "question": "Sample check question",
          "options": ["A", "B", "C", "D"],
          "correctIndex": 0,
          "explanation": "Why this is correct"
        }
      ]
    }
  }
}
`;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
        });
        const result = await model.generateContent(bridgePrompt);
        const parsed = JSON.parse(result.response.text());
        const bridgeData = parsed.bridgeNode;

        const bridgeId = `bridge-${Date.now().toString().slice(-4)}`;
        const newBridgeNode: RoadmapNodeData = {
          id: bridgeId,
          title: `🎯 Stepping-Stone: ${bridgeData.title}`,
          description: bridgeData.description,
          type: "course",
          difficulty: bridgeData.difficulty || "Beginner",
          estimatedHours: bridgeData.estimatedHours || 8,
          prerequisites: [...targetNode.prerequisites],
          recommendationReason: bridgeData.recommendationReason,
          skillsGained: bridgeData.skillsGained || ["Foundations"],
          resources: bridgeData.resources || [],
          milestoneTask: bridgeData.milestoneTask || {
            title: "Bridging Practice Check",
            description: "Complete this preparatory exercise.",
          },
          status: "active",
          isCustomBridge: true,
        };

        // Update target node prerequisites to include the bridge
        const updatedNodes = currentRoadmap.nodes.map((n) => {
          if (n.id === payload.nodeId) {
            return {
              ...n,
              prerequisites: [bridgeId],
              status: "locked" as const,
            };
          }
          return n;
        });

        // Rewire edges
        const updatedEdges = currentRoadmap.edges.filter(
          (e) => e.target !== targetNode.id
        );

        // Add edge from former prereqs to bridge
        targetNode.prerequisites.forEach((pId) => {
          updatedEdges.push({
            id: `e-${pId}-${bridgeId}`,
            source: pId,
            target: bridgeId,
            animated: true,
          });
        });

        // Add edge from bridge to target node
        updatedEdges.push({
          id: `e-${bridgeId}-${targetNode.id}`,
          source: bridgeId,
          target: targetNode.id,
          animated: true,
        });

        return {
          ...currentRoadmap,
          nodes: [newBridgeNode, ...updatedNodes],
          edges: updatedEdges,
          estimatedTotalHours: currentRoadmap.estimatedTotalHours + newBridgeNode.estimatedHours,
          updatedAt: new Date().toISOString(),
        };
      } catch (err: any) {
        console.warn("AI bridge generation failed, using local bridge:", err.message);
      }
    }

    // Local fallback bridge
    const bridgeId = `bridge-${Date.now().toString().slice(-4)}`;
    const newBridgeNode: RoadmapNodeData = {
      id: bridgeId,
      title: `🎯 Stepping Stone: Foundations for ${targetNode.title}`,
      description: `Targeted review and scaffolded practice modules to prepare you smoothly for ${targetNode.title}.`,
      type: "course",
      difficulty: "Beginner",
      estimatedHours: 6,
      prerequisites: [...targetNode.prerequisites],
      recommendationReason: `Inserted dynamically because you flagged ${targetNode.title} as challenging. This stepping-stone reinforces the core mental models.`,
      skillsGained: ["Foundational Mechanics", "Practical Drills"],
      resources: [
        {
          title: `Introductory Guide to ${targetNode.title}`,
          url: "https://developer.mozilla.org",
          platform: "Docs",
          free: true,
        },
        {
          title: "Visual Walkthrough & Code Sandbox",
          url: "https://youtube.com",
          platform: "YouTube",
          free: true,
        }
      ],
      milestoneTask: {
        title: "Foundation Check Mini-Quiz",
        description: "Verify foundational principles before progressing to advanced concepts.",
        quizQuestions: [
          {
            id: "bq-1",
            question: `What is the primary objective of this stepping stone before taking on ${targetNode.title}?`,
            options: [
              "Solidify core terminology and fundamental execution patterns",
              "Skip the advanced material entirely",
              "Switch to an unrelated programming language",
              "None of the above"
            ],
            correctIndex: 0,
            explanation: "Stepping-stones break complex abstractions into digestible, intuitive mental models."
          }
        ]
      },
      status: "active",
      isCustomBridge: true,
    };

    const updatedNodes = currentRoadmap.nodes.map((n) => {
      if (n.id === payload.nodeId) {
        return {
          ...n,
          prerequisites: [bridgeId],
          status: "locked" as const,
        };
      }
      return n;
    });

    const updatedEdges = currentRoadmap.edges.filter(
      (e) => e.target !== targetNode.id
    );

    targetNode.prerequisites.forEach((pId) => {
      updatedEdges.push({
        id: `e-${pId}-${bridgeId}`,
        source: pId,
        target: bridgeId,
        animated: true,
      });
    });

    updatedEdges.push({
      id: `e-${bridgeId}-${targetNode.id}`,
      source: bridgeId,
      target: targetNode.id,
      animated: true,
    });

    return {
      ...currentRoadmap,
      nodes: [newBridgeNode, ...updatedNodes],
      edges: updatedEdges,
      estimatedTotalHours: currentRoadmap.estimatedTotalHours + 6,
      updatedAt: new Date().toISOString(),
    };
  }

  if (action === "change_goal" && payload.newGoal) {
    return generateRoadmapFromProfile(
      {
        userId: currentRoadmap.userId,
        targetGoal: payload.newGoal,
        currentSkills: currentRoadmap.nodes
          .filter((n) => n.status === "completed")
          .map((n) => ({ name: n.title, level: "Intermediate" })),
        skillLevel: "Intermediate",
        weeklyHours: 12,
        learningStyle: "Balanced",
      },
      apiKey
    );
  }

  return currentRoadmap;
}

/**
 * 4. Interactive Node AI Tutor
 */
export async function queryAITutor(
  node: RoadmapNodeData,
  userQuestion: string,
  mode: "general" | "eli5" | "code" | "quiz" = "general",
  apiKey?: string
): Promise<string> {
  const genAI = getGeminiClient(apiKey);

  const prompts: Record<string, string> = {
    eli5: `Explain the concept "${node.title}" in the simplest possible terms, using an intuitive everyday analogy. Break down why it matters for someone aspiring to master ${node.skillsGained.join(", ")}. User question: "${userQuestion}"`,
    code: `Provide a clean, production-grade code example illustrating "${node.title}". Include step-by-step comments explaining the architecture and design rationale. User question: "${userQuestion}"`,
    quiz: `Generate a challenging conceptual question or code debugging scenario testing mastery of "${node.title}", with 4 options and detailed explanation. User query: "${userQuestion}"`,
    general: `You are an expert AI tutor helping a student master the learning module: "${node.title}".
Description: ${node.description}
Skills covered: ${node.skillsGained.join(", ")}
Milestone Task: ${node.milestoneTask?.title} - ${node.milestoneTask?.description}

Answer the student's question clearly, pedagogically, and constructively:
"${userQuestion}"`,
  };

  const selectedPrompt = prompts[mode] || prompts.general;

  if (!genAI) {
    return fallbackTutorReply(node, userQuestion, mode);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.6 },
    });
    const result = await model.generateContent(selectedPrompt);
    return result.response.text();
  } catch (err: any) {
    console.warn("AI Tutor API failed, using fallback:", err.message);
    return fallbackTutorReply(node, userQuestion, mode);
  }
}

// Fallback helper engines
function fallbackProfiler(messages: { role: string; content: string }[]) {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content.toLowerCase() || "";

  let goal = "AI Systems Engineer";
  if (lastUserMsg.includes("full") || lastUserMsg.includes("web") || lastUserMsg.includes("react")) {
    goal = "Full-Stack Developer";
  } else if (lastUserMsg.includes("cloud") || lastUserMsg.includes("devops") || lastUserMsg.includes("aws")) {
    goal = "Cloud DevOps Architect";
  } else if (lastUserMsg.includes("data") || lastUserMsg.includes("machine learning")) {
    goal = "Data Scientist";
  }

  const isLateStep = messages.length >= 3;

  return {
    reply: isLateStep
      ? `Fantastic! I've calibrated your target as **${goal}** with a commitment of **12 hrs/week**. Here is a 3-question diagnostic calibration to test your baseline.`
      : `Welcome! I'm your AI Learning Architect. I'll help you craft an optimal personalized roadmap for **${goal}**. Could you share your current programming experience and how many hours per week you can dedicate?`,
    extractedProfile: {
      targetGoal: goal,
      currentSkills: [
        { name: "Python / JavaScript", level: "Beginner" as const },
        { name: "APIs & Web Basics", level: "Beginner" as const },
      ],
      skillLevel: "Beginner" as const,
      weeklyHours: 12,
      learningStyle: "Balanced" as const,
    },
    diagnosticQuestions: [
      {
        id: "dq1",
        topic: "Asynchronous Execution",
        question: "In modern backend development, what is the key advantage of asynchronous non-blocking I/O?",
        options: [
          "It uses zero memory",
          "It allows handling thousands of concurrent requests while waiting for slow operations like AI API calls",
          "It makes code execute in C++ speed automatically",
          "It replaces the database completely"
        ],
        correctAnswer: 1,
        difficulty: "Beginner" as const,
        skillTag: "Concurrency",
      },
      {
        id: "dq2",
        topic: "Vector Search & Embeddings",
        question: "What metric is most commonly used to compute similarity between normalized text embeddings?",
        options: [
          "Cosine Similarity / Dot Product",
          "Hamming Distance",
          "Levenshtein Edit Distance",
          "MD5 Hash Match"
        ],
        correctAnswer: 0,
        difficulty: "Intermediate" as const,
        skillTag: "AI & Vector Search",
      },
      {
        id: "dq3",
        topic: "Architecture & Modularity",
        question: "Why are Directed Acyclic Graphs (DAGs) effective for orchestrating complex AI workflows?",
        options: [
          "They prevent infinite circular loops while enabling parallel dependent task execution",
          "They only run on GPUs",
          "They require no code to deploy",
          "They compile to HTML"
        ],
        correctAnswer: 0,
        difficulty: "Intermediate" as const,
        skillTag: "System Design",
      },
    ],
    isComplete: isLateStep,
  };
}

function generateFallbackRoadmap(profile: LearnerProfileData): RoadmapData {
  const goalLower = (profile.targetGoal || "").toLowerCase();
  const catalog =
    goalLower.includes("full") || goalLower.includes("web")
      ? CATALOG_ROADMAPS[1]
      : CATALOG_ROADMAPS[0];

  return {
    ...catalog,
    id: `map-${Date.now()}`,
    userId: profile.userId,
    targetGoal: profile.targetGoal || catalog.targetGoal,
    title: `${profile.targetGoal || catalog.targetGoal} Personalized Roadmap`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function fallbackTutorReply(
  node: RoadmapNodeData,
  userQuestion: string,
  mode: string
): string {
  if (mode === "eli5") {
    return `### 💡 ELI5: Understanding ${node.title}
Think of **${node.title}** like an assembly line in a smart kitchen:
Instead of one chef waiting idly for the oven to bake before chopping vegetables, each station works asynchronously. When a timer dings, the next step triggers automatically!

**Why it matters for you:**
Mastering this allows your software to handle heavy AI workloads, multi-user concurrency, and high-performance operations without grinding to a halt.`;
  }

  if (mode === "code") {
    return `### 💻 Production Code Blueprint: ${node.title}

\`\`\`python
import asyncio
from typing import AsyncGenerator
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="High-Throughput AI Service")

class QueryRequest(BaseModel):
    prompt: str
    temperature: float = 0.7

async def mock_token_stream(prompt: str) -> AsyncGenerator[str, None]:
    tokens = ["Deep", " Learning", " systems", " optimize", " latency."]
    for token in tokens:
        await asyncio.sleep(0.05)  # Non-blocking async I/O
        yield token

@app.post("/stream")
async def stream_ai_endpoint(req: QueryRequest):
    async def event_generator():
        async for chunk in mock_token_stream(req.prompt):
            yield f"data: {chunk}\\n\\n"
    from fastapi.responses import StreamingResponse
    return StreamingResponse(event_generator(), media_type="text/event-stream")
\`\`\`

**Key Takeaways:**
1. **AsyncIO** ensures no OS threads are blocked during inference.
2. **Pydantic** guarantees type validation before processing.`;
  }

  return `### 🧠 AI Tutor Guidance on ${node.title}
Regarding your question: *"${userQuestion}"*

Here are the key principles to keep in mind:
1. **Prerequisite Connections**: This module builds on your foundational skills (${node.skillsGained.join(", ")}).
2. **Real-World Application**: In production systems, this is used for high reliability, fault tolerance, and scalable throughput.
3. **Milestone Verification**: Complete the milestone task: **"${node.milestoneTask?.title}"** to cement this concept into practical muscle memory.`;
}
