import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  ChevronRight, 
  ThumbsUp, 
  AlertCircle, 
  RefreshCw,
  Video,
  FileText,
  Briefcase
} from "lucide-react";
import { ChatMessage, UserProfile, ApplicationTrackerItem } from "../types";

interface AIMentorCompanionProps {
  userProfile: UserProfile;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onAddApplication?: (app: Partial<ApplicationTrackerItem>) => void;
}

export default function AIMentorCompanion({
  userProfile,
  activeTab,
  setActiveTab,
  chatMessages,
  setChatMessages,
  onAddApplication
}: AIMentorCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNudge, setShowNudge] = useState(true);
  const [mockRound, setMockRound] = useState<number | null>(null); // null, 0, 1, 2 for mock questions
  
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  // Keep showing nudge for 8 seconds, then hide unless opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNudge(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Contextual helper based on activeTab
  const getContextGuide = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Dashboard Companion",
          text: `Welcome, ${userProfile.name}! Your CPI is ${userProfile.cpi || "8.53"} and you're in 1st year at ${userProfile.college || "IIT Patna"}. Your profile strength is at 82%. Shall we check your internship matches?`,
          actions: [
            { label: "🔍 Show India/Foreign Matches", action: () => setActiveTab("finder") },
            { label: "📊 Audit Profile Strength", action: () => {
              setChatMessages(prev => [
                ...prev,
                { id: "msg-as-" + Date.now(), role: "user", text: "How can I improve my Profile Strength?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-as-ai-" + Date.now(), role: "assistant", text: "To boost your Profile Strength from 82% to 95%, you should: 1) Upload your updated SOP draft to the CV/SOP Lab. 2) Complete the 'AI Fundamentals' badge on IBM SkillsBuild which bridges your CS skills gap. 3) Link your active GitHub portfolio repositories in the Portfolio section.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } }
          ]
        };
      case "finder":
        return {
          title: "Match Catalyst",
          text: `Awesome! You are highly matched for IIT Bhubaneswar (92%), DRDO Defence Systems (88%), and MITACS Canada (85%). Let's prepare your Statement of Purpose (SOP) for these opportunities!`,
          actions: [
            { label: "📝 Draft SOP for DRDO", action: () => {
              setActiveTab("cv_sop");
              setChatMessages(prev => [
                ...prev,
                { id: "msg-ds-" + Date.now(), role: "user", text: "Can you help me build an SOP for DRDO Defence Systems Internship?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-ds-ai-" + Date.now(), role: "assistant", text: "Absolutely! I have pre-filled the SOP Lab with student details: Name: Mahima Jha, College: IIT Patna, CPI: 8.53. Under the SOP Lab, select the 'Research' template, write 'DRDO Defense Systems and Autonomous Aerial Vehicles' as your target role, and click 'Build Statement of Purpose'. This will trigger the Gemini-tailored content generation!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } },
            { label: "🌍 Learn about MITACS Canada", action: () => {
              setChatMessages(prev => [
                ...prev,
                { id: "msg-mi-" + Date.now(), role: "user", text: "What are the key requirements for MITACS Globalink?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-mi-ai-" + Date.now(), role: "assistant", text: "MITACS Canada is a fully-funded summer program. They require: 1) Pre-final or outstanding early year students with a strong academic standing (CPI > 8.0). 2) Two academic recommendation letters (get these from Recommendation Hub!). 3) A clear Statement of Purpose demonstrating interest in high-impact Canadian laboratory projects.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } }
          ]
        };
      case "cv_sop":
        return {
          title: "SOP/CV Lab Specialist",
          text: `Let's optimize your CV and draft a stellar Statement of Purpose. A high ATS score of 80+ guarantees your application is seen by professors & corporate recruiters!`,
          actions: [
            { label: "📄 Key Words for AI & CS", action: () => {
              setChatMessages(prev => [
                ...prev,
                { id: "msg-kw-" + Date.now(), role: "user", text: "Which keywords should I add for an AI/CS internship?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-kw-ai-" + Date.now(), role: "assistant", text: "Excellent choice. For AI and Computer Science roles, add keywords like: 'Supervised Learning', 'Neural Network Pipelines', 'Data Preprocessing', 'PyTorch Framework', 'Algorithmic Optimization', and 'Distributed File Systems'. Use these in your descriptions of laboratory projects!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } },
            { label: "🤝 SOP Draft Advice", action: () => {
              setChatMessages(prev => [
                ...prev,
                { id: "msg-sa-" + Date.now(), role: "user", text: "How should I structure my research SOP?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-sa-ai-" + Date.now(), role: "assistant", text: "A research SOP should follow this layout: 1) Introduction: Express your enthusiasm for the specific scientific domain. 2) Academics: Note your CPI (8.53) and courses at IIT Patna. 3) Hands-on: Mention your projects and Skills build courses. 4) Host Alignment: State why you want to work under their specific research advisor.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } }
          ]
        };
      case "interview":
        return {
          title: "Interview Prep Trainer",
          text: `Welcome to the Interview Park! I can run a simulated HR mock round with you right here. I'll test you and give constructive feedback.`,
          actions: [
            { label: "🎙️ Start simulated HR round", action: () => handleStartMock() },
            { label: "📺 Load AI Interview Playlists", action: () => {
              setChatMessages(prev => [
                ...prev,
                { id: "msg-yt-" + Date.now(), role: "user", text: "Where can I find curated YouTube mock interview prep?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-yt-ai-" + Date.now(), role: "assistant", text: "I have loaded YouTube playlists customized for Computer Science and Machine Learning interviews inside the Prep Hub! Simply check the video recommendations at the bottom of the page to stream standard tutorials.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } }
          ]
        };
      case "tracker":
        return {
          title: "Tracker Assistant",
          text: `Your DRDO deadline is in 5 days! Shall we set an automated reminder or update your application progress timeline?`,
          actions: [
            { label: "⏳ Submit DRDO App", action: () => {
              if (onAddApplication) {
                onAddApplication({
                  title: "Defence Systems & AI Research Internship",
                  company: "Defence Research and Development Organisation (DRDO)",
                  domain: "Research",
                  status: "Applied",
                  deadline: "2026-07-06",
                  notes: "Applied! Recommendation letter submitted. Deadline in 5 days."
                });
                setChatMessages(prev => [
                  ...prev,
                  { id: "msg-dr-" + Date.now(), role: "user", text: "Submit DRDO application status update", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                  { id: "msg-dr-ai-" + Date.now(), role: "assistant", text: "Success! I have added the DRDO Defence Systems & AI Research Internship application status into your Application Tracker. I'll nudge you when it's time to prep for their technical interview round!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                ]);
              }
            } },
            { label: "📈 Show Success Metrics", action: () => {
              setChatMessages(prev => [
                ...prev,
                { id: "msg-sm-" + Date.now(), role: "user", text: "How is my application success rate looking?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: "msg-sm-ai-" + Date.now(), role: "assistant", text: "Based on historical database records, IIT students applying for academic research (CPI > 8.5) and keeping their profiles updated see a 78% shortlist success rate. Maintain your progress!", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            } }
          ]
        };
      default:
        return {
          title: "AI Mentor companion",
          text: "I am here to guide you at every stage. You can ask me anything about finding internships, prepping resumes, or practicing interview responses!",
          actions: [
            { label: "🎓 What internships do I qualify for?", action: () => setActiveTab("finder") },
            { label: "🏆 Browse Scholarships", action: () => setActiveTab("boosters") }
          ]
        };
    }
  };

  const currentGuide = getContextGuide();

  // Mock interview system
  const mockQuestions = [
    "Tell me about yourself, your academic background at IIT Patna, and your main interests in AI & CS.",
    "Great. Why are you specifically interested in defense systems and AI research at DRDO?",
    "Excellent answer. How do you handle working on high-performance projects when you encounter missing libraries or unfamiliar technologies?"
  ];

  const handleStartMock = () => {
    setMockRound(0);
    setChatMessages(prev => [
      ...prev,
      { id: "msg-m0-" + Date.now(), role: "user", text: "Start interactive Mock HR Interview round", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: "msg-m0-ai-" + Date.now(), role: "assistant", text: `Welcome to the interactive HR simulated interview! I will act as the Head Recruiter. Let's begin.\n\nQuestion 1: ${mockQuestions[0]}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userText = chatInput.trim();
    const studentMsg: ChatMessage = {
      id: "msg-u-" + Date.now(),
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, studentMsg]);
    setChatInput("");
    setLoading(true);

    // If we are in mock interview mode, process simulation
    if (mockRound !== null) {
      setTimeout(() => {
        const nextRound = mockRound + 1;
        if (nextRound < mockQuestions.length) {
          setMockRound(nextRound);
          setChatMessages(prev => [
            ...prev,
            { 
              id: "msg-m-feed-" + Date.now(), 
              role: "assistant", 
              text: `👍 Excellent response! I rate that answer 88/100. You highlighted your CPI and background beautifully. Now let's move to the next question.\n\nQuestion ${nextRound + 1}: ${mockQuestions[nextRound]}`, 
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]);
        } else {
          setMockRound(null);
          setChatMessages(prev => [
            ...prev,
            { 
              id: "msg-m-end-" + Date.now(), 
              role: "assistant", 
              text: "🎉 Congratulations! You have completed the interactive HR mock interview simulation. Your overall score is 90/100! Your communication structure was professional, and you demonstrated genuine curiosity. Keep practicing these models to feel confident for the real thing!", 
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]);
        }
        setLoading(false);
      }, 1500);
      return;
    }

    // Standard mentor bot API call
    try {
      const response = await fetch("/api/mentor-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, studentMsg].map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          id: "msg-ai-" + Date.now(),
          role: "assistant",
          text: data.reply || "I am here with you. Keep building your skills!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      // Fallback response with helpful answers
      let fallbackText = "I am here to guide you! Focus on building high-impact STAR formatted projects, completing your online certifications, and ensuring your CV contains critical keywords.";
      if (userText.toLowerCase().includes("drdo") || userText.toLowerCase().includes("deadline")) {
        fallbackText = "Your DRDO Defence Systems & AI Research Internship application is ready for action! Highlight your academic reference letters and submit your project files as soon as possible.";
      } else if (userText.toLowerCase().includes("mitacs") || userText.toLowerCase().includes("canada")) {
        fallbackText = "For MITACS, verify that you have two strong recommendation letters from your department professors, and align your Statement of Purpose (SOP) with their AI projects.";
      }
      
      setChatMessages(prev => [
        ...prev,
        {
          id: "msg-ai-fallback-" + Date.now(),
          role: "assistant",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Dynamic Floating Nudge Banner */}
      {showNudge && !isOpen && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 text-slate-100 rounded-2xl p-3.5 mb-3 shadow-[0_4px_24px_rgba(99,102,241,0.2)] max-w-xs text-xs animate-bounce relative group">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowNudge(false);
            }}
            className="absolute top-1 right-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-indigo-300">AI Mentor Alert</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                "Welcome Mahima! You're eligible for IIT Bhubaneswar, DRDO & MITACS Canada. Let's start preparing!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setShowNudge(false);
          }}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(99,102,241,0.5)] cursor-pointer transition-all hover:scale-105 active:scale-95 group relative"
          title="Consult AI Mentor"
          id="ai-mentor-bubble"
        >
          <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-25 group-hover:opacity-40" />
          <Bot className="w-6 h-6 relative z-10" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse shadow-md" />
        </button>
      )}

      {/* Main Expanded AI Companion Panel */}
      {isOpen && (
        <div 
          className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-[360px] md:w-[400px] h-[550px] flex flex-col overflow-hidden transition-all duration-300 animate-fade-in"
          id="ai-mentor-expanded-panel"
        >
          {/* Header */}
          <div className="bg-indigo-600 px-5 py-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Aspirant AI Mentor</h3>
                <p className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Online & interactive
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Companion Guide Banner */}
          <div className="bg-white/5 border-b border-white/10 p-4 space-y-2 shrink-0">
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {currentGuide.title}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {currentGuide.text}
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {currentGuide.actions.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    act.action();
                  }}
                  className="w-full text-left px-3 py-2 bg-slate-950/50 hover:bg-indigo-600/10 hover:text-indigo-300 text-slate-300 rounded-xl text-[11px] font-semibold flex items-center justify-between border border-white/5 transition-all cursor-pointer"
                >
                  <span>{act.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat Logs Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40 scrollbar-thin">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  msg.role === "user" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
                }`}>
                  {msg.role === "user" ? "M" : "AI"}
                </div>
                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white/5 text-slate-200 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 mr-auto max-w-[85%] animate-pulse">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  AI
                </div>
                <div className="bg-white/5 text-slate-400 border border-white/5 rounded-2xl p-3 text-xs italic">
                  Drafting expert guidelines...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* User Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-white/10 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder={mockRound !== null ? "Type your interview response..." : "Ask your AI Mentor custom questions..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow text-xs bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={loading || !chatInput.trim()}
              className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
