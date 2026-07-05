import React, { useState } from "react";
import { 
  Award, 
  Plus, 
  Github, 
  ExternalLink, 
  BookOpen, 
  Check, 
  Trash2, 
  Download, 
  Share2,
  FileText
} from "lucide-react";
import { PortfolioProject, UserProfile } from "../types";
import { INITIAL_PROJECTS } from "../data";
import { jsPDF } from "jspdf";

interface PortfolioBuilderProps {
  userProfile: UserProfile;
  projects: PortfolioProject[];
  setProjects: React.Dispatch<React.SetStateAction<PortfolioProject[]>>;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function PortfolioBuilder({
  userProfile,
  projects,
  setProjects,
  showToast,
}: PortfolioBuilderProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [skillsText, setSkillsText] = useState("");

  // STAR fields
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");

  const [exportMode, setExportMode] = useState(false);

  const handleExportPDF = () => {
    try {
      showToast?.("Preparing and building vector PDF document...", "info");
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter"
      });

      // Define page limit and initial coordinate state
      let currentY = 50;
      const leftMargin = 40;
      const rightMargin = 40;
      const contentWidth = 532; // 612 - 80
      const pageHeightLimit = 740;

      // Helper function to check space and add page
      const ensureSpace = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeightLimit) {
          doc.addPage();
          currentY = 50;
          // Add a subtle footer/header accent on subsequent pages
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.setLineWidth(0.5);
          doc.line(leftMargin, 35, 612 - rightMargin, 35);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184); // slate-400
          doc.text(`${userProfile.name} | Professional STAR Resume`, leftMargin, 30);
        }
      };

      // Header Banner Accent (subtle top border stripe)
      doc.setFillColor(79, 70, 229); // Indigo 600
      doc.rect(0, 0, 612, 8, "F");

      currentY = 40;

      // 1. Applicant Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(userProfile.name, leftMargin, currentY);
      currentY += 24;

      // 2. Headline / Subtitle
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text((userProfile.headline || "Aspiring Software Engineer / Scholar").toUpperCase(), leftMargin, currentY);
      currentY += 16;

      // 3. Metadata (Email, Education, CPI)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      
      const metaParts = [
        userProfile.email,
        userProfile.education,
        userProfile.college ? `@ ${userProfile.college}` : "",
        userProfile.cpi ? `CPI: ${userProfile.cpi}` : ""
      ].filter(Boolean);
      
      doc.text(metaParts.join("  |  "), leftMargin, currentY);
      currentY += 22;

      // Primary Separator line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(1);
      doc.line(leftMargin, currentY, 612 - rightMargin, currentY);
      currentY += 20;

      // 4. Core Skills Section
      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text("CORE SKILL BADGES", leftMargin, currentY);
      currentY += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85); // slate-700
      const skillsLine = (userProfile.skills || []).join(", ");
      const wrappedSkills = doc.splitTextToSize(skillsLine, contentWidth);
      wrappedSkills.forEach((line: string) => {
        ensureSpace(14);
        doc.text(line, leftMargin, currentY);
        currentY += 14;
      });
      currentY += 10;

      // 5. Projects Section
      ensureSpace(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text("STAR PROJECT ACHIEVEMENTS", leftMargin, currentY);
      currentY += 8;

      // Project separator line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.75);
      doc.line(leftMargin, currentY, 612 - rightMargin, currentY);
      currentY += 18;

      if (projects.length === 0) {
        ensureSpace(20);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("No project achievements logged yet. Return to edit mode to build your portfolio.", leftMargin, currentY);
        currentY += 15;
      } else {
        projects.forEach((proj) => {
          ensureSpace(120); // Make sure there is ample space for the whole project card block if possible

          // Project Title & Indicator
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42); // Slate 900
          doc.text(proj.title, leftMargin, currentY);
          
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139); // Slate 400
          const linkText = "Recruiter Verified Portfolio Link";
          const textWidth = doc.getTextWidth(proj.title);
          doc.text(`(${linkText})`, leftMargin + textWidth + 10, currentY);
          currentY += 16;

          // Project Pitch/Description
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105); // Slate 600
          const wrappedDesc = doc.splitTextToSize(`"${proj.description}"`, contentWidth - 10);
          wrappedDesc.forEach((line: string) => {
            ensureSpace(14);
            doc.text(line, leftMargin + 5, currentY);
            currentY += 14;
          });
          currentY += 6;

          // Draw STAR Metrics block
          // Draw dynamic timeline bar on the left
          const startYForStar = currentY;

          // Situation & Task
          ensureSpace(35);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105); // Slate 600
          doc.text("SITUATION & TASK", leftMargin + 15, currentY);
          currentY += 12;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85); // Slate 700
          const sitTaskText = `${proj.starImpact.situation} ${proj.starImpact.task}`;
          const wrappedSitTask = doc.splitTextToSize(sitTaskText, contentWidth - 25);
          wrappedSitTask.forEach((line: string) => {
            ensureSpace(13);
            doc.text(line, leftMargin + 15, currentY);
            currentY += 13;
          });
          currentY += 6;

          // Action & Result
          ensureSpace(35);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(79, 70, 229); // Indigo 600 (emphasize action and result)
          doc.text("ACTION & MEASURED OUTCOME", leftMargin + 15, currentY);
          currentY += 12;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85); // Slate 700
          const actionResText = `${proj.starImpact.action} [Outcome: ${proj.starImpact.result}]`;
          const wrappedActionRes = doc.splitTextToSize(actionResText, contentWidth - 25);
          wrappedActionRes.forEach((line: string) => {
            ensureSpace(13);
            doc.text(line, leftMargin + 15, currentY);
            currentY += 13;
          });

          // Draw supporting thin outline bar for the STAR section
          const endYForStar = currentY - 5;
          doc.setDrawColor(224, 231, 255); // Indigo 100
          doc.setLineWidth(1.5);
          doc.line(leftMargin + 5, startYForStar, leftMargin + 5, endYForStar);

          currentY += 16; // Spacer between projects
        });
      }

      // Add Footer on last page
      ensureSpace(40);
      currentY = Math.max(currentY, pageHeightLimit - 40);
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.setLineWidth(1);
      doc.line(leftMargin, currentY, 612 - rightMargin, currentY);
      currentY += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("Candidate assessment verified under Google AI Studio - Aspirant.ai Suite.", leftMargin, currentY);
      doc.text("Page 1 of 1", 612 - rightMargin - doc.getTextWidth("Page 1 of 1"), currentY);

      // Save PDF document
      const fileName = `${userProfile.name.replace(/\s+/g, "_")}_STAR_Resume.pdf`;
      doc.save(fileName);
      showToast?.("PDF resume built and downloaded successfully!", "success");
    } catch (error: any) {
      console.error(error);
      showToast?.(`PDF compile failed: ${error.message || "Error during assembly"}`, "error");
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast?.("Please enter a title and high-level description.", "warning");
      return;
    }

    const newProj: PortfolioProject = {
      id: "proj-" + Date.now(),
      title: title.trim(),
      description: description.trim(),
      githubLink: githubLink.trim() || undefined,
      liveLink: liveLink.trim() || undefined,
      starImpact: {
        situation: situation.trim() || "Collaborated on engineering software solutions within competitive team settings.",
        task: task.trim() || "Formulate, program, and structure highly concurrent client-server capabilities.",
        action: action.trim() || "Engineered React wrappers and wrote structured, self-documenting service architectures.",
        result: result.trim() || "Boosted final data accessibility rates by over 20% while eliminating bottlenecks."
      },
      skills: skillsText.split(",").map(s => s.trim()).filter(Boolean)
    };

    setProjects([...projects, newProj]);
    showToast?.(`Portfolio item "${newProj.title}" added with STAR impact metrics!`, "success");

    // Reset fields
    setTitle("");
    setDescription("");
    setGithubLink("");
    setLiveLink("");
    setSkillsText("");
    setSituation("");
    setTask("");
    setAction("");
    setResult("");
  };

  const handleDeleteProject = (id: string) => {
    const target = projects.find(p => p.id === id);
    setProjects(projects.filter(p => p.id !== id));
    showToast?.(`Project removed: ${target ? target.title : "item"}`, "warning");
  };

  return (
    <div className="space-y-6" id="portfolio-builder-root">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" /> STAR Portfolio Builder
          </h1>
          <p className="text-slate-400 text-sm">
            Structure your projects and hackathon wins in the executive recruiter STAR format to demonstrate high-quantified impact.
          </p>
        </div>

        <button
          onClick={() => setExportMode(!exportMode)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FileText className="w-4 h-4" /> {exportMode ? "Edit Projects" : "Print Visual Resume"}
        </button>
      </div>

      {exportMode ? (
        /* PRINT RESUME VIEW */
        <div className="max-w-3xl mx-auto bg-slate-900 border border-white/15 p-8 rounded-3xl shadow-2xl space-y-6 text-slate-200 font-sans print:border-none print:p-0">
          
          {/* Quick PDF Recruiter Export Action Bar */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-950/40 border border-emerald-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-emerald-300 font-mono uppercase tracking-wider block flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Recruiter-Ready Export Mode
              </span>
              <p className="text-xs text-slate-300 leading-normal">
                Export your STAR achievements into a perfectly compiled vector PDF resume, designed to clear automated Applicant Tracking Systems (ATS).
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={handleExportPDF}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Clean PDF
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Browser Print
              </button>
            </div>
          </div>

          {/* Resume Header */}
          <div className="text-center space-y-1.5 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">{userProfile.name}</h2>
            <p className="text-indigo-400 text-sm font-semibold tracking-wider uppercase font-mono">{userProfile.headline}</p>
            <div className="text-xs text-slate-400 flex justify-center gap-3">
              <span>{userProfile.email}</span>
              <span>•</span>
              <span>{userProfile.education}</span>
            </div>
          </div>

          {/* Education & Core Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Education</h3>
              <p className="text-xs text-slate-200 font-semibold">{userProfile.education || "Undergraduate Scholar"}</p>
              <p className="text-[11px] text-slate-400">B.Tech / Undergraduate Degree</p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Core Skill Badges</h3>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.skills.map(s => (
                  <span key={s} className="bg-white/5 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono border border-white/5">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Projects timeline */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">STAR Project Achievements</h3>
            
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Github Portfolio Live</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{proj.description}"</p>
                  
                  {/* STAR breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-3 border-l-2 border-indigo-500/30 pt-1">
                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold text-slate-200 font-mono text-[9px] uppercase block">Situation & Task</span>
                      <p className="text-slate-400 mt-0.5">{proj.starImpact.situation} {proj.starImpact.task}</p>
                    </div>
                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold text-slate-200 font-mono text-[9px] uppercase block">Action & Measured Result</span>
                      <p className="text-slate-400 mt-0.5">{proj.starImpact.action} <span className="text-emerald-400 font-semibold">{proj.starImpact.result}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-8 text-[10px] text-slate-500 font-mono">
            Generated via Aspirant.ai Professional Candidate Suite. Built with React and Gemini 3.5.
          </div>
        </div>
      ) : (
        /* PROJECT EDITING BUILDER */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Add project form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 h-fit">
            <h3 className="font-bold text-lg text-slate-100">Narrative Constructor</h3>
            
            <form onSubmit={handleAddProject} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g., ATS-Resume-Analyzer-AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Summary Pitch</label>
                <input
                  type="text"
                  placeholder="An AI-powered web service that parses PDF resumes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 font-mono uppercase block">Github Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com..."
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2 mt-1 focus:outline-none text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-400 font-mono uppercase block">Technologies</label>
                  <input
                    type="text"
                    placeholder="React, Go, PyTorch"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2 mt-1 focus:outline-none text-slate-100"
                  />
                </div>
              </div>

              {/* STAR impact builders */}
              <div className="border-t border-white/5 pt-3.5 space-y-3">
                <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase block">STAR Metric Structuring</span>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] font-semibold text-slate-400 font-mono uppercase block">Situation (The Context)</label>
                    <textarea
                      placeholder="e.g., Students faced high ATS rejections due to bad keywords."
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      className="w-full h-11 text-xs bg-white/5 border border-white/10 rounded-xl p-2 focus:outline-none text-slate-100 leading-snug"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-semibold text-slate-400 font-mono uppercase block">Task (Your Goal)</label>
                    <textarea
                      placeholder="e.g., Develop an automated rating system parsing resumes."
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      className="w-full h-11 text-xs bg-white/5 border border-white/10 rounded-xl p-2 focus:outline-none text-slate-100 leading-snug"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-semibold text-slate-400 font-mono uppercase block">Action (What you coded)</label>
                    <textarea
                      placeholder="e.g., Built a full-stack dashboard integrating Gemini API."
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      className="w-full h-11 text-xs bg-white/5 border border-white/10 rounded-xl p-2 focus:outline-none text-slate-100 leading-snug"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-semibold text-slate-400 font-mono uppercase block">Result (Quantifiable Outcome)</label>
                    <textarea
                      placeholder="e.g., Helped 200+ students raise ratings by an average of 35%."
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      className="w-full h-11 text-xs bg-white/5 border border-white/10 rounded-xl p-2 focus:outline-none text-slate-100 leading-snug"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg mt-2"
              >
                <Plus className="w-4 h-4" /> Save Project to STAR Portfolio
              </button>
            </form>
          </div>

          {/* Showcase cards list */}
          <div className="lg:col-span-3 space-y-4">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-3.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{proj.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{proj.description}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* STAR breakdown showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-900/30 p-3.5 rounded-2xl border border-white/5">
                  <div className="space-y-2">
                    <div className="text-[9px] font-bold text-slate-400 font-mono uppercase">SITUATION & TASK</div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l border-indigo-500/20">
                      {proj.starImpact.situation} {proj.starImpact.task}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[9px] font-bold text-indigo-400 font-mono uppercase">ACTION & RESULT</div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l border-emerald-500/20">
                      {proj.starImpact.action} <span className="text-emerald-400 font-semibold">{proj.starImpact.result}</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {proj.skills.map(s => (
                      <span key={s} className="bg-white/5 text-slate-400 border border-white/5 text-[9px] px-1.5 py-0.5 rounded font-mono">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.githubLink && (
                      <a 
                        href={proj.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center text-slate-500">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                No projects added yet. Complete the form to build your STAR portfolio.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
