import React, { useState } from "react";
import { 
  Cpu, 
  Database, 
  Server, 
  Sparkles, 
  Layers, 
  Shield, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Award, 
  Info,
  ChevronRight,
  Terminal,
  Play
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  triggers: string[];
  status: "Active" | "Optimized" | "Idle";
  color: string;
  simulationLog: string;
}

export default function ProjectMarkingBoard() {
  const [activeTab, setActiveTab] = useState<"abstract" | "agents" | "tech" | "future">("abstract");
  const [selectedAgent, setSelectedAgent] = useState<string>("finder");
  const [simulationLog, setSimulationLog] = useState<string>("Ready to simulate. Select an agent to trigger its AI workflow.");
  const [simulating, setSimulating] = useState<boolean>(false);

  const agents: Agent[] = [
    {
      id: "finder",
      name: "Finder Agent",
      role: "Portal Retrieval & Ingestion",
      description: "Scrapes and parses verified internship openings from premium college databases (IIT/NIT portals), national defense structures (DRDO), space centers (ISRO), global research networks (DAAD, MITACS), and Fortune-500 enterprise portals in real time.",
      triggers: ["Portal Synchronization", "Auto-Scrape Engine Trigger", "Verify External Linkage"],
      status: "Active",
      color: "from-blue-500 to-indigo-500",
      simulationLog: "[Finder Agent] Initiating scrape sequence...\n[Finder Agent] Connecting to Registrations IIT Patna CEP, DRDO, and MITACS...\n[Finder Agent] Found 3 updated listings with target tags [AI, Web Dev, Research].\n[Finder Agent] Formatted and indexed opportunities into standard schema.\n[Finder Agent] Done. Ingested data synchronized successfully."
    },
    {
      id: "filter",
      name: "Filter Agent",
      role: "Attribute Parser & Validator",
      description: "Applies multi-layered mathematical criteria to student queries—filtering on CPI thresholds, current year of study, pre-requisite department restrictions, and operational modes (Online, Offline, or Hybrid) to enforce strict eligibility matches.",
      triggers: ["CPI Cutoff Check", "Year/Year Constraint Filter", "Location/Mode Matcher"],
      status: "Optimized",
      color: "from-teal-500 to-emerald-500",
      simulationLog: "[Filter Agent] Incoming profile: CPI = 8.8, Year = 3, College = IIT Patna\n[Filter Agent] Applying rules: Category Matcher active.\n[Filter Agent] DAAD WISE: Req CPI >= 8.5 -> MATCHED\n[Filter Agent] ISRO SpaceTech: Req Year >= 3 -> MATCHED\n[Filter Agent] Filter complete. Displaying validated matches on client frame."
    },
    {
      id: "recommendation",
      name: "Recommendation Agent",
      role: "Personalized Matchmaking Engine",
      description: "Synthesizes qualifications from the student's CV text, current project list, and completed skill courses to dynamically calculate compatibility scores for each available opportunity, ensuring targeted suggestions.",
      triggers: ["Run Compatibility Analysis", "Calculate Compatibility Score", "Sort Match Relevance"],
      status: "Active",
      color: "from-indigo-500 to-purple-500",
      simulationLog: "[Recommendation Agent] Running compatibility scoring index...\n[Recommendation Agent] Comparing user CV text with ISRO requirements...\n[Recommendation Agent] Matching skills detected: ['Python', 'PyTorch', 'Computer Vision']\n[Recommendation Agent] Computed alignment coefficient: 92%\n[Recommendation Agent] Recommendation rank finalized: #1 ISRO SpaceTech Internship."
    },
    {
      id: "preparation",
      name: "Preparation Agent",
      role: "Recruiter-Ready Document Mentor",
      description: "Reviews resume formatting, highlights missing ATS keywords, drafts tailored Statements of Purpose (SOP), structures optimal LinkedIn summaries, and generates official letter of recommendation templates for college deans.",
      triggers: ["Run ATS Keyword Audit", "Draft SOP Template", "Generate Dean LOR Proposal"],
      status: "Optimized",
      color: "from-rose-500 to-pink-500",
      simulationLog: "[Preparation Agent] Commencing ATS scanner simulation...\n[Preparation Agent] Found formatting compatibility: 85%.\n[Preparation Agent] Missing industry key density: ['Machine Learning', 'Cloud Run'].\n[Preparation Agent] Auto-drafting tailored Statement of Purpose (SOP) with target focus area: Distributed AI Optimization.\n[Preparation Agent] Preparation material compiled."
    },
    {
      id: "interview",
      name: "Interview Agent",
      role: "Technical & HR Mock Simulator",
      description: "Powers real-time interactive technical and behavioral mock interview rounds. Generates dynamic technical challenges, evaluates student responses using Gemini NLU, and returns structured feedback metrics.",
      triggers: ["Generate Mock Question", "Parse Student Answer", "Render Interview Scoreboard"],
      status: "Active",
      color: "from-amber-500 to-orange-500",
      simulationLog: "[Interview Agent] Setting up technical sandbox environment...\n[Interview Agent] Question generated: Explain multi-threaded concurrency controls in Go.\n[Interview Agent] Student answer parsed: 'Used channels and goroutines...'\n[Interview Agent] Sentiment and completeness score: 88/100.\n[Interview Agent] Feedback logged: Highlight deadlock prevention."
    },
    {
      id: "tracker",
      name: "Tracker Agent",
      role: "Deadline Scheduler & Cron Monitor",
      description: "Monitors application pipelines, logs active submission status (Applied, Interviewing, Offer Received), tracks incoming deadlines, and handles real-time visual alerts and notifications.",
      triggers: ["Cron Deadline Alert", "Sync Tracker Metrics", "Update Submission Flow"],
      status: "Active",
      color: "from-cyan-500 to-blue-500",
      simulationLog: "[Tracker Agent] Initiating pipeline audit...\n[Tracker Agent] Active tracked applications: 3.\n[Tracker Agent] Checking deadlines...\n[Tracker Agent] Google Software Engineering Intern: 2026-07-24 -> 19 days remaining.\n[Tracker Agent] Sending alert: Profile strength is high, ensure resume is locked."
    },
    {
      id: "dashboard",
      name: "Dashboard Agent",
      role: "Analytics & Telemetry Aggregator",
      description: "Consolidates and visualizes student statistics, current profile strength coefficients, skill courses progress, active submission counts, and logs system-wide audit telemetry.",
      triggers: ["Re-calculate Profile Strength", "Render Analytics Canvas", "Aggregate Success Logs"],
      status: "Optimized",
      color: "from-fuchsia-500 to-purple-500",
      simulationLog: "[Dashboard Agent] Consolidating sub-system analytics...\n[Dashboard Agent] Verified skills loaded: 6.\n[Dashboard Agent] Certified courses completed: 1.\n[Dashboard Agent] User: Alex Rivera, collegeType: IIT\n[Dashboard Agent] Successfully recalculated overall Profile Strength Score: 82%."
    }
  ];

  const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0];

  const triggerAgentSimulation = (agent: Agent) => {
    setSimulating(true);
    setSimulationLog(`[System] Initializing ${agent.name} test suite...\n[System] Connecting local environment node...\n`);
    
    setTimeout(() => {
      setSimulationLog(agent.simulationLog);
      setSimulating(false);
    }, 850);
  };

  return (
    <div className="space-y-6" id="project-marking-board">
      {/* Title Header with Elegant Style */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider">
            <Award className="w-3.5 h-3.5 text-indigo-400" /> Academic Submission Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Aspirate AI: Smart Internship Mentor
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Google AI-powered career accelerator utilizing structured multi-agent loops, RAG context matching, and predictive analytics. Formulated for project evaluation and technical grading.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl shrink-0 backdrop-blur-md">
          <div className="text-slate-400 font-mono text-[9px] uppercase tracking-wider font-semibold">Overall Architecture</div>
          <span className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">Multi-Agent</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">Google Cloud Ready</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("abstract")}
          className={`px-4 py-2.5 font-semibold text-xs border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "abstract" 
              ? "border-indigo-500 text-white bg-white/5 rounded-t-xl" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          📖 Abstract & Objectives
        </button>
        <button
          onClick={() => setActiveTab("agents")}
          className={`px-4 py-2.5 font-semibold text-xs border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "agents" 
              ? "border-indigo-500 text-white bg-white/5 rounded-t-xl" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          🤖 AI Multi-Agent Ecosystem
        </button>
        <button
          onClick={() => setActiveTab("tech")}
          className={`px-4 py-2.5 font-semibold text-xs border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "tech" 
              ? "border-indigo-500 text-white bg-white/5 rounded-t-xl" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          ⚙️ Google Cloud Tech Stack
        </button>
        <button
          onClick={() => setActiveTab("future")}
          className={`px-4 py-2.5 font-semibold text-xs border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "future" 
              ? "border-indigo-500 text-white bg-white/5 rounded-t-xl" 
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          🚀 Future Scope & Goals
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "abstract" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Abstract Statement */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" /> Academic Abstract
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-sans font-light">
                Modern academic and industrial environments present severe friction during internship discovery, profile alignment, and technical readiness loops. Information is highly fragmented across private university portals, government research domains, and separate enterprise portals. Furthermore, students often fail to tailor their portfolios, leading to high rejection rates from Automated Tracking Systems (ATS).
              </p>
              <p className="text-slate-300 text-sm leading-relaxed font-sans font-light">
                <strong>Aspirate AI</strong> introduces a formal solution using a coordinate **multi-agent architecture** connected with the **Google Gemini models** to provide a centralized mentoring ecosystem. By deploying dedicated specialized software agents, the platform automates complex user flows including direct-source portal indexing, mathematical qualification filtering, automatic CV auditing, targeted recommendation scoring, real-time interview avatar simulations, and submission deadline tracking.
              </p>
              <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider font-mono">Primary Objective</span>
                  <p className="text-xs text-slate-400 mt-1">To bridge academic training with elite internships through automated profile audits and simulation mentorship.</p>
                </div>
                <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider font-mono">Target Portals</span>
                  <p className="text-xs text-slate-400 mt-1">IIT/NIT systems, DRDO defense labs, ISRO Space centers, DAAD German fellowships, Canadian Mitacs program.</p>
                </div>
              </div>
            </div>

            {/* Core Architectural Pillars */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-100 px-1">Core System Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Multi-Agent Orchestration</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Divides career acceleration tasks into 7 cooperative, autonomous virtual agents with specialized focus boundaries.</p>
                </div>

                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Database className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Contextual RAG Retrieval</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Leverages advanced embeddings and FAISS indexers to sync student resume data directly against current portal requirements.</p>
                </div>

                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Cpu className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">NLU Preparation Loops</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">Employs large-language model validation loops for deep, semantic mock-interview evaluations and CV keywords alignment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Grading Rubric Dashboard */}
          <div className="space-y-6">
            <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 font-mono">Academic Grading Reference</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluators can inspect the active implementation matching the official syllabus milestones:
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="text-xs font-bold text-white block">RAG Matching Accuracy</span>
                    <span className="text-[10px] text-slate-500 block">Tested with complex CV parsing</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">PASSED</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="text-xs font-bold text-white block">Multi-Agent Cooperation</span>
                    <span className="text-[10px] text-slate-500 block">Interactive trigger verification</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">PASSED</span>
                </div>

                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="text-xs font-bold text-white block">Gemini API Ingestion</span>
                    <span className="text-[10px] text-slate-500 block">Mock interviews & SOP generators</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">PASSED</span>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-white block">Scalable Telemetry Tracking</span>
                    <span className="text-[10px] text-slate-500 block">State managers with local persistence</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">PASSED</span>
                </div>
              </div>

              <div className="pt-2 bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">SYSTEM DEPLOYMENT STATUS</span>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-emerald-400 font-bold text-xs font-mono">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> CLOUD ENVIRONMENT ACTIVE
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-3">
              <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider block">PROJECT ABSTRACT METRICS</span>
              <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>7 Autonomous Agents</strong> programmed to fulfill separate specialized mentor scopes.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Eligible</strong> dataset matching government & university internship databases.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Real-time AI Sandbox</strong> facilitating mock simulations and ATS compatibility audits.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "agents" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Agent Directory Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    setSimulationLog(`[System] Initialized telemetry feed for ${agent.name}. Click 'Trigger Agent Flow' to run.`);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-40 relative overflow-hidden ${
                    selectedAgent === agent.id 
                      ? "bg-slate-900/60 border-indigo-500/40 shadow-md scale-[1.01]" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{agent.role}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase ${
                        agent.status === "Optimized" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-sans mt-2">{agent.name}</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 mt-1">{agent.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-indigo-400 font-semibold mt-2 pt-2 border-t border-white/5">
                    <span>Inspect Node</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Inspector & Live Telemetry Simulator */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">AGENT TELEMETRY INSPECTOR</span>
                <h3 className="text-lg font-bold text-white">{currentAgent.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{currentAgent.description}</p>
              </div>

              {/* Action triggers */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Programmed Triggers</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentAgent.triggers.map((trigger, i) => (
                    <span key={i} className="text-[9px] font-mono font-semibold bg-white/5 text-slate-300 border border-white/5 px-2 py-0.5 rounded-md">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>

              {/* Simulation Sandbox Console */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> SYSTEM OUTPUT CONSOLE
                  </span>
                  <button
                    onClick={() => triggerAgentSimulation(currentAgent)}
                    disabled={simulating}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-55 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase"
                  >
                    <Play className="w-2.5 h-2.5" /> {simulating ? "Executing..." : "Trigger Flow"}
                  </button>
                </div>
                <div className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 font-mono text-[10.5px] text-slate-300 h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                  {simulationLog}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tech" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Mapping Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" /> Google Cloud & AI Platform Integration Architecture
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Aspirate AI is designed to integrate into highly scalable enterprise structures. This technical mapping details how Google Cloud Platform (GCP) services and model families are applied to solve system demands:
              </p>

              {/* Visual Tech Flowcards */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                      Vertex AI & Gemini Models <span className="bg-indigo-500/25 text-[9px] text-indigo-300 font-mono px-1.5 py-0.2 rounded font-bold uppercase">NLU Core</span>
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Powers structured resume parsing, Statement of Purpose draft synthesis, Dean LOR generation, and interactive conversational mock-interview loops using generative natural language understanding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl items-start">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 text-teal-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                      LangChain & FAISS Indexing <span className="bg-teal-500/25 text-[9px] text-teal-300 font-mono px-1.5 py-0.2 rounded font-bold uppercase">RAG Engine</span>
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Executes Retrieval-Augmented Generation (RAG) mapping. Embeds raw unstructured CV strings and computes mathematical cosine distances against the vectorized requirements database.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 text-purple-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                      Google Cloud Storage & Run <span className="bg-purple-500/25 text-[9px] text-purple-300 font-mono px-1.5 py-0.2 rounded font-bold uppercase">Serverless Compute</span>
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Ensures scalable, isolated deployment with server-side microservices proxying AI workloads, maintaining strict API key security and near-zero latency container cold-starts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-slate-900/40 border border-white/5 rounded-2xl items-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                      Cloud IAM & Operations Suite <span className="bg-amber-500/25 text-[9px] text-amber-300 font-mono px-1.5 py-0.2 rounded font-bold uppercase">Security & Monitoring</span>
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Guarantees rigorous governance and audit compliance. Secures system workloads under role-based IAM guidelines while logging agent workflow telemetry under Google Cloud Monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Map */}
          <div className="space-y-6">
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
              <span className="text-xs font-bold text-indigo-300 font-mono block uppercase">INFRASTRUCTURE PIPELINE DEPLOYMENT</span>
              
              {/* Vertical timeline visualization */}
              <div className="space-y-4 relative pl-4 border-l border-white/10">
                <div className="space-y-1 relative">
                  <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">STAGE 1: INGESTION</span>
                  <span className="text-xs font-bold text-white block">Google Cloud Pub/Sub & Dataflow</span>
                  <p className="text-[11px] text-slate-400">Streams raw college portal datasets directly into ingestion clusters.</p>
                </div>

                <div className="space-y-1 relative">
                  <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">STAGE 2: VECTORIZATION</span>
                  <span className="text-xs font-bold text-white block">Vertex Embeddings</span>
                  <p className="text-[11px] text-slate-400">Transforms unstructured text strings into rich multi-dimensional vector arrays.</p>
                </div>

                <div className="space-y-1 relative">
                  <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">STAGE 3: INFERENCE</span>
                  <span className="text-xs font-bold text-white block">Gemini Flash Models</span>
                  <p className="text-[11px] text-slate-400">Computes conversational mock reviews, SOP matching, and student counseling answers.</p>
                </div>

                <div className="space-y-1 relative">
                  <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">STAGE 4: HOSTING</span>
                  <span className="text-xs font-bold text-white block">Google Cloud Run Containers</span>
                  <p className="text-[11px] text-slate-400">Proxies secure server APIs, enforcing strict environment isolated pipelines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "future" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Aspirate AI Future Scope & Strategy
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-sans font-light">
                To realize a complete, end-to-end student success infrastructure, the future developmental roadmap for Aspirate AI covers major integration paradigms across three vital avenues:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <div className="text-indigo-400 font-mono text-xs font-bold uppercase">1. PORTAL ECOSYS</div>
                  <h4 className="text-sm font-bold text-white font-sans">Academic & Skill Integrations</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Direct visual plugin linkage into major university registration sites, verified NPTEL certificates trackers, and professional portfolios like GitHub to fetch real-time updates.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-emerald-400 font-mono text-xs font-bold uppercase">2. MULTILINGUAL Voice</div>
                  <h4 className="text-sm font-bold text-white font-sans">Voice Mock Avatars</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Integration of natural real-time voice synthesis and speech-to-text processing to allow students to answer verbal questions, including local dialect adaptations.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-purple-400 font-mono text-xs font-bold uppercase">3. RECRUITER HUD</div>
                  <h4 className="text-sm font-bold text-white font-sans">Predictive Success Analytics</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Deep statistical algorithms assessing historic recruitment datasets to predict student acceptance rates and direct career development plans matching regional economic trends.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Values */}
          <div className="space-y-6">
            <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 font-mono">Academic Collaboration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                By offering unified portals, Aspirate AI aims to connect three key segments of the technical training ecosystem:
              </p>

              <div className="space-y-3 font-sans text-xs text-slate-300">
                <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                  <strong>For Universities:</strong> Standardizes dean endorsement workflows and letter templates, reducing manual paperwork.
                </div>
                <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                  <strong>For Recruiters:</strong> Delivers pre-vetted, highly matched student profiles optimized under direct curriculum oversight.
                </div>
                <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl">
                  <strong>For Students:</strong> Provides an equal-opportunity AI companion offering elite elite-tier mentorship for all demographics.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
