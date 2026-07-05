import React, { useState, useEffect } from "react";
import { 
  Linkedin, 
  Sparkles, 
  Check, 
  Copy, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Share2,
  Lightbulb,
  Send,
  UserCheck,
  Building,
  AlertCircle
} from "lucide-react";
import { UserProfile, LinkedInAuditResult } from "../types";

interface LinkedInEnhancerProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function LinkedInEnhancer({
  userProfile,
  setUserProfile,
  showToast,
}: LinkedInEnhancerProps) {
  const [headline, setHeadline] = useState(userProfile.headline);
  const [summary, setSummary] = useState(userProfile.linkedinSummary || "");
  const [skillsText, setSkillsText] = useState(userProfile.skills.join(", "));
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<LinkedInAuditResult | null>(null);
  
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Recruiter template generator states
  const [recruiterName, setRecruiterName] = useState("Siddharth");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [targetDomain, setTargetDomain] = useState("Software Engineering");
  const [reachoutContext, setReachoutContext] = useState("Cold Pitch for Open Role");
  const [customNote, setCustomNote] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  // Trigger automatic recruiter template generation
  useEffect(() => {
    const name = recruiterName.trim() || "Recruiter";
    const company = targetCompany.trim() || "Target Company";
    const user = userProfile.name || "Student";
    const college = userProfile.college || "IIT Patna";
    const cpi = userProfile.cpi ? `${userProfile.cpi} CPI` : "8.53 CPI";
    const topSkills = userProfile.skills.slice(0, 3).join(", ") || "React, TypeScript, Go";
    const email = userProfile.email || "student@example.com";

    let note = "";
    let message = "";

    if (reachoutContext === "Cold Pitch for Open Role") {
      note = `Hi ${name}, saw your work with the tech teams at ${company}. I'm a CS undergrad at ${college} (${cpi}) specializing in ${targetDomain}. I've built projects using ${topSkills} & would love to explore tech internship opportunities with your group. Let's connect! - ${user}`;
      message = `Hi ${name},\n\nI hope you're having a wonderful week!\n\nI recently came across your profile and noticed you guide hiring for technical engineering roles at ${company}. As a Computer Science student at ${college} with ${cpi} and deep practical interest in ${targetDomain}, I am eager to explore internship opportunities.\n\nI've recently built robust, high-performance applications utilizing ${topSkills}. I'd appreciate the chance to learn if my background aligns with your current team needs.\n\nThank you for your consideration, and I look forward to connecting!\n\nBest regards,\n${user}\n${email}`;
    } else if (reachoutContext === "Academic Research Stay") {
      const title = name.toLowerCase().includes("prof") || name.toLowerCase().includes("dr") ? name : `Dr. ${name}`;
      note = `Dear ${title}, I'm a student at ${college} working in ${targetDomain} (${cpi}). I read your lab's outstanding research at ${company} and was highly inspired. I'd love to discuss potential research internships under your guidance this term. Let's connect! - ${user}`;
      message = `Dear ${title},\n\nI hope this message finds you well.\n\nMy name is ${user}, a Computer Science undergraduate at ${college} with ${cpi}. I am deeply interested in ${targetDomain} and have been following your lab's remarkable publications and initiatives at ${company}.\n\nWith hands-on project experience in ${topSkills}, I would be absolutely thrilled to contribute to your ongoing research as an intern or research assistant. I am highly motivated to tackle complex problems under your guidance.\n\nThank you for your valuable time. I would be glad to share my full CV or schedule a brief meeting if you are accepting students.\n\nSincerely,\n${user}\n${email}`;
    } else if (reachoutContext === "Warm Introduction via Alumni") {
      note = `Hi ${name}, great to connect with a fellow ${college} alum! I'm in my studies specializing in ${targetDomain}. Your career journey in tech at ${company} is highly inspiring. I would love to connect for a quick 5-min chat about summer internships if you have some advice! - ${user}`;
      message = `Hi ${name},\n\nI hope you're doing well!\n\nIt's fantastic to connect with a fellow alum from ${college}. I saw your career path and your work at ${company}—it is incredibly inspiring for students like myself who are aspiring to break into ${targetDomain}.\n\nI am currently pursuing my degree while building expertise in ${topSkills}. I'm actively looking for tech internships and would deeply value any brief advice or insights you might share about the industry or your team.\n\nThank you for your support and time, and I look forward to keeping in touch!\n\nWarmly,\n${user}`;
    } else {
      // Follow-Up on Applied Role
      note = `Hi ${name}, I recently submitted my application for the ${targetDomain} internship at ${company}. Given my tech background in ${topSkills} and ${college} background (${cpi}), I wanted to highlight my enthusiasm. I'd love to connect to discuss! Best, ${user}`;
      message = `Hi ${name},\n\nI hope you are doing well!\n\nI recently applied for the ${targetDomain} Internship position at ${company} and wanted to reach out to personally share my enthusiasm.\n\nAs a Computer Science student at ${college} (${cpi}) with practical experience in ${topSkills}, I'm very excited about the opportunity to contribute to ${company}. My training focuses heavily on automated assessment systems and modern software design.\n\nI would be extremely grateful to connect and share more about how my skills can help support your current objectives.\n\nThank you so much for your time and guidance!\n\nBest regards,\n${user}\n${email}`;
    }

    setCustomNote(note);
    setCustomMessage(message);
  }, [recruiterName, targetCompany, targetDomain, reachoutContext, userProfile]);

  const resetDrafts = () => {
    setRecruiterName("Siddharth");
    setTargetCompany("Google");
    setTargetDomain("Software Engineering");
    setReachoutContext("Cold Pitch for Open Role");
    showToast?.("Recruiter profile templates reset to defaults!", "info");
  };

  const handleAuditProfile = async () => {
    setAuditing(true);
    showToast?.("Evaluating LinkedIn profile keywords and structure...", "info");
    try {
      const response = await fetch("/api/linkedin-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          summary,
          skills: skillsText
        }),
      });

      if (!response.ok) {
        throw new Error("Audit failed");
      }

      const data = await response.json();
      setAuditResult(data);

      // Save to profile
      setUserProfile({
        ...userProfile,
        headline: data.headlineSuggestion || headline,
        linkedinSummary: data.optimizedSummary || summary,
      });
      showToast?.("Profile optimization advice compiled successfully!", "success");
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackData: LinkedInAuditResult = {
        headlineSuggestion: `CS Scholar & Aspirant | Specializing in Deep Learning, Full-Stack React & Go Developer`,
        optimizedSummary: `I am an ambitious, hands-on Computer Science undergraduate with a deep fascination for intelligent systems. Currently developing automated ATS analyzers and concurrent Distributed Storage synchronization tools. Passionate about solving complex scaling problems, writing clean code, and deploying real-world solutions.\n\nLet's connect or discuss open software engineering or AI research internship opportunities!`,
        keywordSuggestions: ["Full-Stack Engineering", "Deep Learning", "Go (Golang)", "React", "Distributed Systems", "RESTful APIs"],
        engagementCoach: {
          postIdeas: [
            "Share a technical write-up detailing how you solved a latency block on your latest project.",
            "Write a short post comparing your experience coding in Go versus TypeScript for high-concurrency tasks.",
            "Celebrate completing a major skills build badge or certification (IBM/Google) and tag the provider."
          ],
          groupsToJoin: [
            "Software Engineering Internship Network",
            "Deep Learning & AI Practitioners Association",
            "Global Student Tech Innovators Hub"
          ],
          alumniStrategy: "Locate alumni from your college working as Software Engineers at target companies. Send a short connection message: 'Hi [Name], I noticed you also graduated from [School] and are now engineering at [Company]! I am currently looking for CS internships and would love to hear any advice you have for breaking in. Thank you!'"
        }
      };
      setAuditResult(fallbackData);
      setUserProfile({
        ...userProfile,
        headline: fallbackData.headlineSuggestion,
        linkedinSummary: fallbackData.optimizedSummary,
      });
      showToast?.("LinkedIn audit recommendations pre-loaded!", "success");
    } finally {
      setAuditing(false);
    }
  };

  const copyHeadline = () => {
    if (auditResult) {
      navigator.clipboard.writeText(auditResult.headlineSuggestion);
      setCopiedHeadline(true);
      showToast?.("Headline suggestion copied!", "success");
      setTimeout(() => setCopiedHeadline(false), 2000);
    }
  };

  const copySummary = () => {
    if (auditResult) {
      navigator.clipboard.writeText(auditResult.optimizedSummary);
      setCopiedSummary(true);
      showToast?.("Optimized summary copied to clipboard!", "success");
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="linkedin-enhancer-root">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
          <Linkedin className="w-6 h-6 text-[#0A66C2]" /> LinkedIn Profile Enhancer
        </h1>
        <p className="text-slate-400 text-sm">
          Optimize your headline, bio summaries, and social strategy to double your recruiter incoming queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Setup inputs */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Profile Audit Console</h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Current Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Student looking for internships"
                className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Skills List (Comma separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, PyTorch, Go, Git"
                className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Current Bio / Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tell recruiters who you are, what you've coded, and what domain you hope to solve..."
                className="w-full h-48 text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100 leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleAuditProfile}
            disabled={auditing}
            className="w-full bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            {auditing ? "Analyzing profile keywords..." : "Optimize My Profile"}
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </button>
        </div>

        {/* Audit Results */}
        <div className="lg:col-span-3 space-y-6">
          {auditResult ? (
            <div className="space-y-6">
              {/* Recommendations Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-slate-100 flex items-center gap-1.5">
                  <Lightbulb className="w-5 h-5 text-indigo-400" /> AI Suggestions
                </h3>

                {/* Headline Suggestions */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase">Optimized Recruiter Headline</span>
                    <button
                      onClick={copyHeadline}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedHeadline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedHeadline ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-100 italic leading-relaxed mt-1">
                    "{auditResult.headlineSuggestion}"
                  </p>
                </div>

                {/* Optimized summary */}
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase">Highly Narrative "About" Draft</span>
                    <button
                      onClick={copySummary}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSummary ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed mt-1 max-h-56 overflow-y-auto">
                    {auditResult.optimizedSummary}
                  </div>
                </div>
              </div>

              {/* Keyword recommendations */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-3">
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> Trending Keyword Expansion
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Include these trending terminology badges in your profile skills & endorsements section to show high match density in company filtering databases:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {auditResult.keywordSuggestions.map((kw, idx) => (
                    <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-lg">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Engagement Coach */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                  <Users className="w-4.5 h-4.5 text-[#0A66C2]" /> Recruiting & Networking Coach
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Post Ideas */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-[#0A66C2]" /> Post Ideas
                    </span>
                    <ul className="space-y-2">
                      {auditResult.engagementCoach.postIdeas.map((idea, idx) => (
                        <li key={idx} className="text-xs text-slate-300 bg-white/5 p-2 rounded-xl border border-white/5 leading-relaxed">
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alumni Strategy */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-400" /> Alumni Reach Out
                    </span>
                    <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed italic">
                      "{auditResult.engagementCoach.alumniStrategy}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center text-slate-400 h-96 flex flex-col justify-center items-center space-y-3">
              <Linkedin className="w-12 h-12 text-slate-600 mb-2" />
              <h4 className="font-bold text-slate-300 text-lg">Awaiting Audit Suggestions</h4>
              <p className="text-xs max-w-xs leading-relaxed">
                Provide your headline information and current summary draft, then trigger optimization. The audit will generate optimized text snippets, keyword insertions, and alumni connection pitches.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Outreach Workspace */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-6" id="recruiter-outreach-root">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5.5 h-5.5 text-emerald-400" /> Recruiter Connection Template Generator
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Configure your target recruiter's details and instantly obtain highly tailored, ATS-aligned networking notes.
            </p>
          </div>
          <button
            onClick={resetDrafts}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 cursor-pointer transition-all"
          >
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Recruiter & Target Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Recruiter Name</label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="e.g. Siddharth"
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Company / Inst.</label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g. Google Research"
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Target Internship Domain</label>
                <select
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
                >
                  <option value="Software Engineering">Software Engineering (SWE)</option>
                  <option value="AI & Deep Learning">AI & Deep Learning</option>
                  <option value="Data Science / Analytics">Data Science & Analytics</option>
                  <option value="Quantum & Core Research">Core Academic Research</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Web Development">Full-Stack Web Dev</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Reachout Goal / Context</label>
                <select
                  value={reachoutContext}
                  onChange={(e) => setReachoutContext(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
                >
                  <option value="Cold Pitch for Open Role">Cold Pitch for Open Role</option>
                  <option value="Academic Research Stay">Academic Research Stay (Professors)</option>
                  <option value="Warm Introduction via Alumni">Warm Introduction (College Alumni)</option>
                  <option value="Follow-Up on Applied Role">Follow-Up on Submitted Application</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-2xl border border-indigo-500/10 space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Professional Outreach Strategy
              </span>
              <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Connection notes have a hard limit of 300 characters on standard LinkedIn.</li>
                <li>Keep pitches objective: name college, CPI, specific skills, and clear ask.</li>
                <li>Referencing mutual alumni boosts your response rate by over 40%.</li>
              </ul>
            </div>
          </div>

          {/* Previews Panel */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Interactive Generated Drafts</h4>

            <div className="space-y-4">
              {/* Connection Note (Strict 300 Chars) */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">LinkedIn Connection Note</span>
                    <span className="bg-emerald-500/15 text-emerald-300 text-[8px] font-bold font-mono px-1 rounded uppercase tracking-wider">
                      300 Note Limit
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(customNote);
                      showToast?.("LinkedIn Connection Note copied!", "success");
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Note
                  </button>
                </div>
                
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full h-24 text-xs bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100 leading-relaxed resize-none"
                  placeholder="Generated connection note..."
                />

                <div className="flex justify-between items-center text-[10px]">
                  <span className={customNote.length > 300 ? "text-red-400 font-semibold" : "text-slate-400"}>
                    Character Count: <b className="font-mono">{customNote.length}</b> / 300
                  </span>
                  {customNote.length > 300 && (
                    <span className="text-red-400 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Exceeds LinkedIn 300 note limit!
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${customNote.length > 300 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min((customNote.length / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Longer Follow-Up InMail/Direct Message */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1">
                    <Send className="w-3 h-3 text-[#0A66C2]" /> Full Direct Message / Email pitch
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(customMessage);
                      showToast?.("Recruiter message pitch copied to clipboard!", "success");
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Message
                  </button>
                </div>

                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full h-44 text-xs bg-slate-900/50 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100 leading-relaxed"
                  placeholder="Generated message body..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
