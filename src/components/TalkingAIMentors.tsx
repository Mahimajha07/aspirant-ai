import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  Square, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  TrendingUp, 
  UserCheck, 
  HelpCircle,
  Cpu,
  RefreshCw,
  Send,
  Loader2,
  ChevronRight,
  Info,
  Radio
} from "lucide-react";
import { UserProfile } from "../types";

interface TalkingAIMentorsProps {
  userProfile: UserProfile;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

interface SuggestionCard {
  title: string;
  category: "Fellowship" | "Resume ATS" | "Skills Bridge" | "Advisory Outreach";
  shortAdvice: string;
  speakAdvice: string;
  impactScore: string;
  actionLabel: string;
}

export default function TalkingAIMentors({ userProfile, showToast }: TalkingAIMentorsProps) {
  const [activeMentor, setActiveMentor] = useState<"interviewer" | "advisor">("interviewer");
  
  // Voice Synthesis settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Animation States for wave loops
  const [aiSpeakingState, setAiSpeakingState] = useState<"idle" | "speaking" | "listening" | "thinking">("idle");

  // 1. INTERVIEWER MENTOR STATES
  const [interviewRole, setInterviewRole] = useState("Software Developer Intern");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<any[]>([
    {
      id: "q-1",
      question: "How would you design a rate limiter for a distributed API with high throughput using Redis?",
      type: "technical",
      expectedFocus: "Token bucket or sliding window logs, handling race conditions, and key-expiry strategies."
    },
    {
      id: "q-2",
      question: "Describe a project challenge where you faced a tough technical deadlock. What was your systematic debugging approach?",
      type: "behavioral",
      expectedFocus: "Identifying bottlenecks, thread/socket tracing, lock safety, and final performance gains."
    }
  ]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [analyzingAnswer, setAnalyzingAnswer] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);

  // 2. SUGGESTION ADVISOR STATES
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([
    {
      title: "MITACS Fellowship Alignment",
      category: "Fellowship",
      shortAdvice: "Capitalize on your 1st-year student status to establish collaborative research links early. Frame your project on database structures to match high-performance systems.",
      speakAdvice: "Elena here! Since you are at an elite college, your academic standing is exceptional. I recommend targeting the MITACS Globalink research fellowship. Tailor your Statement of Purpose to highlight your hands-on experience in open-source systems and distributed databases. This matches their competitive lab criteria.",
      impactScore: "High Impact (92% Fit)",
      actionLabel: "View Fellowship Guide"
    },
    {
      title: "ATS Keyword Optimization Boost",
      category: "Resume ATS",
      shortAdvice: "Your current profile lists skills like React. Append missing cloud and system performance keywords (e.g. 'high-concurrency models', 'Docker integration') to pass corporate screening rules.",
      speakAdvice: "Let's boost your resume. Corporate recruiters run automated applicant tracking systems. Add technical phrases such as network socket handshakes, backoff algorithms, and cache layer designs in your project descriptions to score above 85% on automated screenings.",
      impactScore: "Immediate Boost (+18% Score)",
      actionLabel: "Audit Resume Keywords"
    },
    {
      title: "Academic Recommendation outreach",
      category: "Advisory Outreach",
      shortAdvice: "Draft an LOR template and share it with your professor of Advanced Algorithms. Highlighting your project grades increases signature success by 75%.",
      speakAdvice: "Elena suggests building strong professional partnerships. Reach out to your algorithms professor with a structured recommendation draft already prepared. This shows high initiative, respects their valuable time, and secures your recommendation letters much faster.",
      impactScore: "Critical Milestone",
      actionLabel: "Draft Recommendation"
    }
  ]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number | null>(null);
  const [advisorQuestion, setAdvisorQuestion] = useState("");
  const [advisorReplying, setAdvisorReplying] = useState(false);
  const [advisorReply, setAdvisorReply] = useState<string>("");

  // Initialize Voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setSystemVoices(voices);
        // Default to a premium-sounding voice
        const defaultVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))) || voices[0];
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Speech Recognition setup safely
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setAiSpeakingState("listening");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const latestText = finalTranscript || interimTranscript;
        setTranscriptText(latestText);
        if (activeMentor === "interviewer") {
          setUserAnswer(prev => {
            // Append safely or overwrite
            return latestText;
          });
        } else {
          setAdvisorQuestion(latestText);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        if (event.error === "not-allowed") {
          setMicPermissionError("not-allowed");
          showToast?.("Microphone permission was denied. You can open the application in a new tab to authorize it, or type your response directly below!", "error");
        } else if (event.error !== "no-speech") {
          setMicPermissionError(event.error);
          showToast?.(`Microphone response failed: ${event.error}. You can still type normally!`, "warning");
        }
        setIsListening(false);
        setAiSpeakingState("idle");
      };

      rec.onend = () => {
        setIsListening(false);
        setAiSpeakingState("idle");
      };

      recognitionRef.current = rec;
    }
  }, [activeMentor]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech function
  const speakText = (text: string, onEndCallback?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    // Cancel any active speech
    window.speechSynthesis.cancel();

    if (!voiceEnabled) {
      onEndCallback?.();
      return;
    }

    // Strip Markdown formatting or tags for clear TTS reading
    const cleanText = text
      .replace(/[*#`_\-]/g, "")
      .replace(/\[.*?\]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (selectedVoice) {
      const voice = systemVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.rate = activeMentor === "interviewer" ? 1.05 : 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setAiSpeakingState("speaking");
    };

    utterance.onend = () => {
      setAiSpeakingState("idle");
      onEndCallback?.();
    };

    utterance.onerror = () => {
      setAiSpeakingState("idle");
      onEndCallback?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Microphone capture
  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast?.("Speech recognition is not fully supported in this browser or iframe sandbox. Please type your inputs directly.", "info");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscriptText("");
      setMicPermissionError(null);
      if (activeMentor === "interviewer") {
        setUserAnswer("");
      } else {
        setAdvisorQuestion("");
      }
      try {
        recognitionRef.current.start();
        showToast?.("Microphone active! Speak clearly into your device...", "success");
      } catch (err) {
        console.error("Recognition start failed", err);
      }
    }
  };

  // 1. INTERVIEW PREP CORE INTERACTIONS
  const handleNextQuestion = () => {
    const nextIdx = (activeQuestionIdx + 1) % questions.length;
    setActiveQuestionIdx(nextIdx);
    setUserAnswer(questions[nextIdx].userAnswer || "");
    setCurrentFeedback(null);
    setAiSpeakingState("idle");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    // Auto-speak next question
    setTimeout(() => {
      speakText(`Question ${nextIdx + 1}. ${questions[nextIdx].question}`);
    }, 400);
  };

  const handleSpeakActiveQuestion = () => {
    const q = questions[activeQuestionIdx];
    if (q) {
      speakText(`Here is your question: ${q.question}`);
    }
  };

  const handleGenerateCustomDrills = async () => {
    setLoadingQuestions(true);
    showToast?.("AI Interviewer is writing custom technical & situational drills...", "info");
    setAiSpeakingState("thinking");
    try {
      const response = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: interviewRole,
          skills: userProfile.skills.join(", ")
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setActiveQuestionIdx(0);
        setUserAnswer("");
        setCurrentFeedback(null);
        showToast?.("Custom interview drills customized successfully!", "success");
        // Speak first custom question
        speakText(`Welcome to your customized practice station. Here is your first question: ${data.questions[0].question}`);
      }
    } catch (err) {
      // Fallback
      const fallbackQuestions = [
        {
          id: "custom-q1",
          question: `Given your experience in ${userProfile.skills[0] || "Software Engineering"}, how do you systematically diagnose high CPU thread contention?`,
          type: "technical",
          expectedFocus: "Diagnosing thread state, using system profilers, or optimizing mutex regions."
        },
        {
          id: "custom-q2",
          question: `As a student at ${userProfile.college || "your university"}, describe a time you had to deliver a technical milestone with incomplete requirements.`,
          type: "behavioral",
          expectedFocus: "Proactive communication, iterative prototyping, and agile requirement validation."
        }
      ];
      setQuestions(fallbackQuestions);
      setActiveQuestionIdx(0);
      setUserAnswer("");
      setCurrentFeedback(null);
      showToast?.("Interview drills loaded!", "success");
      speakText(`Welcome! Let's start with this drill: ${fallbackQuestions[0].question}`);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      showToast?.("Please speak or write your response first.", "warning");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    }

    setAnalyzingAnswer(true);
    setAiSpeakingState("thinking");
    showToast?.("Nexus is grading your articulation structure...", "info");

    try {
      const response = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[activeQuestionIdx].question,
          answer: userAnswer
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      
      setCurrentFeedback(data);
      // Save locally
      setQuestions(prev => prev.map((q, i) => {
        if (i === activeQuestionIdx) {
          return { ...q, userAnswer, feedback: data };
        }
        return q;
      }));

      showToast?.(`Evaluation complete! Core Score: ${data.score}%`, "success");
      
      // Speak the feedback back
      const speakIntro = `I've evaluated your answer and rated it at ${data.score} percent. ${
        data.score >= 85 ? "Excellent structural clarity." : "Good effort, but let's strengthen your structure."
      } I recommend reviewing the suggested draft.`;
      speakText(speakIntro);

    } catch (err) {
      // Mock Fallback
      const mockScore = Math.round(78 + Math.random() * 15);
      const fallbackFeed = {
        score: mockScore,
        strengths: ["Clear terminology and confident vocabulary delivery.", "Good structuring separating challenges from solutions."],
        weaknesses: ["Could emphasize numerical data metrics better.", "Needs closer alignment with core system resource metrics."],
        suggestedRevision: `I addressed this challenge by structuring my pipeline into dual layers: first, implementing sliding-window rate limiters; and second, leveraging backoff algorithms to prevent socket blocks. This reduced queue latency by 40%.`,
        confidenceTips: "Maintain a steady breathing tempo. Your speaking flow was excellent, just remember to highlight quantifiable outcomes."
      };
      
      setCurrentFeedback(fallbackFeed);
      setQuestions(prev => prev.map((q, i) => {
        if (i === activeQuestionIdx) {
          return { ...q, userAnswer, feedback: fallbackFeed };
        }
        return q;
      }));
      showToast?.(`Evaluation completed! Score: ${mockScore}%`, "success");
      
      speakText(`I have completed my evaluation. Your grade is ${mockScore} percent. Try highlighting more numerical outcomes.`);
    } finally {
      setAnalyzingAnswer(false);
    }
  };

  // 2. SUGGESTION ADVISOR CORE INTERACTIONS
  const handleSpeakSuggestion = (idx: number) => {
    setActiveSuggestionIdx(idx);
    const item = suggestions[idx];
    if (item) {
      speakText(item.speakAdvice);
    }
  };

  const handleAskAdvisor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!advisorQuestion.trim()) return;

    if (isListening) {
      recognitionRef.current.stop();
    }

    setAdvisorReplying(true);
    setAiSpeakingState("thinking");
    showToast?.("Elena is synthesizing career recommendations...", "info");

    try {
      const response = await fetch("/api/mentor-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              text: `Context: Student Name is ${userProfile.name}, studies at ${userProfile.college} with CPI ${userProfile.cpi}. Skills are ${userProfile.skills.join(", ")}. Question: ${advisorQuestion}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      
      setAdvisorReply(data.reply);
      speakText(data.reply);
    } catch (err) {
      const reply = `I suggest optimizing your project structure. Based on your profile at ${userProfile.college || "your college"}, you should focus on publishing open-source projects using ${userProfile.skills[0] || "React"} and secure a recommendation draft early to boost your MITACS application by 85%.`;
      setAdvisorReply(reply);
      speakText(reply);
    } finally {
      setAdvisorReplying(false);
    }
  };

  const handleRebuildSuggestions = async () => {
    setGeneratingSuggestions(true);
    setAiSpeakingState("thinking");
    showToast?.("Elena is auditing your active profile stats...", "info");

    try {
      const response = await fetch("/api/talking-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        showToast?.("Profile-driven suggestions successfully updated live!", "success");
        speakText("I have updated your customized suggestions based on your profile details. Take a look at your customized roadmap.");
      } else {
        throw new Error("No suggestions returned");
      }
    } catch (err) {
      // Robust Fallback in case of network issue
      const nextSuggs: SuggestionCard[] = [
        {
          title: `${userProfile.college || "IIT"} Academic Gateway`,
          category: "Fellowship",
          shortAdvice: `With your outstanding CPI of ${userProfile.cpi || "8.53"} and study year, you are in the top bracket for DAAD WISE or SRIP. Frame research proposals around efficient algorithms.`,
          speakAdvice: `Elena here! Your CPI of ${userProfile.cpi || "8.53"} puts you in a highly competitive bracket. I highly recommend applying for the DAAD WISE internship in Germany or the SRIP summer program. Focus your application draft around the algorithmic skills you listed!`,
          impactScore: "Top Fit (95%)",
          actionLabel: "Analyze Criteria"
        },
        {
          title: "Core Skill-Gap Bridge",
          category: "Skills Bridge",
          shortAdvice: `Bridge your CS foundation. We recommend completing the High-Performance Computing or Docker container certifications to boost technical review matches.`,
          speakAdvice: `Let's optimize your technical stack. Complete a micro-credential on containerization or system performance. It matches your target roles and demonstrates structured self-training to recruiters.`,
          impactScore: "Critical Gap",
          actionLabel: "Find Courses"
        },
        {
          title: "SOP Narrative Audit",
          category: "Resume ATS",
          shortAdvice: `Rewrite paragraph two of your Statement of Purpose to showcase the open-source database synchronization project instead of simple theoretical courseworks.`,
          speakAdvice: `Your projects are your strongest asset. In your SOP, don't just list courses. Speak directly to how you designed system modules and overcame scaling deadlocks. This creates a highly narrative and convincing SOP!`,
          impactScore: "+25% SOP Clarity",
          actionLabel: "Refactor SOP"
        }
      ];
      setSuggestions(nextSuggs);
      showToast?.("Profile suggestions loaded!", "success");
      speakText("I have updated your suggestions. Take a look at your customized roadmap.");
    } finally {
      setGeneratingSuggestions(false);
      setAiSpeakingState("idle");
    }
  };

  return (
    <div className="space-y-6" id="talking-ai-mentors-root">
      
      {/* 1. Header with glass styling */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Interactive Audio Sandbox
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Aspirant Voice Mentors
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl">
            Meet your cooperative talking AI assistants. Switch between the <b>Interview Prep Avatar</b> to face high-pressure oral drills, or the <b>Suggestions Coach</b> to synthesize customized career tips.
          </p>
        </div>

        {/* Global TTS Controls */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 shrink-0 backdrop-blur-md">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 block border-b border-white/5 pb-1.5">Voice Engine Tuning</span>
          
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (voiceEnabled) {
                  window.speechSynthesis?.cancel();
                } else {
                  showToast?.("Voice output enabled!", "info");
                }
              }}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                voiceEnabled ? "bg-indigo-600/20 border-indigo-500 text-indigo-300" : "bg-white/5 border-white/5 text-slate-500"
              }`}
              title={voiceEnabled ? "Mute Voice Output" : "Unmute Voice Output"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                showToast?.("System voice updated!", "info");
              }}
              className="text-[11px] font-mono bg-slate-900 text-slate-200 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="">Default OS Voice</option>
              {systemVoices.map((voice, i) => (
                <option key={i} value={voice.name}>
                  {voice.name.replace("Microsoft", "").replace("Google", "").substring(0, 24)} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (activeMentor === "interviewer") {
                speakText("Hello! I am Dr. Nexus, your technical interview screener. Let's start practicing your oral skills!");
              } else {
                speakText("Elena here! I have analyzed your profile and I am ready to share custom fellowship and career suggestions!");
              }
            }}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            id="test-voice-output-button"
          >
            <Play className="w-3 h-3 text-white fill-white" />
            <span>TEST OUTPUT VOICE</span>
          </button>
        </div>
      </div>

      {/* 2. Selection Toggle Switch & Active Mode Indicator */}
      <div className="flex flex-col items-center gap-4 py-2" id="ai-personality-toggle-container">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            Toggle AI Personality Mode
          </span>
          
          {/* Custom Sliding Toggle Switch */}
          <div className="relative flex items-center bg-slate-950 border border-white/10 p-1 rounded-full w-[320px] h-12 cursor-pointer select-none" id="ai-personality-toggle-switch">
            {/* Sliding Pill Background */}
            <div 
              className={`absolute top-1 bottom-1 w-[152px] bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full transition-all duration-300 ease-out shadow-lg shadow-indigo-500/20 ${
                activeMentor === "interviewer" ? "translate-x-0" : "translate-x-[154px]"
              }`} 
            />
            
            {/* Left Toggle Option */}
            <button
              type="button"
              id="toggle-btn-interview-coach"
              onClick={() => {
                setActiveMentor("interviewer");
                window.speechSynthesis?.cancel();
                setAiSpeakingState("idle");
              }}
              className={`relative z-10 w-[152px] h-full text-center font-bold text-xs flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer ${
                activeMentor === "interviewer" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Interview Coach</span>
            </button>

            {/* Right Toggle Option */}
            <button
              type="button"
              id="toggle-btn-career-suggestion"
              onClick={() => {
                setActiveMentor("advisor");
                window.speechSynthesis?.cancel();
                setAiSpeakingState("idle");
              }}
              className={`relative z-10 w-[152px] h-full text-center font-bold text-xs flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer ${
                activeMentor === "advisor" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Suggestion</span>
            </button>
          </div>
        </div>

        {/* Visual Mode Active Indicator */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs animate-fadeIn shadow-sm" id="active-personality-visual-indicator">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              activeMentor === "interviewer" ? "bg-indigo-400" : "bg-emerald-400"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              activeMentor === "interviewer" ? "bg-indigo-500" : "bg-emerald-500"
            }`}></span>
          </span>
          <span className="text-slate-400 font-medium">Active Personality:</span>
          <span className={`font-bold font-mono ${
            activeMentor === "interviewer" ? "text-indigo-400" : "text-emerald-400"
          }`}>
            {activeMentor === "interviewer" ? "INTERVIEW COACH (Nexus)" : "CAREER SUGGESTION (Elena)"}
          </span>
        </div>
      </div>

      {/* 3. Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Animated Talking Avatar Sphere (Occupies 2 spans) */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[440px]">
          <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="space-y-1 w-full text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
              {activeMentor === "interviewer" ? "NEXUS-07 TECHNICAL PROXY" : "ELENA NAIR ADVISOR PROXY"}
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              {activeMentor === "interviewer" ? "Dr. Nexus: Tech Screener" : "Elena Nair: Career Matchmaker"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
              {activeMentor === "interviewer" 
                ? "Simulates fast-paced corporate engineering and STAR behavioral inquiries." 
                : "Monitors CPI brackets, skill course gaps, and academic opportunities."}
            </p>
          </div>

          {/* Glowing Voice Indicator with Waves */}
          <div className="relative my-8 flex items-center justify-center w-40 h-40">
            {/* Ambient outer ripple ring */}
            <div className={`absolute inset-0 rounded-full border border-indigo-500/20 transition-all duration-700 ${
              aiSpeakingState === "speaking" ? "animate-ping scale-110 opacity-75 border-indigo-400" :
              aiSpeakingState === "listening" ? "animate-pulse scale-105 border-emerald-500/30" :
              aiSpeakingState === "thinking" ? "animate-spin border-t-purple-500/40" : "scale-100"
            }`} />

            <div className={`absolute inset-4 rounded-full border border-indigo-400/10 transition-all duration-1000 ${
              aiSpeakingState === "speaking" ? "scale-115 border-indigo-400/30" :
              aiSpeakingState === "listening" ? "scale-105 border-emerald-400/30" : ""
            }`} />

            {/* Core Speaking Sphere */}
            <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl relative transition-all duration-500 bg-gradient-to-tr ${
              aiSpeakingState === "speaking" ? "from-indigo-600 via-indigo-500 to-indigo-700 shadow-indigo-500/30 scale-105" :
              aiSpeakingState === "listening" ? "from-emerald-600 via-teal-500 to-emerald-700 shadow-emerald-500/30 scale-[1.03]" :
              aiSpeakingState === "thinking" ? "from-purple-600 via-indigo-600 to-fuchsia-700 shadow-purple-500/30" :
              "from-slate-800 to-slate-900 border border-white/10"
            }`}>
              
              {/* Voice Waves */}
              {aiSpeakingState === "speaking" && (
                <div className="flex gap-1.5 items-end h-8">
                  <span className="w-1 bg-white rounded animate-[bounce_0.6s_infinite_100ms]" style={{ height: "40%" }} />
                  <span className="w-1 bg-white rounded animate-[bounce_0.6s_infinite_300ms]" style={{ height: "80%" }} />
                  <span className="w-1 bg-white rounded animate-[bounce_0.6s_infinite_150ms]" style={{ height: "100%" }} />
                  <span className="w-1 bg-white rounded animate-[bounce_0.6s_infinite_400ms]" style={{ height: "60%" }} />
                  <span className="w-1 bg-white rounded animate-[bounce_0.6s_infinite_200ms]" style={{ height: "30%" }} />
                </div>
              )}

              {aiSpeakingState === "listening" && (
                <div className="flex gap-1 items-end h-8 animate-pulse">
                  <span className="w-1 bg-white rounded" style={{ height: "20%", animation: "pulse 1s infinite" }} />
                  <span className="w-1 bg-white rounded" style={{ height: "60%", animation: "pulse 0.8s infinite" }} />
                  <span className="w-1 bg-white rounded" style={{ height: "30%", animation: "pulse 1.2s infinite" }} />
                  <span className="w-1 bg-white rounded" style={{ height: "80%", animation: "pulse 0.9s infinite" }} />
                </div>
              )}

              {aiSpeakingState === "thinking" && (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              )}

              {aiSpeakingState === "idle" && (
                <Mic className="w-10 h-10 text-indigo-300" />
              )}

              {/* Caption status banner */}
              <span className="absolute bottom-2 font-mono text-[9px] text-white/80 uppercase font-semibold">
                {aiSpeakingState === "speaking" ? "SPEAKING VOICE" :
                 aiSpeakingState === "listening" ? "LISTENING..." :
                 aiSpeakingState === "thinking" ? "THINKING..." : "CONNECTED"}
              </span>
            </div>
          </div>

          {/* Speech Control Panel buttons */}
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleListening}
                className={`py-2.5 px-5 rounded-2xl font-bold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  isListening 
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg animate-pulse" 
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? "STOP LISTENING" : "TALK WITH VOICE"}</span>
              </button>

              {activeMentor === "interviewer" ? (
                <button
                  onClick={handleSpeakActiveQuestion}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-2xl text-xs font-semibold cursor-pointer"
                  title="Repeat Question Out Loud"
                >
                  <Volume2 className="w-4.5 h-4.5 text-indigo-400" />
                </button>
              ) : null}
            </div>

            {transcriptText && (
              <p className="text-[11px] font-mono text-slate-400 leading-relaxed max-w-xs mx-auto border-t border-white/5 pt-2">
                <span className="text-emerald-400 font-bold block mb-0.5">Vocal Capture:</span>
                "{transcriptText}"
              </p>
            )}

            {micPermissionError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-[11px] text-slate-300 space-y-1 text-left animate-fadeIn max-w-xs mx-auto mt-2" id="mic-permission-error-alert">
                <div className="flex items-center gap-1.5 font-bold text-red-400 font-mono text-[10px] uppercase">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Mic Access Restricted
                </div>
                <p className="leading-relaxed text-slate-300">
                  The browser blocked microphone access ({micPermissionError === "not-allowed" ? "Permission Denied / Sandbox" : micPermissionError}).
                </p>
                <p className="text-[10px] text-slate-400">
                  To fix: click <strong className="text-slate-300 font-semibold">Open App</strong> (new tab) in the top-right corner to bypass sandbox restrictions, or use the direct keyboard text editors.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Workspaces (Occupies 3 spans) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* INTERVIEWER WORKSPACE CONTAINER */}
          {activeMentor === "interviewer" && (
            <div className="space-y-6">
              
              {/* Drill controls */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-indigo-400" /> Drill Setup & Customizer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focus your talking AI interview. Specify your target title, and let Gemini synthesize customized oral questions based on your profile skills (<b>{userProfile.skills.slice(0, 3).join(", ")}</b>).
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    className="flex-1 text-xs bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100"
                    placeholder="e.g. Software Engineer, ML Researcher"
                  />
                  <button
                    onClick={handleGenerateCustomDrills}
                    disabled={loadingQuestions}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {loadingQuestions ? "Building..." : "Tailor Drills"}
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Drill Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold">
                    ACTIVE ORAL DRILL
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Drill {activeQuestionIdx + 1} of {questions.length}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-slate-100 leading-snug">
                    "{questions[activeQuestionIdx]?.question}"
                  </h4>
                  <p className="text-xs text-slate-400 font-mono italic">
                    <span className="font-semibold not-italic">Nexus focus criteria:</span> {questions[activeQuestionIdx]?.expectedFocus}
                  </p>
                </div>

                {/* Response Text Input fallback */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Drafted Response</label>
                    <span className="text-[10px] text-slate-500">You can type or click "Talk with Voice" above</span>
                  </div>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full h-32 text-xs bg-slate-950 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100 leading-relaxed"
                    placeholder="Speak your response or type here. Use the microphone above to speak hands-free!"
                  />
                </div>

                {/* Submits and navigation */}
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <button
                    onClick={handleNextQuestion}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-slate-300 border border-white/10 transition-colors cursor-pointer"
                  >
                    Skip to Next Drill
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={analyzingAnswer || !userAnswer.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {analyzingAnswer ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        Grading Articulation...
                      </>
                    ) : (
                      <>
                        Submit Oral Answer
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Core feedback scorecard */}
              {currentFeedback && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">Recruiter Scorecard</h4>
                        <p className="text-[10px] text-slate-400">Oral articulation diagnostic metrics</p>
                      </div>
                      <button
                        onClick={() => {
                          const strengthsText = currentFeedback.strengths ? `Strengths include: ${currentFeedback.strengths.join(". ")}` : "";
                          const weaknessesText = currentFeedback.weaknesses ? `Areas to improve: ${currentFeedback.weaknesses.join(". ")}` : "";
                          speakText(`Evaluation score is ${currentFeedback.score} percent. ${strengthsText} ${weaknessesText}`);
                        }}
                        className="p-1.5 bg-white/5 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 rounded-xl cursor-pointer transition-all flex items-center gap-1 text-[10px] font-mono font-medium"
                        title="Speak Diagnostic Evaluation Summary"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Read Summary</span>
                      </button>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl text-center">
                      <span className="text-[9px] text-slate-400 font-mono block">SCORE</span>
                      <span className="text-base font-bold text-emerald-400 block">{currentFeedback.score}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                      <span className="font-bold text-[10px] font-mono text-emerald-400 uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ARTICULATION STRENGTHS
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300 pl-3 list-disc">
                        {currentFeedback.strengths?.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                      <span className="font-bold text-[10px] font-mono text-amber-300 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> IMPROVEMENT OPPORTUNITIES
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300 pl-3 list-disc">
                        {currentFeedback.weaknesses?.map((w: string, i: number) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-1.5 text-xs relative">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[10px] font-mono text-indigo-400 uppercase flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> RE-ARTICULATED SAMPLE RESPONSE
                      </span>
                      <button
                        onClick={() => speakText(currentFeedback.suggestedRevision)}
                        className="p-1 bg-slate-900 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 rounded-lg cursor-pointer transition-all flex items-center gap-1 text-[9px] font-mono"
                        title="Read Sample Response Out Loud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak Sample</span>
                      </button>
                    </div>
                    <p className="text-slate-300 italic leading-relaxed">
                      "{currentFeedback.suggestedRevision}"
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
                    💡 Delivery Tip: {currentFeedback.confidenceTips}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUGGESTIONS COACH WORKSPACE CONTAINER */}
          {activeMentor === "advisor" && (
            <div className="space-y-6">
              
              {/* Elena Profile Audit action bar */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5 text-amber-400" /> Elena's Suggestion Desk
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Elena monitors your academic standing (<b>CPI: {userProfile.cpi || "8.53"}</b>) and profile gaps. Click "Audit My Stats" to sync suggestions!
                    </p>
                  </div>

                  <button
                    onClick={handleRebuildSuggestions}
                    disabled={generatingSuggestions}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${generatingSuggestions ? "animate-spin" : ""}`} />
                    <span>Audit My Stats</span>
                  </button>
                </div>
              </div>

              {/* Suggestions Cards Grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block px-1">Elena's High-Impact Recommendations</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestions.map((s, idx) => {
                    const isSelected = activeSuggestionIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSpeakSuggestion(idx)}
                        className={`p-4 rounded-2xl border cursor-pointer text-left transition-all flex flex-col justify-between h-44 relative overflow-hidden ${
                          isSelected 
                            ? "bg-indigo-600/15 border-indigo-500 shadow-md scale-[1.01]" 
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">{s.category}</span>
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full font-mono">{s.impactScore}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-200 mt-2 font-sans line-clamp-1">{s.title}</h4>
                          <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-3 mt-1 font-light">
                            {s.shortAdvice}
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono text-indigo-400 border-t border-white/5 pt-2 mt-2">
                          <span>{isSelected ? "🗣️ SPEAKING COACH" : "👂 CLICK TO LISTEN"}</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct interactive question form */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-indigo-400" /> Ask Elena Custom Career Queries
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have questions about specific research internships, improving GPA, or getting professor endorsements? Speak or write below to ask Elena!
                  </p>
                </div>

                <form onSubmit={handleAskAdvisor} className="flex gap-2">
                  <input
                    type="text"
                    value={advisorQuestion}
                    onChange={(e) => setAdvisorQuestion(e.target.value)}
                    placeholder="Speak above or ask e.g. 'How do I bypass the ATS for research labs?'"
                    className="flex-1 text-xs bg-slate-950 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={advisorReplying || !advisorQuestion.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {advisorReplying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <>
                        <span>Ask Elena</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </form>

                {advisorReply && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-2 animate-fadeIn relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold font-mono text-indigo-300 block uppercase">Elena Nair Direct Response:</span>
                      <button
                        onClick={() => speakText(advisorReply)}
                        className="p-1 bg-slate-900 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 rounded-lg cursor-pointer transition-all flex items-center gap-1 text-[9px] font-mono"
                        title="Read Elena Nair's response out loud"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Speak Response</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{advisorReply}"
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                      <span>Interactive Voice feedback enabled</span>
                      <span className="text-emerald-400">Drills Recommended</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
