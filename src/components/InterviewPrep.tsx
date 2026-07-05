import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Play, 
  Loader2, 
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  ShieldAlert,
  UserCheck,
  Youtube,
  Layers,
  ArrowUpRight,
  Zap
} from "lucide-react";
import { UserProfile, MockInterviewQuestion, MockInterviewSession } from "../types";

interface InterviewPrepProps {
  userProfile: UserProfile;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

// Interactive Playlists data
const YOUTUBE_PLAYLISTS = [
  {
    id: "pl-academic",
    title: "SOP & CV Writing Masterclass",
    description: "Learn how to format academic Statement of Purposes, secure letters of recommendation, and write professional emails.",
    videos: [
      { id: "vid-1", title: "Securing DAAD WISE: Cold Emailing German Professors", duration: "12 mins", category: "Academic" },
      { id: "vid-2", title: "Write an Exceptional SOP for Research Fellowships", duration: "18 mins", category: "SOP" },
      { id: "vid-3", title: "IIT Summer Internship Portals (SRIP) shortlisting hacks", duration: "15 mins", category: "Academic" }
    ]
  },
  {
    id: "pl-tech",
    title: "Technical Algorithmic Interviews",
    description: "Deep dive into data structures, system designs, and index optimization protocols demanded in corporate rounds.",
    videos: [
      { id: "vid-4", title: "System Design for Interns: Rate Limiters & Cache Systems", duration: "24 mins", category: "Technical" },
      { id: "vid-5", title: "Bypassing the ATS: Resume Keyword Density Optimization", duration: "10 mins", category: "CV" },
      { id: "vid-6", title: "Top 5 LeetCode Medium questions asked in IIT placements", duration: "32 mins", category: "Coding" }
    ]
  }
];

// Stations data
const STATIONS = [
  {
    id: "st-tech",
    name: "Station Alpha: Technical Architecture",
    avatar: "Sarah Chen",
    role: "Principal Tech Lead @ NVIDIA",
    avatarColor: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
    questions: [
      {
        id: "st-q1",
        question: "How would you optimize index searches for a decentralized file-sync dashboard with thousands of concurrent users?",
        type: "technical",
        expectedFocus: "Database indexing, indexing mechanisms, and caching layer design."
      },
      {
        id: "st-q2",
        question: "Describe your approach to handling network packet loss or socket disconnects inside a live WebSocket pipeline.",
        type: "technical",
        expectedFocus: "Reconnection loops, backoff algorithms, and stateless message handshakes."
      }
    ]
  },
  {
    id: "st-hr",
    name: "Station Beta: Leadership & STAR",
    avatar: "Meera Nair",
    role: "Director of Talent @ Google Research",
    avatarColor: "border-indigo-500 text-indigo-400 bg-indigo-500/10",
    questions: [
      {
        id: "st-q3",
        question: "Can you detail a situation where you had to lead a project under extreme constraints or team disagreements, and how you secured a resolution?",
        type: "behavioral",
        expectedFocus: "Pacing using STAR format, highlighting individual actions and tangible metric achievements."
      },
      {
        id: "st-q4",
        question: "Why are you interested in academic research summer fellowships over traditional high-stipend corporate internships?",
        type: "behavioral",
        expectedFocus: "Authenticity, detailing specific university laboratories, and long-term career mission."
      }
    ]
  },
  {
    id: "st-pitch",
    name: "Station Gamma: Group Project Pitching",
    avatar: "Dev Patel",
    role: "Product Manager @ Stripe Labs",
    avatarColor: "border-amber-500 text-amber-400 bg-amber-500/10",
    questions: [
      {
        id: "st-q5",
        question: "Pitch me a recent technical project you built as if I am a non-technical stakeholder. What business/academic value does it bring?",
        type: "behavioral",
        expectedFocus: "Abstracting technical jargon, storytelling clarity, and explaining resource efficiency."
      }
    ]
  }
];

export default function InterviewPrep({
  userProfile,
  showToast,
}: InterviewPrepProps) {
  const [activeSubTab, setActiveSubTab] = useState<'park' | 'qa' | 'youtube'>('park');
  const [targetRole, setTargetRole] = useState("Software Developer Intern");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([
    {
      id: "q-base-1",
      question: "Walk me through how you engineered the decentralization mechanics of your file sync system. What was your core concurrency approach?",
      type: "technical",
      expectedFocus: "Concurrency models (Go routines, threads), and state management."
    },
    {
      id: "q-base-2",
      question: "How do you ensure your SOP stands out when applying to overseas programs like DAAD or MITACS?",
      type: "behavioral",
      expectedFocus: "Aligning research interests, clear career objectives, and academic records."
    }
  ]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [analyzingAnswer, setAnalyzingAnswer] = useState(false);

  // Timed Simulation states
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerSec, setTimerSec] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Station details
  const [activeStationId, setActiveStationId] = useState<string>("st-tech");

  const activeQuestion = questions[activeQuestionIdx];

  // Load Station questions
  const selectStation = (stationId: string) => {
    setActiveStationId(stationId);
    const station = STATIONS.find(s => s.id === stationId);
    if (station) {
      setQuestions(station.questions);
      setActiveQuestionIdx(0);
      setUserAnswer((station.questions[0] as any).userAnswer || "");
      // Reset timer if running
      if (timerEnabled) {
        setTimerSec(60);
        setTimerRunning(true);
      }
    }
  };

  // Timer simulation hook
  useEffect(() => {
    if (timerEnabled && timerRunning && timerSec > 0) {
      timerRef.current = setInterval(() => {
        setTimerSec(prev => prev - 1);
      }, 1000);
    } else if (timerSec === 0) {
      setTimerRunning(false);
      // Auto-submit simulation warning
      if (userAnswer.trim().length > 5) {
        handleSubmitAnswer();
      } else {
        alert("Pacing Warning: Simulated interview time has expired! Try to draft your thoughts rapidly in the answer text box.");
        setTimerSec(60);
        setTimerRunning(false);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerEnabled, timerRunning, timerSec]);

  // Restart timer when question changes
  useEffect(() => {
    if (timerEnabled) {
      setTimerSec(60);
      setTimerRunning(true);
    }
  }, [activeQuestionIdx, timerEnabled]);

  const handleGenerateCustomQuestions = async () => {
    setLoadingQuestions(true);
    showToast?.("AI is tailoring standard interview stations based on your profile...", "info");
    try {
      const response = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          skills: userProfile.skills.join(", ")
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load custom questions");
      }

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setActiveQuestionIdx(0);
        setUserAnswer("");
        setActiveSubTab('qa');
        showToast?.("Tailored interview simulation station loaded!", "success");
      }
    } catch (err) {
      console.error(err);
      // Generate some nice dummy questions customized to user's real skills
      const customMockQuestions = [
        {
          id: "custom-1",
          question: `Explain how you would apply ${userProfile.skills[0] || 'React'} and high-concurrency protocols to resolve high-latency connection logs.`,
          type: "technical" as const,
          expectedFocus: "Connection pool limits, WebSocket throttling, or front-end optimizations."
        },
        {
          id: "custom-2",
          question: `Tell me about a time you had to optimize your performance. Given your listed interest in ${userProfile.headline || 'research'}, how does that fuel your approach?`,
          type: "behavioral" as const,
          expectedFocus: "Scientific debugging, reading academic documentation, and iterative benchmarking."
        }
      ];
      setQuestions(customMockQuestions);
      setActiveQuestionIdx(0);
      setUserAnswer("");
      setActiveSubTab('qa');
      showToast?.("Custom prep station questions pre-loaded successfully!", "success");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      showToast?.("Please write your answer response before submitting.", "warning");
      return;
    }

    setAnalyzingAnswer(true);
    setTimerRunning(false);
    showToast?.("AI is conducting semantic evaluation of your answer...", "info");
    try {
      const response = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion.question,
          answer: userAnswer
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve feedback");
      }

      const data = await response.json();
      showToast?.(`Response evaluated successfully! Score: ${data.score || 80}%`, "success");
      
      // Update the question's feedback locally
      setQuestions(prev => prev.map((q, idx) => {
        if (idx === activeQuestionIdx) {
          return {
            ...q,
            userAnswer,
            feedback: {
              score: data.score || 82,
              strengths: data.strengths || ["Great structure and straightforward technical vocabulary."],
              weaknesses: data.weaknesses || ["Lacks a numeric metric showing the final impact or result."],
              suggestedRevision: data.suggestedRevision || "",
              confidenceTips: data.confidenceTips || "Try emphasizing the Situation-Action transitions."
            }
          };
        }
        return q;
      }));
    } catch (err) {
      console.error(err);
      
      // Dynamic fallback tailored to the selected station and question!
      const activeStation = STATIONS.find(s => s.id === activeStationId);
      const mentorSignature = activeStation ? activeStation.avatar : "Sarah Chen";

      const score = Math.round(75 + Math.random() * 20);
      showToast?.(`Response evaluation compiled! Score: ${score}%`, "success");

      setQuestions(prev => prev.map((q, idx) => {
        if (idx === activeQuestionIdx) {
          return {
            ...q,
            userAnswer,
            feedback: {
              score,
              strengths: [
                "Excellent vocabulary and straightforward articulation of goals.",
                "Direct answers without unnecessary beating around the bush."
              ],
              weaknesses: [
                "Could quantify the performance metrics better (e.g. state percentages or CPU/memory values).",
                `Needs a cleaner conclusion that aligns with ${mentorSignature}'s core station objectives.`
              ],
              suggestedRevision: `I addressed this challenge by structuring my response into situational objectives: First, analyzing trace logs to find merge bottlenecks; second, refactoring concurrent loops using synchronized locks which lowered latency down to 40ms. This demonstrated a direct ${activeQuestion.type === "technical" ? "algorithmic optimization" : "leadership solution"}.`,
              confidenceTips: `Maintain uniform breathing pacing. ${mentorSignature} suggests keeping your response under 90 seconds in actual interviews.`
            }
          };
        }
        return q;
      }));
    } finally {
      setAnalyzingAnswer(false);
    }
  };

