import React, { useState } from "react";
import { 
  TrendingUp, 
  Award, 
  ExternalLink, 
  Plus, 
  Check, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2,
  Linkedin
} from "lucide-react";
import { CertificationCourse, UserProfile } from "../types";
import { INITIAL_COURSES } from "../data";

interface SkillGapAnalysisProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  courses: CertificationCourse[];
  setCourses: React.Dispatch<React.SetStateAction<CertificationCourse[]>>;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function SkillGapAnalysis({
  userProfile,
  setUserProfile,
  courses,
  setCourses,
  showToast,
}: SkillGapAnalysisProps) {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseProvider, setCourseProvider] = useState<CertificationCourse["provider"]>("Coursera");
  const [courseDomain, setCourseDomain] = useState("AI");
  const [courseDuration, setCourseDuration] = useState("4 Weeks");

  // Local sync stats
  const completedCount = courses.filter((c) => c.status === "Completed").length;
  const inProgressCount = courses.filter((c) => c.status === "In Progress").length;

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const newCrs: CertificationCourse = {
      id: "crs-" + Date.now(),
      title: courseTitle.trim(),
      provider: courseProvider,
      domain: courseDomain,
      duration: courseDuration,
      status: "Not Started",
      link: "https://google.com"
    };

    setCourses([...courses, newCrs]);
    showToast?.(`Target course "${newCrs.title}" added!`, "success");
    setCourseTitle("");
  };

  const handleUpdateStatus = (id: string, nextStatus: CertificationCourse["status"]) => {
    setCourses(prev => prev.map((crs) => {
      if (crs.id === id) {
        // If transitioning to completed, append a credential badge
        if (nextStatus === "Completed" && crs.status !== "Completed") {
          const badgeName = `${crs.title} Certification`;
          if (!userProfile.certifications.includes(badgeName)) {
            setUserProfile({
              ...userProfile,
              certifications: [...userProfile.certifications, badgeName],
              skills: [...userProfile.skills, crs.title]
            });
          }
          showToast?.(`Congratulations! You completed "${crs.title}" and earned a certification badge!`, "success");
        } else {
          showToast?.(`Course state updated to "${nextStatus}"`, "info");
        }
        return { ...crs, status: nextStatus };
      }
      return crs;
    }));
  };

  const handleDeleteCourse = (id: string) => {
    const target = courses.find(c => c.id === id);
    setCourses(prev => prev.filter(c => c.id !== id));
    showToast?.(`Course removed: ${target ? target.title : "item"}`, "warning");
  };

  // Auto-calculated profile gaps
  const getProfileGaps = () => {
    const gaps = [];
    
    // Check AI / ML focus
    const hasAI = userProfile.skills.some(s => ["ai", "pytorch", "deep learning", "machine learning", "transformers"].some(kw => s.toLowerCase().includes(kw)));
    if (!hasAI) {
      gaps.push({
        id: "gap-1",
        title: "Deep Learning & Transformer Models",
        text: "85% of AI and Machine Learning internship openings require hands-on understanding of PyTorch or transformer models.",
        reco: "Deep Learning Specialization (Coursera) or AI Practitioner Certification (IBM SkillsBuild)"
      });
    }

    // Check Cloud focus
    const hasCloud = userProfile.skills.some(s => ["cloud", "aws", "azure", "distributed", "docker"].some(kw => s.toLowerCase().includes(kw)));
    if (!hasCloud) {
      gaps.push({
        id: "gap-2",
        title: "Cloud & Distributed System Topologies",
        text: "Elite CS internships at companies like Stripe and Vercel look for candidate experience in Cloud systems or container infrastructure.",
        reco: "AWS Cloud Practitioner, AZ-900, or NPTEL Database Systems"
      });
    }

    // Check general portfolio project density
    if (userProfile.skills.length < 5) {
      gaps.push({
        id: "gap-3",
        title: "General Core Portfolio Skills",
        text: "Most competitive applicants list more than 5 core programming frameworks on their resume.",
        reco: "Identify 2 missing high-density keywords and complete foundational tutorials."
      });
    }

    return gaps;
  };

  const currentGaps = getProfileGaps();

  return (
    <div className="space-y-6" id="skill-gap-analysis-root">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-400" /> Skill & Gap Analysis
        </h1>
        <p className="text-slate-400 text-sm">
          Track certification courses from top-tier academic providers, earn dynamic badges, and sync credentials to LinkedIn.
        </p>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left pane: gaps & alerts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Smart Gap Alerts */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Recruiter Gap Alerts
            </h3>
            
            <div className="space-y-4">
              {currentGaps.map((gap) => (
                <div key={gap.id} className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                  <p className="text-sm font-bold text-amber-200">{gap.title}</p>
                  <p className="text-xs text-amber-100/75 leading-relaxed">{gap.text}</p>
                  <div className="pt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 font-mono px-2 py-0.5 rounded">RECOMMENDED</span>
                    <span className="text-[10px] text-slate-300 italic">{gap.reco}</span>
                  </div>
                </div>
              ))}

              {currentGaps.length === 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-300">No Major Skills Gaps Detected</p>
                    <p className="text-xs text-emerald-100/75 mt-1 leading-relaxed">
                      Your listed profile skills and certifications show deep coverage across cloud, full-stack, and advanced data paradigms.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 text-center">
            <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase">Certification Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <span className="text-slate-400 text-[10px] font-mono block">COMPLETED</span>
                <span className="text-2xl font-bold text-emerald-400 block mt-1">{completedCount}</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <span className="text-slate-400 text-[10px] font-mono block">IN PROGRESS</span>
                <span className="text-2xl font-bold text-indigo-400 block mt-1">{inProgressCount}</span>
              </div>
            </div>

            {userProfile.certifications.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2.5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Earned LinkedIn Badges</span>
                <div className="space-y-1.5">
                  {userProfile.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        {cert}
                      </span>
                      <span className="text-[9px] font-mono text-[#0A66C2] flex items-center gap-0.5">
                        <Linkedin className="w-2.5 h-2.5" /> synced
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Course list & manual tracker additions */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Add Course form */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Register New Skills Course</h3>
            
            <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g., Deep Learning Specialization"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Provider</label>
                <select
                  value={courseProvider}
                  onChange={(e) => setCourseProvider(e.target.value as CertificationCourse["provider"])}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-200"
                >
                  <option value="Coursera">Coursera</option>
                  <option value="IBM SkillsBuild">IBM SkillsBuild</option>
                  <option value="NPTEL">NPTEL</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Udacity">Udacity</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Skill Domain</label>
                <input
                  type="text"
                  placeholder="e.g., AI, Cloud, CS, Data Science"
                  value={courseDomain}
                  onChange={(e) => setCourseDomain(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 font-mono uppercase block">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 6 Weeks, 12 Weeks"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 mt-1.5 focus:outline-none text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg mt-2"
              >
                <Plus className="w-4 h-4" /> Add Academic Course Tracker
              </button>
            </form>
          </div>

          {/* List of Courses */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-100">Aspirational Certification Timeline</h3>
            
            <div className="space-y-3">
              {courses.map((crs) => (
                <div 
                  key={crs.id}
                  className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/10"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{crs.title}</span>
                      <span className="bg-white/10 text-slate-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                        {crs.provider}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Domain: {crs.domain}</span>
                      <span>•</span>
                      <span>Duration: {crs.duration}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    {/* Status badge toggling */}
                    <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
                      {(["Not Started", "In Progress", "Completed"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(crs.id, st)}
                          className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${
                            crs.status === st 
                              ? st === "Completed" ? "bg-emerald-600 text-white" : st === "In Progress" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-200"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleDeleteCourse(crs.id)}
                      className="p-1.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  No courses registered in tracker. Add courses above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
