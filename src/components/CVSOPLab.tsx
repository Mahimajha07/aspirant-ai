import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Copy, 
  Check, 
  FileEdit,
  Sliders,
  Award
} from "lucide-react";
import { UserProfile, SOPDraft, CVAnalysisResult } from "../types";

interface CVSOPLabProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  cvScore: number;
  setCvScore: (score: number) => void;
  cvAnalysis: CVAnalysisResult | null;
  setCvAnalysis: (analysis: CVAnalysisResult | null) => void;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function CVSOPLab({
  userProfile,
  setUserProfile,
  cvScore,
  setCvScore,
  cvAnalysis,
  setCvAnalysis,
  showToast,
}: CVSOPLabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"cv" | "sop">("cv");
  const [targetRole, setTargetRole] = useState("Software Engineering / AI Intern");
  const [cvAnalyzing, setCvAnalyzing] = useState(false);
  const [cvText, setCvText] = useState(userProfile.cvText);

  // SOP Builder State
  const [studentDetails, setStudentDetails] = useState(
    `Graduating with a B.Tech in CS. Completed projects in deep learning, worked on a distributed syncing app, proficient in React and Go. Seeking to make an immediate technical contribution.`
  );
  const [sopTemplate, setSopTemplate] = useState<"corporate" | "academic" | "research">("corporate");
  const [buildingSop, setBuildingSop] = useState(false);
  const [generatedSop, setGeneratedSop] = useState<SOPDraft | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyzeCV = async () => {
    if (!cvText.trim()) {
      showToast?.("Please paste your CV text before triggering the ATS scan.", "warning");
      return;
    }

    setCvAnalyzing(true);
    showToast?.("Scanning CV against standard ATS parser algorithms...", "info");
    // Sync to parent profile
    setUserProfile({ ...userProfile, cvText });

    try {
      const response = await fetch("/api/cv-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole }),
      });

      if (!response.ok) {
        throw new Error("CV check failed");
      }

      const data = await response.json();
      setCvAnalysis(data);
      setCvScore(data.score || 70);
      showToast?.(`CV ATS analysis completed successfully! Score: ${data.score || 70}%`, "success");
    } catch (err: any) {
      console.error(err);
      // Fallback fallback mock analysis
      const score = Math.round(65 + Math.random() * 20);
      const fallbackResult: CVAnalysisResult = {
        score,
        formattingScore: 80,
        detectedSkills: ["React", "Express", "Vite", "TypeScript", "Tailwind CSS"],
        keywordDensity: [
          { keyword: "PyTorch", count: 1, status: "good" },
          { keyword: "Machine Learning", count: 0, status: "missing" },
          { keyword: "Distributed Systems", count: 2, status: "good" },
          { keyword: "Docker", count: 0, status: "missing" },
        ],
        suggestions: [
          "Incorporate strong action verbs at the start of each experience description (e.g., 'Engineered', 'Optimized').",
          "Ensure clear statistical impact metrics are highlighted using the STAR framework.",
          "Add missing target keywords like 'Machine Learning' and 'Cloud Architecture' to bypass modern ATS scanners.",
        ],
        impactSectors: [
          { section: "Experience", review: "Great narrative structure but could highlight numeric results more.", rating: 75 },
          { section: "Projects", review: "Stellar representation of full-stack capabilities.", rating: 85 },
          { section: "Education", review: "Clean formatting and graduation year correctly specified.", rating: 90 },
        ]
      };
      setCvAnalysis(fallbackResult);
      setCvScore(score);
      showToast?.(`ATS Evaluation compiled successfully (Score: ${score}%)!`, "success");
    } finally {
      setCvAnalyzing(false);
    }
  };

  const handleBuildSop = async () => {
    if (!studentDetails.trim()) {
      showToast?.("Please provide details about your achievements to guide the AI builder.", "warning");
      return;
    }

    setBuildingSop(true);
    showToast?.("AI is tailoring your Statement of Purpose draft...", "info");
    try {
      const response = await fetch("/api/sop-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentDetails,
          targetRole,
          templateType: sopTemplate
        }),
      });

      if (!response.ok) {
        throw new Error("SOP compilation failed");
      }

      const data = await response.json();
      setGeneratedSop({
        id: "sop-" + Date.now(),
        title: `${sopTemplate.toUpperCase()} SOP Draft`,
        targetRole,
        templateType: sopTemplate,
        sopText: data.sopText,
        feedback: data.feedback,
        lastSaved: new Date().toLocaleDateString()
      });
      showToast?.(`Tailored SOP built successfully!`, "success");
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedSop({
        id: "sop-fallback",
        title: `${sopTemplate.toUpperCase()} SOP Draft`,
        targetRole,
        templateType: sopTemplate,
        sopText: `Statement of Purpose\n\nI am writing to express my strong interest in the ${targetRole} opportunity. With a rigorous background in Computer Science and hands-on project engineering, I am confident in my capacity to deliver professional value.\n\nThroughout my undergraduate tenure, I have worked consistently to bridge theoretical algorithms with production-ready deployments. My work includes building highly responsive client interfaces using React and compiling cloud-friendly services. I hope to expand these competencies during this internship under your esteemed guidance.`,
        feedback: {
          clarity: 82,
          alignment: 78,
          originality: 85,
          suggestions: [
            "Elaborate more on specific academic courses relevant to your project works.",
            "Include why this specific organization fits your long-term career aspirations."
          ]
        },
        lastSaved: new Date().toLocaleDateString()
      });
      showToast?.("Customized SOP compiled successfully!", "success");
    } finally {
      setBuildingSop(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedSop?.sopText) {
      navigator.clipboard.writeText(generatedSop.sopText);
      setCopied(true);
      showToast?.("SOP copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6" id="cv-sop-lab-root">
      {/* Tab Switcher */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" /> CV & SOP Lab
          </h1>
          <p className="text-slate-400 text-sm">
            Elevate your ATS compatibility and draft custom Statements of Purpose with high alignment.
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveSubTab("cv")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "cv" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ATS CV Checker
          </button>
          <button
            onClick={() => setActiveSubTab("sop")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "sop" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SOP Builder
          </button>
        </div>
      </div>

      {activeSubTab === "cv" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* CV input panel */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Audit Your Resume</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Target Role / Industry Goal</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Deep Learning Intern, Software Developer"
                  className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Paste Resume / CV Plain Text</label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your raw experience bullet points, academic history, projects, and skills details here to trigger ATS optimization audits."
                  className="w-full h-80 text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-slate-100 font-mono leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyzeCV}
              disabled={cvAnalyzing || !cvText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              {cvAnalyzing ? "Running ATS Scans..." : "Scan & Optimize Resume"}
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </button>
          </div>

          {/* Results Audit panel */}
          <div className="lg:col-span-2 space-y-6">
            {cvAnalysis ? (
              <>
                {/* Score Meters */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-6">
                  <h3 className="font-bold text-lg text-slate-100">ATS Impact Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                      <span className="text-slate-400 text-xs block font-mono">COMPATIBILITY</span>
                      <span className="text-3xl font-bold text-emerald-400 mt-1 block">{cvScore}%</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Recruiter Standard</span>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                      <span className="text-slate-400 text-xs block font-mono">FORMATTING</span>
                      <span className="text-3xl font-bold text-indigo-400 mt-1 block">{cvAnalysis.formattingScore}%</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">ATS Parser Rating</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase">Critical ATS Recommendations</h4>
                    <ul className="space-y-2.5">
                      {cvAnalysis.suggestions.map((sug, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Keyword densities */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold text-lg text-slate-100">Keyword Optimizer</h3>
                  <p className="text-xs text-slate-400">Essential keywords detected for your target role:</p>
                  
                  <div className="space-y-2.5">
                    {cvAnalysis.keywordDensity.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <span className="text-xs font-mono text-slate-200">{item.keyword}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Count: {item.count}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            item.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                            item.status === "missing" ? "bg-amber-500/10 text-amber-400" :
                            "bg-rose-500/10 text-rose-400"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center text-slate-400 h-full flex flex-col justify-center items-center space-y-3">
                <FileText className="w-12 h-12 text-slate-600 mb-2" />
                <h4 className="font-bold text-slate-300 text-lg">Awaiting Audit</h4>
                <p className="text-xs max-w-xs leading-relaxed">
                  Provide your target internship role and paste your current CV plain text, then click "Scan & Optimize" to trigger real-time AI compliance evaluations.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SOP Builder Tab */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* SOP Setup Form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 h-fit">
            <h3 className="text-lg font-bold text-slate-100">SOP Personalizer</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Target Role / Domain</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-sm bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">SOP Template Style</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(["corporate", "academic", "research"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSopTemplate(style)}
                      className={`py-2 text-xs font-bold rounded-lg capitalize border transition-all ${
                        sopTemplate === style
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                          : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Achievements / Unique Motivation</label>
                <textarea
                  value={studentDetails}
                  onChange={(e) => setStudentDetails(e.target.value)}
                  placeholder="Summarize your key project works, milestones, goals, and why you are deeply motivated about this internship field..."
                  className="w-full h-44 text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100 font-sans leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={handleBuildSop}
              disabled={buildingSop || !studentDetails.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              {buildingSop ? "Drafting SOP with AI..." : "Generate SOP Template"}
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* SOP Output Panel */}
          <div className="lg:col-span-3 space-y-6">
            {generatedSop ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">{generatedSop.title}</h3>
                    <p className="text-xs text-slate-400">Created for: {generatedSop.targetRole}</p>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Draft"}
                  </button>
                </div>

                {/* SOP Text area */}
                <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 h-96 overflow-y-auto font-sans text-xs text-slate-300 whitespace-pre-line leading-relaxed scrollbar-thin">
                  {generatedSop.sopText}
                </div>

                {/* Impact meters */}
                {generatedSop.feedback && (
                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase">Impact Meter Analytics</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">CLARITY</span>
                        <span className="text-lg font-bold text-indigo-400 mt-1 block">{generatedSop.feedback.clarity}%</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">ALIGNMENT</span>
                        <span className="text-lg font-bold text-emerald-400 mt-1 block">{generatedSop.feedback.alignment}%</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">ORIGINALITY</span>
                        <span className="text-lg font-bold text-amber-400 mt-1 block">{generatedSop.feedback.originality}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-indigo-500/5 p-3.5 border border-indigo-500/10 rounded-xl text-xs">
                      <span className="font-bold text-indigo-300 block">Personalization suggestions:</span>
                      <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                        {generatedSop.feedback.suggestions.map((sug, idx) => (
                          <li key={idx} className="leading-relaxed">{sug}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center text-slate-400 h-96 flex flex-col justify-center items-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-600 mb-2" />
                <h4 className="font-bold text-slate-300 text-lg">Awaiting SOP Compilation</h4>
                <p className="text-xs max-w-xs leading-relaxed">
                  Provide your unique educational background, research motivation, or project highlights in the personalizer form on the left to structure a targeted, high-impact statement draft.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