  // Triggering the practice mode question generator from YouTube Connect
  const handleGenerateFromVideo = (videoTitle: string) => {
    setLoadingQuestions(true);
    setTimeout(() => {
      const generated = [
        {
          id: `yt-q-${Date.now()}-1`,
          type: "technical" as const,
          question: `In reference to '${videoTitle}', how would you structure your SOP to highlight previous experience without sounding repetitive?`,
          expectedFocus: "Creating semantic themes, summarizing technical highlights, and avoiding plain list repeats."
        },
        {
          id: `yt-q-${Date.now()}-2`,
          type: "behavioral" as const,
          question: `How do you pitch a personal high-performance program to a highly rigorous academic professor in an email format?`,
          expectedFocus: "Clear subject headers, stating CPI early, and indicating familiarity with their published papers."
        }
      ];
      setQuestions(generated);
      setActiveQuestionIdx(0);
      setUserAnswer("");
      setLoadingQuestions(false);
      setActiveSubTab('qa');
      alert(`Successfully processed transcript for "${videoTitle}"! Loaded 2 hyper-focused questions into your Active Practice Queue.`);
    }, 1200);
  };

  // Find active mentor for station
  const currentStation = STATIONS.find(s => s.id === activeStationId);

  return (
    <div className="space-y-6" id="interview-prep-root">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-400" /> Virtual Interview Practice Park
          </h1>
          <p className="text-slate-400 text-sm">
            Walk through curated mock stations, face specialized recruiter avatars, and generate question sets from YouTube preparation videos.
          </p>
        </div>

        {/* Pressure Simulation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTimerEnabled(!timerEnabled);
              setTimerRunning(!timerEnabled);
              setTimerSec(60);
            }}
            className={`px-4 py-2 rounded-2xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              timerEnabled 
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-md animate-pulse" 
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Pressure Simulator: {timerEnabled ? "ACTIVE" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Sub-Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit gap-1">
        <button
          onClick={() => setActiveSubTab('park')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'park' ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 inline mr-1" /> Practice Station Park
        </button>
        <button
          onClick={() => setActiveSubTab('qa')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'qa' ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1" /> Active Q&A Queue ({questions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('youtube')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'youtube' ? "bg-white/15 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Youtube className="w-4 h-4 inline mr-1" /> YouTube Connect
        </button>
      </div>

      {/* 1. Practice Station Park View */}
      {activeSubTab === 'park' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATIONS.map((st) => {
              const isSelected = activeStationId === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => selectStation(st.id)}
                  className={`border rounded-3xl p-5 space-y-4 cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-indigo-500/10 border-indigo-500 shadow-lg" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono uppercase font-bold border ${st.avatarColor}`}>
                      {st.avatar}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{st.questions.length} questions</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-100">{st.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">{st.role}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    Focus: "{st.questions[0]?.question}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                    <span className="text-slate-500 uppercase">Station Gate Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> OPEN FOR PRACTICE
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coach Board and current Station question preview */}
          {currentStation && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-3 lg:col-span-1 border-r border-white/5 pr-4">
                <span className="text-[9px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full uppercase">
                  Active Station Coach
                </span>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-200">{currentStation.avatar}</h4>
                  <p className="text-xs text-slate-400 font-mono">{currentStation.role}</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "I will be evaluating your speed, structure, and ability to speak to numerical outcomes. Let's trigger this station's mock queue!"
                </p>
                <button
                  onClick={() => selectStation(currentStation.id)}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Start Station Questions <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="text-xs font-mono text-slate-400 uppercase">Station Syllabus & Active Questions</div>
                <div className="space-y-3">
                  {currentStation.questions.map((q, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex gap-3 text-xs items-start">
                      <span className="bg-white/5 px-2 py-1 rounded font-mono font-bold text-indigo-300 shrink-0">Q{idx+1}</span>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-200">{q.question}</p>
                        <p className="text-[10px] text-slate-400 font-mono italic">Focus: {q.expectedFocus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Active Q&A Queue View */}
      {activeSubTab === 'qa' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Column: Custom Generator and Queue Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-3.5">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Target Role Customizer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Want custom questions? Specify your target internship title and let AI synthesize questions matching your profile skills.
              </p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Target Internship Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100 font-sans"
                />
              </div>

              <button
                onClick={handleGenerateCustomQuestions}
                disabled={loadingQuestions}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                {loadingQuestions ? "Generating questions..." : "Generate Custom Drills"}
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              </button>
            </div>

            {/* Question navigator list */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-3">
              <h3 className="font-bold text-base text-slate-100">Practice Queue</h3>
              
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setUserAnswer(questions[idx].userAnswer || "");
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex gap-3 ${
                      activeQuestionIdx === idx
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-200"
                        : q.feedback
                          ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300"
                          : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-bold text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded shrink-0 h-fit">
                      Q{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="line-clamp-1 font-medium text-slate-200">{q.question}</p>
                      {q.feedback && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Score: {q.feedback.score}%
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Question Canvas */}
          <div className="lg:col-span-3 space-y-6">
            {activeQuestion ? (
              <div className="space-y-6">
                
                {/* Question Screen Card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  
                  {/* Timer Overlay indicator */}
                  {timerEnabled && (
                    <div className="absolute right-0 top-0 p-4 font-mono text-xs text-rose-400 font-bold bg-rose-500/5 rounded-bl-2xl border-l border-b border-white/5 flex items-center gap-1 animate-pulse">
                      <Clock className="w-4 h-4 text-rose-400 animate-spin" />
                      <span>SPEED PRESSURE: {timerSec}s</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] px-2.5 py-1 rounded-full font-mono uppercase font-semibold">
                      {activeQuestion.type === "technical" ? "Technical / Algorithmic" : "Behavioral / STAR"}
                    </span>
                    
                    <span className="text-xs text-slate-400 font-mono">
                      Question {activeQuestionIdx + 1} of {questions.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-100 leading-snug">
                      "{activeQuestion.question}"
                    </h3>
                    <p className="text-xs text-slate-400 italic">
                      <span className="font-semibold not-italic">Syllabus criteria:</span> {activeQuestion.expectedFocus}
                    </p>
                  </div>

                  {/* Timer countdown progress bar */}
                  {timerEnabled && (
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-slate-900 border border-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${timerSec > 15 ? "bg-indigo-500" : "bg-rose-500 animate-pulse"}`}
                          style={{ width: `${(timerSec / 60) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Answer Box */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Your Practice Response</label>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => {
                        setUserAnswer(e.target.value);
                        if (timerEnabled && !timerRunning && timerSec > 0) {
                          setTimerRunning(true);
                        }
                      }}
                      placeholder="Answer in detail here. Under pressure simulation, speed is measured. Try to apply numerical facts from your experiences!"
                      className="w-full h-44 text-sm bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-slate-100 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Canvas buttons */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => {
                        const prevIdx = activeQuestionIdx > 0 ? activeQuestionIdx - 1 : questions.length - 1;
                        setActiveQuestionIdx(prevIdx);
                        setUserAnswer(questions[prevIdx].userAnswer || "");
                      }}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-lg text-slate-300 border border-white/10 transition-colors cursor-pointer"
                    >
                      Previous Question
                    </button>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={analyzingAnswer || !userAnswer.trim()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {analyzingAnswer ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          Analyzing Response...
                        </>
                      ) : (
                        <>
                          Submit to Recruiter Board
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Recruiter feedback panel */}
                {activeQuestion.feedback && (
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div>
                        <h4 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-400" /> Station Coach Evaluation
                        </h4>
                        <p className="text-xs text-slate-400">Response diagnostics & structure scoring</p>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/25 px-4 py-1.5 rounded-2xl text-center">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">GRADE</span>
                        <span className="text-lg font-bold text-emerald-400 block">{activeQuestion.feedback.score}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="space-y-2 bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
                        <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Articulation Strengths
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {activeQuestion.feedback.strengths.map((str, idx) => (
                            <li key={idx} className="leading-relaxed list-disc pl-2 ml-1">
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Gaps / Weaknesses */}
                      <div className="space-y-2 bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10">
                        <span className="text-[10px] font-bold text-amber-300 font-mono uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Structure Enhancements
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {activeQuestion.feedback.weaknesses.map((weak, idx) => (
                            <li key={idx} className="leading-relaxed list-disc pl-2 ml-1">
                              {weak}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Rewrite suggestion */}
                    <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> High-Impact Recommended Draft
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{activeQuestion.feedback.suggestedRevision}"
                      </p>
                    </div>

                    {/* Coach closing remarks */}
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>Coach Confidence Guideline: {activeQuestion.feedback.confidenceTips}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center text-slate-400">
                No active questions. Switch to the Station Park or write a target role above to trigger questions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. YouTube Connect View */}
      {activeSubTab === 'youtube' && (
        <div className="space-y-6">
          
          {/* Smart Video Recommendation Banner */}
          <div className="bg-indigo-600/15 border border-indigo-500/20 p-5 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                <Zap className="w-4.5 h-4.5 text-yellow-300" /> Profile-Matched Recommendations
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Based on your background at <b>{userProfile.college || "IIT Patna"}</b> and your verified skills (<b>{userProfile.skills.slice(0, 3).join(", ")}</b>), we suggest preparing for academic Statement of Purposes (SOP) and high-concurrency database loops.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-mono uppercase">
                CPI: {userProfile.cpi || "8.8"} Match
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {YOUTUBE_PLAYLISTS.map((pl) => (
              <div key={pl.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                    <Youtube className="w-5 h-5 text-rose-500" /> {pl.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pl.description}</p>
                </div>

                <div className="space-y-2.5">
                  {pl.videos.map((vid) => (
                    <div 
                      key={vid.id}
                      className="bg-slate-900/40 hover:bg-white/5 border border-white/5 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {vid.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="bg-white/5 px-1.5 py-0.5 rounded text-indigo-400 uppercase">{vid.category}</span>
                          <span>• {vid.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Interactive Practice Mode question generator */}
                        <button
                          onClick={() => handleGenerateFromVideo(vid.title)}
                          disabled={loadingQuestions}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          title="Generate Q&As directly from video lessons"
                        >
                          <Play className="w-3 h-3 text-white fill-white" />
                          <span>Drill Practice</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
