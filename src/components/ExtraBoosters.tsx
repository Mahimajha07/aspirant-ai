import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  DollarSign, 
  ExternalLink, 
  Users, 
  MessageSquare, 
  Check, 
  Award, 
  Share2,
  Clock,
  ThumbsUp,
  UserCheck
} from "lucide-react";
import { ChatMessage, ScholarshipOpportunity } from "../types";
import { INITIAL_SCHOLARSHIPS } from "../data";

interface ExtraBoostersProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function ExtraBoosters({
  chatMessages,
  setChatMessages,
  showToast,
}: ExtraBoostersProps) {
  const [activeSubTab, setActiveSubTab] = useState<"scholarships" | "peer" | "mentor">("scholarships");
  
  // AI Mentor Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Peer review simulations states
  const [reviews, setReviews] = useState([
    { id: "rev-1", author: "Rahul Sharma", role: "Prefinal at IIT Delhi", item: "SOP Draft", score: 85, feedback: "Your introduction paragraph is extremely gripping! However, consider describing your concurrent Distributed Systems projects in slightly more depth to clarify your exact tech contributions." },
    { id: "rev-2", author: "Aanya Verma", role: "Senior at BITS Pilani", item: "ATS CV Text", score: 90, feedback: "Formatting is pristine and keyword density matches recruiter systems perfectly. I'd recommend appending your AZ-900 cloud credentials to your profile skills segment too!" }
  ]);
  const [newReviewItem, setNewReviewItem] = useState("ATS CV Text");
  const [newReviewText, setNewReviewText] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const studentMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, studentMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/mentor-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, studentMsg].map(m => ({ role: m.role, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error("Chat connection failed");
      }

      const data = await response.json();
      setChatMessages(prev => [
        ...prev,
        {
          id: "msg-ai-" + Date.now(),
          role: "assistant",
          text: data.reply || "I am right here with you. Keep building your projects!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      // Fallback LOR style mentor bot encouragement
      setChatMessages(prev => [
        ...prev,
        {
          id: "msg-ai-fallback",
          role: "assistant",
          text: "I am here to encourage you. Even if there are temporary connection blocks, continue focusing on refining your ATS CV text, writing high-impact STAR projects, and practicing mock interviews daily. Consistency lands elite internships!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handlePostPeerReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setReviews([
      {
        id: "rev-" + Date.now(),
        author: "Anonymous Scholar",
        role: "Aspirant Peer",
        item: newReviewItem,
        score: Math.round(75 + Math.random() * 20),
        feedback: newReviewText.trim()
      },
      ...reviews
    ]);

    setNewReviewText("");
    showToast?.("Your work has been submitted to the Peer Review Board!", "success");
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6" id="extra-boosters-root">
      
      {/* Sub Tabs */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" /> Professional Boosters
          </h1>
          <p className="text-slate-400 text-sm">
            Acquire funding support with specialized scholarships, engage in peer reviews, or consult your wise AI Mentor.
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveSubTab("scholarships")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "scholarships" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Scholarship Finder
          </button>
          <button
            onClick={() => setActiveSubTab("peer")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "peer" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Peer Review Board
          </button>
          <button
            onClick={() => setActiveSubTab("mentor")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "mentor" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            AI Mentor Bot
          </button>
        </div>
      </div>

      {activeSubTab === "scholarships" ? (
        /* SCHOLARSHIP FINDER */
        <div className="grid grid-cols-1 gap-6">
          {INITIAL_SCHOLARSHIPS.map((sch) => (
            <div 
              key={sch.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start transition-all hover:border-white/15"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-100">{sch.title}</h3>
                    <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold uppercase">
                      {sch.provider}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Eligibility criteria: {sch.eligibility}</p>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-indigo-300 block mb-0.5">Funding & Advantages:</span>
                  {sch.benefits}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-4 shrink-0 h-full">
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] font-mono block">STIPEND VALUE</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-0.5">{sch.fundingAmount}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Deadline: {sch.deadline}</span>
                </div>

                <a
                  href={sch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => showToast?.(`Opening application portal for ${sch.title}...`, "info")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  Verify Openings <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : activeSubTab === "peer" ? (
        /* PEER REVIEW PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Post submission feedback */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 h-fit">
            <h3 className="font-bold text-lg text-slate-100">Submit Review Listing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exchange suggestions with peer candidates. Submit your current SOP or resume highlights so classmates can review and suggest ATS improvements.
            </p>

            <form onSubmit={handlePostPeerReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Target Item</label>
                <select
                  value={newReviewItem}
                  onChange={(e) => setNewReviewItem(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
                >
                  <option value="ATS CV Text">ATS CV Text</option>
                  <option value="Statement of Purpose (SOP)">Statement of Purpose (SOP)</option>
                  <option value="LinkedIn Headline & Summary">LinkedIn Headline & Summary</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Enter Review / Critique Comments</label>
                <textarea
                  placeholder="Paste your constructive suggestions or peer grading comments here..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full h-32 text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100 leading-relaxed"
                />
              </div>

              {successMsg && (
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                  <Check className="w-4.5 h-4.5" /> Peer review suggestion posted successfully!
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Users className="w-4 h-4" /> Post Constructive Critique
              </button>
            </form>
          </div>

          {/* Peer reviews listing */}
          <div className="lg:col-span-3 space-y-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
            <h3 className="font-bold text-lg text-slate-100">Active Peer Exchange Log</h3>
            
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-slate-200 block">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">{rev.role}</span>
                    </div>

                    <div className="text-right">
                      <span className="bg-indigo-500/10 text-indigo-300 text-[9px] px-2 py-0.5 rounded font-mono uppercase font-semibold">
                        {rev.item}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    "{rev.feedback}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* AI MENTOR CHATBOT */
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 flex flex-col h-[540px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0">
            <div>
              <h3 className="font-bold text-base text-slate-100">Consult AI Academic Mentor</h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active & ready to counsel
              </p>
            </div>
            
            <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">
              Powered by Gemini 3.5
            </span>
          </div>

          {/* Conversation screen */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/30 rounded-2xl border border-white/5 scrollbar-thin">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar mockup */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.role === "user" ? "bg-indigo-500 text-white" : "bg-emerald-600 text-white"
                }`}>
                  {msg.role === "user" ? "S" : "M"}
                </div>

                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  M
                </div>
                <div className="bg-white/5 text-slate-400 border border-white/10 rounded-2xl p-3 text-xs italic">
                  Refining expert mentor strategies...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask your mentor (e.g., 'How do I email a professor about an open research project?')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 text-slate-100"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
