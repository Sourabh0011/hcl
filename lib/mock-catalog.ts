import { RoadmapData } from "@/types";

export const CATALOG_ROADMAPS: RoadmapData[] = [
  {
    id: "ai-systems-engineer",
    userId: "catalog-system",
    title: "AI Systems & LLM Application Engineer",
    targetGoal: "AI Systems Engineer",
    summary: "End-to-end mastery path covering Modern Python, Vector Databases, RAG Architectures, Agentic Workflows with LangChain/LlamaIndex, and Production LLM Deployment.",
    estimatedTotalHours: 120,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: "node-1",
        title: "Modern Python & Async Architecture",
        description: "Master Python 3.12+ features, Pydantic v2, asynchronous programming (asyncio), and high-performance API design with FastAPI.",
        type: "course",
        difficulty: "Beginner",
        estimatedHours: 15,
        prerequisites: [],
        recommendationReason: "Foundation for building high-throughput AI backends, streaming token handlers, and resilient microservices.",
        skillsGained: ["Python", "AsyncIO", "Pydantic", "FastAPI"],
        resources: [
          {
            title: "FastAPI Official Documentation & Tutorial",
            url: "https://fastapi.tiangolo.com/tutorial/",
            platform: "Docs",
            free: true,
          },
          {
            title: "AsyncIO in Python: Complete Guide",
            url: "https://realpython.com/async-io-python/",
            platform: "Article",
            free: true,
          },
          {
            title: "Modern Python for Developers (YouTube)",
            url: "https://youtube.com",
            platform: "YouTube",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Asynchronous Streaming Gateway",
          description: "Build a high-performance FastAPI service with Pydantic validation that handles concurrent token streaming requests.",
          deliverables: ["FastAPI app with async endpoints", "Pydantic request/response models", "Unit test suite with pytest-asyncio"],
          rubric: ["Correct async concurrency", "Strict schema validation", "Error boundary handling"],
          quizQuestions: [
            {
              id: "q1",
              question: "What is the primary benefit of using `asyncio` in an AI microservice streaming responses?",
              options: [
                "It accelerates CPU matrix multiplication",
                "It enables non-blocking I/O while waiting for token generation from upstream LLM APIs",
                "It eliminates the need for type annotations",
                "It automatically compiles Python to machine code"
              ],
              correctIndex: 1,
              explanation: "LLM API calls are I/O bound operations. Non-blocking asynchronous I/O allows a single process to serve thousands of concurrent chat connections without blocking threads."
            },
            {
              id: "q2",
              question: "How does Pydantic v2 achieve up to 20x performance improvement over v1?",
              options: [
                "By using Rust-based validation core (pydantic-core)",
                "By skipping runtime type validation completely",
                "By running exclusively inside web workers",
                "By requiring Cython compilation for every file"
              ],
              correctIndex: 0,
              explanation: "Pydantic v2 rewrote its internal validation logic in Rust via `pydantic-core`, vastly improving parsing speed."
            }
          ]
        },
        status: "active"
      },
      {
        id: "node-2",
        title: "Vector Databases & Dense Embeddings",
        description: "Explore dense vector representations, distance metrics (Cosine, Euclidean, Dot Product), and indices (HNSW, IVF-PQ) using Pinecone, Qdrant, and ChromaDB.",
        type: "course",
        difficulty: "Intermediate",
        estimatedHours: 18,
        prerequisites: ["node-1"],
        recommendationReason: "Vector indexing is the primary storage and semantic retrieval backbone for all enterprise RAG applications.",
        skillsGained: ["Embeddings", "HNSW", "Pinecone", "Qdrant", "ChromaDB"],
        resources: [
          {
            title: "Pinecone Vector Database Architecture Guide",
            url: "https://www.pinecone.io/learn/vector-database/",
            platform: "Docs",
            free: true,
          },
          {
            title: "Hierarchical Navigable Small World (HNSW) Explained",
            url: "https://www.pinecone.io/learn/series/faiss/hnsw/",
            platform: "Article",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Semantic Vector Search Engine",
          description: "Index 10,000 document chunks into Qdrant/ChromaDB using OpenAI text-embedding-3 or HuggingFace embeddings, with hybrid sparse-dense filtering.",
          deliverables: ["Chunking pipeline", "Vector store indexing script", "Hybrid retrieval benchmark script"],
          rubric: ["Effective chunk overlap strategy", "Optimized index parameters (M, efSearch)", "Sub-50ms query latency"],
          quizQuestions: [
            {
              id: "q1",
              question: "Why is HNSW (Hierarchical Navigable Small World) widely favored over flat brute-force search?",
              options: [
                "HNSW has O(log N) search complexity vs O(N) linear scan",
                "HNSW reduces vector dimensionality to 2 dimensions",
                "HNSW converts dense embeddings into pure text tokens",
                "HNSW guarantees 100% exact mathematical nearest neighbors with zero index memory"
              ],
              correctIndex: 0,
              explanation: "HNSW builds a multi-layer graph providing logarithmic time approximate nearest neighbor search at huge scale."
            }
          ]
        },
        status: "locked"
      },
      {
        id: "node-3",
        title: "Advanced RAG & Context Engineering",
        description: "Implement Multi-Query Expansion, HyDE (Hypothetical Document Embeddings), Re-Ranking (Cohere/BGE), and contextual compression.",
        type: "course",
        difficulty: "Intermediate",
        estimatedHours: 22,
        prerequisites: ["node-2"],
        recommendationReason: "Standard naive RAG suffers from high hallucination and low recall. Advanced techniques ensure enterprise-grade accuracy.",
        skillsGained: ["RAG", "HyDE", "Cross-Encoder Re-Ranking", "Chunking Strategies"],
        resources: [
          {
            title: "LangChain Advanced Retrieval Strategies",
            url: "https://python.langchain.com/docs/modules/data_connection/retrievers/",
            platform: "Docs",
            free: true,
          },
          {
            title: "Building Production RAG Systems (Coursera)",
            url: "https://coursera.org",
            platform: "Coursera",
            free: false,
          }
        ],
        milestoneTask: {
          title: "Enterprise Multi-Source RAG Pipeline",
          description: "Build an end-to-end RAG system with Cohere Reranker, chunk citation attribution, and hallucination evaluation via Ragas.",
          deliverables: ["RAG query pipeline with HyDE", "Re-ranking stage integration", "Ragas evaluation report (>0.85 faithfulness)"],
          rubric: ["Accurate citation mapping", "Faithfulness benchmark", "Fallback handling when context is missing"],
          quizQuestions: [
            {
              id: "q1",
              question: "What is the key mechanism behind Hypothetical Document Embeddings (HyDE)?",
              options: [
                "Asking the LLM to generate a hypothetical answer first, then embedding that answer to retrieve real documents",
                "Encrypting documents before generating embeddings",
                "Compressing vector dimensions using autoencoders",
                "Deleting irrelevant words from user queries"
              ],
              correctIndex: 0,
              explanation: "HyDE uses an LLM to hallucinate a potential answer, which is often semantically closer to the target document chunks than the original terse question."
            }
          ]
        },
        status: "locked"
      },
      {
        id: "node-4",
        title: "Autonomous Agentic Workflows & Tool Calling",
        description: "Design multi-agent architectures using LangGraph and AutoGen with deterministic State Machines, Human-in-the-Loop, and structured function calling.",
        type: "project",
        difficulty: "Advanced",
        estimatedHours: 25,
        prerequisites: ["node-3"],
        recommendationReason: "Agents automate complex multi-step reasoning, executing code, web scraping, and database transactions autonomously.",
        skillsGained: ["LangGraph", "Tool Calling", "Multi-Agent Systems", "State Graphs"],
        resources: [
          {
            title: "LangGraph Multi-Agent Workflows Tutorial",
            url: "https://langchain-ai.github.io/langgraph/",
            platform: "Docs",
            free: true,
          },
          {
            title: "Building Reliable AI Agents (GitHub)",
            url: "https://github.com",
            platform: "GitHub",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Self-Reflective Research & Code Agent",
          description: "Develop a LangGraph multi-agent team (Planner, Coder, Reviewer) that iteratively solves algorithmic problems with automatic test validation.",
          deliverables: ["LangGraph cyclical state graph", "Sandboxed Python execution tool", "Memory checkpointing implementation"],
          rubric: ["Autonomous self-correction on test failure", "Deterministic exit condition", "State persistence across restarts"],
          quizQuestions: [
            {
              id: "q1",
              question: "Why are cyclical graphs (like LangGraph) superior to linear chains for autonomous agents?",
              options: [
                "They allow agents to loop back, reflect on errors, and retry until validation conditions pass",
                "They consume zero memory",
                "They run without needing an LLM model",
                "They guarantee O(1) response times"
              ],
              correctIndex: 0,
              explanation: "Cyclical state graphs permit loops for reflection, test execution, error handling, and multi-turn collaboration."
            }
          ]
        },
        status: "locked"
      },
      {
        id: "node-5",
        title: "LLM Observability, Evaluation & Production Guardrails",
        description: "Deploy guardrails with NeMo Guardrails/Llama-Guard, track traces via LangSmith/Arize Phoenix, and implement token cost optimization & latency caching.",
        type: "assessment",
        difficulty: "Advanced",
        estimatedHours: 20,
        prerequisites: ["node-4"],
        recommendationReason: "Crucial for securing enterprise deployments against prompt injections, data leakage, and runaway operational costs.",
        skillsGained: ["LangSmith", "NeMo Guardrails", "Prompt Injection Defense", "Semantic Caching"],
        resources: [
          {
            title: "LangSmith Tracing and Evaluation Guide",
            url: "https://docs.smith.langchain.com/",
            platform: "Docs",
            free: true,
          },
          {
            title: "OWASP Top 10 for Large Language Models",
            url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Production Guardrail & Benchmark Testbed",
          description: "Build a secure AI gateway with semantic Redis caching, PII redaction, prompt injection filtering, and automated golden dataset evaluation.",
          deliverables: ["Secured FastAPI proxy gateway", "Llama-Guard / regex safety filter", "Latency and cost benchmark report"],
          rubric: ["100% block rate on tested jailbreak prompts", "Cache hit response time under 10ms", "Structured trace logging"],
          quizQuestions: [
            {
              id: "q1",
              question: "What is the primary role of Semantic Caching (e.g. GPTCache / Redis Vector) in an enterprise LLM architecture?",
              options: [
                "Returning cached responses for queries with high cosine similarity, slashing API costs and latency",
                "Replacing the need for vector databases",
                "Translating Python code to Rust",
                "Training smaller language models"
              ],
              correctIndex: 0,
              explanation: "Semantic caching matches semantically equivalent user queries to previous LLM outputs, saving expensive inference calls and reducing response time to milliseconds."
            }
          ]
        },
        status: "locked"
      },
      {
        id: "node-6",
        title: "Fine-Tuning & Quantized Model Serving (LoRA / vLLM)",
        description: "Fine-tune open-weight models (Llama 3 / Mistral) using QLoRA with Unsloth / Hugging Face TRL and serve at scale with vLLM PagedAttention.",
        type: "project",
        difficulty: "Advanced",
        estimatedHours: 20,
        prerequisites: ["node-1", "node-5"],
        recommendationReason: "Enables domain-specific performance, proprietary data containment, and cost-efficient self-hosted inference.",
        skillsGained: ["QLoRA", "vLLM", "Hugging Face", "PagedAttention", "TRL"],
        resources: [
          {
            title: "vLLM: High-Throughput and Memory-Efficient LLM Serving",
            url: "https://docs.vllm.ai/en/latest/",
            platform: "Docs",
            free: true,
          },
          {
            title: "Hugging Face TRL (Transformer Reinforcement Learning)",
            url: "https://huggingface.co/docs/trl/index",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Custom Domain Model Fine-Tune & vLLM Cluster",
          description: "Fine-tune a 7B parameter model using LoRA on a custom instruction dataset, merge weights, and serve with vLLM continuous batching.",
          deliverables: ["Fine-tuning script with loss metrics", "Quantized GGUF / AWQ weights", "vLLM OpenAI-compatible server"],
          rubric: ["Smooth loss convergence", "Effective context throughput", "Proper GPU memory allocation"],
          quizQuestions: [
            {
              id: "q1",
              question: "How does PagedAttention in vLLM resolve GPU memory fragmentation during continuous batching?",
              options: [
                "By managing the KV cache in non-contiguous virtual memory blocks similar to OS virtual paging",
                "By removing the attention mechanism completely",
                "By downsampling embedding dimensions",
                "By running all calculations on CPU RAM"
              ],
              correctIndex: 0,
              explanation: "PagedAttention partitions the Key-Value (KV) cache into fixed-size memory blocks, eliminating almost all wasted memory from dynamic sequence lengths."
            }
          ]
        },
        status: "locked"
      }
    ],
    edges: [
      { id: "e1-2", source: "node-1", target: "node-2", animated: true },
      { id: "e2-3", source: "node-2", target: "node-3", animated: true },
      { id: "e3-4", source: "node-3", target: "node-4", animated: true },
      { id: "e4-5", source: "node-4", target: "node-5", animated: true },
      { id: "e1-6", source: "node-1", target: "node-6", animated: true },
      { id: "e5-6", source: "node-5", target: "node-6", animated: true }
    ]
  },
  {
    id: "fullstack-nextjs-cloud",
    userId: "catalog-system",
    title: "Full-Stack Next.js 15 & Cloud Architecture",
    targetGoal: "Full-Stack Developer",
    summary: "Complete blueprint for building high-performance modern web platforms using React 19, Server Components, TypeScript, Tailwind CSS, PostgreSQL/MongoDB, and Serverless deployment.",
    estimatedTotalHours: 95,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: "fn-1",
        title: "TypeScript Deep Dive & Modern JavaScript",
        description: "Master generic constraints, mapped types, conditional types, discriminated unions, and AST patterns.",
        type: "course",
        difficulty: "Beginner",
        estimatedHours: 12,
        prerequisites: [],
        recommendationReason: "Type safety is essential for robust full-stack enterprise codebases and reliable API contract sharing.",
        skillsGained: ["TypeScript", "Generics", "Type Narrowing", "Utility Types"],
        resources: [
          {
            title: "Total TypeScript by Matt Pocock",
            url: "https://www.totaltypescript.com/",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Type-Safe State Machine & Validation Engine",
          description: "Implement a zero-dependency type-safe schema validator with deep type inference similar to Zod.",
          deliverables: ["Inferrable schema builder", "Type guards and parser functions"],
          rubric: ["Exact type inference", "Descriptive compiler error reporting"]
        },
        status: "active"
      },
      {
        id: "fn-2",
        title: "React 19, Server Components & Server Actions",
        description: "Master React Server Components (RSC), Suspense streaming, `useOptimistic`, `useActionState`, and zero-client-bundle data fetching.",
        type: "course",
        difficulty: "Intermediate",
        estimatedHours: 20,
        prerequisites: ["fn-1"],
        recommendationReason: "Next.js App Router relies on RSC paradigms for optimal Core Web Vitals and secure server-first execution.",
        skillsGained: ["React 19", "RSC", "Server Actions", "Suspense", "Streaming"],
        resources: [
          {
            title: "React 19 Official Documentation",
            url: "https://react.dev/blog/2024/04/25/react-19",
            platform: "Docs",
            free: true,
          },
          {
            title: "Next.js App Router Foundations",
            url: "https://nextjs.org/docs/app",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Real-Time Streaming E-Commerce Dashboard",
          description: "Build an interactive dashboard with Suspense boundaries, parallel data fetching, and optimistic mutation server actions.",
          deliverables: ["Next.js App Router project", "Optimistic cart updates", "Streaming data tables with fallback skeletons"],
          rubric: ["Zero layout shift", "Optimistic rollbacks on error", "Optimal bundle size"]
        },
        status: "locked"
      },
      {
        id: "fn-3",
        title: "Database Modeling, ORM & Real-Time Sync",
        description: "Architect scalable schemas with Prisma/Mongoose, manage migration workflows, index optimization, and connection pooling.",
        type: "course",
        difficulty: "Intermediate",
        estimatedHours: 18,
        prerequisites: ["fn-2"],
        recommendationReason: "Crucial for preventing N+1 queries, race conditions, and deadlocks in multi-tenant SaaS applications.",
        skillsGained: ["PostgreSQL", "Mongoose", "Indexing", "Connection Pooling", "Transactions"],
        resources: [
          {
            title: "Database Indexing & Query Optimization",
            url: "https://use-the-index-luke.com/",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Multi-Tenant Transactional Ledger",
          description: "Implement ACID transactions with optimistic locking and indexed pagination handling 100k records.",
          deliverables: ["Database schema with relations", "Transaction-safe money transfer API", "Cursor pagination queries"],
          rubric: ["ACID isolation adherence", "No race condition overdraws", "Sub-20ms indexed queries"]
        },
        status: "locked"
      },
      {
        id: "fn-4",
        title: "Authentication, RBAC & Cloud Native CI/CD",
        description: "Implement Auth.js / Clerk authentication, Role-Based Access Control (RBAC), multi-factor auth, Docker containerization, and GitHub Actions CI/CD.",
        type: "project",
        difficulty: "Advanced",
        estimatedHours: 25,
        prerequisites: ["fn-3"],
        recommendationReason: "Production readiness requires ironclad security, automated testing gates, and continuous zero-downtime deployments.",
        skillsGained: ["Auth.js", "RBAC", "Docker", "GitHub Actions", "Security Headers"],
        resources: [
          {
            title: "Auth.js Documentation",
            url: "https://authjs.dev/",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Enterprise Multi-Tenant SaaS Boilerplate",
          description: "Deploy a production Next.js platform with RBAC permissions, audit logging, Docker container, and automated CI pipeline.",
          deliverables: ["Full GitHub repository", "Docker multi-stage buildfile", "Automated Playwright test pipeline"],
          rubric: ["Secure session tokens", "Protected server action middleware", "Passing CI workflow"]
        },
        status: "locked"
      },
      {
        id: "fn-5",
        title: "Full-Stack Capstone: Real-Time Collaborative Canvas",
        description: "Build an interactive collaborative multiplayer canvas app with WebSockets/WebRTC, CRDTs (Yjs), and edge deployment.",
        type: "project",
        difficulty: "Advanced",
        estimatedHours: 20,
        prerequisites: ["fn-4"],
        recommendationReason: "Demonstrates highest-tier proficiency across state synchronization, WebSockets, and complex UI rendering.",
        skillsGained: ["WebSockets", "CRDTs", "Yjs", "Edge Functions", "Live Multiplayer"],
        resources: [
          {
            title: "Yjs CRDTs Architecture",
            url: "https://docs.yjs.dev/",
            platform: "Docs",
            free: true,
          }
        ],
        milestoneTask: {
          title: "Multiplayer Whiteboard Platform",
          description: "Create a live shared canvas where multiple users draw and edit nodes concurrently with offline conflict resolution.",
          deliverables: ["Live collaborative canvas", "Yjs WebSocket provider backend", "Live cursor sync"],
          rubric: ["Zero data loss on conflict", "Smooth 60fps rendering", "Instant peer synchronization"]
        },
        status: "locked"
      }
    ],
    edges: [
      { id: "e-fn1-2", source: "fn-1", target: "fn-2", animated: true },
      { id: "e-fn2-3", source: "fn-2", target: "fn-3", animated: true },
      { id: "e-fn3-4", source: "fn-3", target: "fn-4", animated: true },
      { id: "e-fn4-5", source: "fn-4", target: "fn-5", animated: true }
    ]
  }
];
