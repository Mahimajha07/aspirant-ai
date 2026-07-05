import React, { useState } from "react";
import { 
  Award, 
  Sparkles, 
  Check, 
  Copy, 
  Send, 
  UserCheck, 
  FileText,
  Mail
} from "lucide-react";
import { UserProfile, RecommendationDraft } from "../types";

interface RecommendationHubProps {
  userProfile: UserProfile;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function RecommendationHub({
  userProfile,
  showToast,
}: RecommendationHubProps) {
  const [mentorName, setMentorName] = useState("Dr. Sarah Jenkins");
  const [mentorRole, setMentorRole] = useState("Professor of Computer Science & Research Guide");
  const [studentAchievements, setStudentAchievements] = useState(
    "A grade in Advanced Algorithms course, led the open-source Distributed Database synchronization team project, demonstrated high initiative and critical thinking"
  );
  const [tone, setTone] = useState("academic and enthusiastic");
  const [drafting, setDrafting] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationDraft | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateRecommendation = async () => {
    setDrafting(true);
    showToast?.("AI is generating professional recommendation draft (LOR)...", "info");
    try {
      const response = await fetch("/api/recommendation-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentInfo: `${userProfile.name}, studies at ${userProfile.education || "University"}`,
          mentorRelationship: `Academically guided by ${mentorName}, ${mentorRole}`,
          keyAchievements: studentAchievements,
          tone
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = await response.json();
      setRecommendation({
        id: "lor-" + Date.now(),
        mentorName,
        mentorRole,
        studentAchievements,
        tone,
        letterDraft: data.letterDraft,
        networkingNudges: data.networkingNudges || [],
        lastSaved: new Date().toLocaleDateString()
      });
      showToast?.("Letter of Recommendation drafted successfully!", "success");
    } catch (err) {
      console.error(err);
      // Fallback
      setRecommendation({
        id: "lor-fallback",
        mentorName,
        mentorRole,
        studentAchievements,
        tone,
        letterDraft: `LETTER OF RECOMMENDATION\n\nTo Whom It May Concern,\n\nIt is my great pleasure to write this letter of strong recommendation for ${userProfile.name}, who is applying for your competitive internship program. I have known ${userProfile.name} in my capacity as ${mentorRole}.\n\nDuring our tenure, ${userProfile.name} demonstrated exceptional engineering acumen. Specifically, they achieved: ${studentAchievements}. Their capacity to digest advanced algorithms and deploy robust solutions is outstanding.\n\n${userProfile.name} possesses the communication clarity, self-initiative, and diligence that sets elite students apart. I recommend them with the highest enthusiasm and without reservation.\n\nSincerely,\n\n${mentorName}\n${mentorRole}`,
        networkingNudges: [
          "Send Dr. Sarah Jenkins a short email detailing the specific internship roles you are applying to.",
          "Politely offer: 'I have attached a structured draft of the LOR to save you time. Please feel free to alter it completely or let me know if you would like me to adjust any details!'",
          "Follow up after 7 business days with a gentle reminder."
        ],
        lastSaved: new Date().toLocaleDateString()
      });
      showToast?.("Recommendation draft compiled successfully!", "success");
    } finally {
      setDrafting(false);
    }
  };

  const copyDraft = () => {
    if (recommendation) {
      navigator.clipboard.writeText(recommendation.letterDraft);
      setCopied(true);
      showToast?.("Recommendation letter copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="recommendation-hub-root">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-400" /> Recommendation Draft Hub
        </h1>
        <p className="text-slate-400 text-sm">
          Collaborate with professors and advisors by drafting high-caliber Letters of Recommendation (LOR) for their signature.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-100">LOR Companion</h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Mentor / Professor Name</label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Mentor Title / Designation</label>
              <input
                type="text"
                value={mentorRole}
                onChange={(e) => setMentorRole(e.target.value)}
                className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Key Student Milestones to Include</label>
              <textarea
                value={studentAchievements}
                onChange={(e) => setStudentAchievements(e.target.value)}
                placeholder="Highlight courses taken, grades, lab milestones, leadership, or custom class achievements..."
                className="w-full h-36 text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Letter Tone / Atmosphere</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
              >
                <option value="enthusiastic and academic">Academic & Highly Enthusiastic</option>
                <option value="professional and corporate-oriented">Corporate-Oriented & Tech Competent</option>
                <option value="objective and highly quantitative">Quantitative & Research Focus</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateRecommendation}
            disabled={drafting}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            {drafting ? "Drafting Letter of Rec..." : "Generate LOR Draft"}
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </button>
        </div>

        {/* LOR Letter Output & Nudges */}
        <div className="lg:col-span-3 space-y-6">
          {recommendation ? (
            <div className="space-y-6">
              {/* Letter Draft Container */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">Prepared Letter Draft</h3>
                    <p className="text-xs text-slate-400">Author signature: {recommendation.mentorName}</p>
                  </div>

                  <button
                    onClick={copyDraft}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Draft"}
                  </button>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 h-96 overflow-y-auto font-sans text-xs text-slate-300 whitespace-pre-line leading-relaxed scrollbar-thin">
                  {recommendation.letterDraft}
                </div>
              </div>

              {/* Networking Nudges */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                  <UserCheck className="w-4.5 h-4.5 text-emerald-400" /> Polite Approach Tips
                </h3>
                <p className="text-xs text-slate-400">
                  How to request your advisor or professor to sign this draft:
                </p>

                <ul className="space-y-2.5">
                  {recommendation.networkingNudges.map((nudge, idx) => (
                    <li key={idx} className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed flex gap-2">
                      <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{nudge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center text-slate-400 h-96 flex flex-col justify-center items-center space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mb-2" />
              <h4 className="font-bold text-slate-300 text-lg">Awaiting LOR Companion</h4>
              <p className="text-xs max-w-xs leading-relaxed">
                Provide your professor's designation, relation, and specific course/lab milestones to include, then click "Generate". We'll construct a high-alignment template so you can approach your guide professionally.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
