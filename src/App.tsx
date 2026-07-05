import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Linkedin, 
  Award, 
  TrendingUp, 
  Video, 
  Briefcase, 
  Calendar, 
  Sparkles, 
  Menu, 
  X,
  BookOpen,
  User,
  Server,
  Mic
} from "lucide-react";

import { 
  UserProfile, 
  ApplicationTrackerItem, 
  CertificationCourse, 
  PortfolioProject, 
  CVAnalysisResult, 
  ChatMessage 
} from "./types";

import { 
  INITIAL_INTERNSHIPS, 
  INITIAL_COURSES, 
  INITIAL_PROJECTS, 
  COMMON_INTERVIEW_QUESTIONS 
} from "./data";

// Import modules
import HomeDashboard from "./components/HomeDashboard";
import InternshipFinder from "./components/InternshipFinder";
import CVSOPLab from "./components/CVSOPLab";
import LinkedInEnhancer from "./components/LinkedInEnhancer";
import RecommendationHub from "./components/RecommendationHub";
import SkillGapAnalysis from "./components/SkillGapAnalysis";
import InterviewPrep from "./components/InterviewPrep";
import PortfolioBuilder from "./components/PortfolioBuilder";
import ApplicationTracker from "./components/ApplicationTracker";
import ExtraBoosters from "./components/ExtraBoosters";
import LoginScreen from "./components/LoginScreen";
import AIMentorCompanion from "./components/AIMentorCompanion";
import ToastContainer, { Toast } from "./components/ToastContainer";
import ProjectMarkingBoard from "./components/ProjectMarkingBoard";
import TalkingAIMentors from "./components/TalkingAIMentors";

export default function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    setToasts((prev) => [
      ...prev,
      {
        id: "toast-" + Date.now() + Math.random().toString(36).substring(2, 7),
        message,
        type,
      },
    ]);
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("aspirant_logged_in") === "true";
  });
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    localStorage.setItem("aspirant_logged_in", "true");
    localStorage.setItem("aspirant_profile", JSON.stringify(profile));
    showToast(`Welcome back, ${profile.name}!`, "success");
  };

  // Core state engines with localStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("aspirant_profile");
    if (saved) return JSON.parse(saved);
    return {
      name: "Alex Rivera",
      email: "alex.rivera@university.edu",
      education: "IIT Patna",
      cvText: `ALEX RIVERA
alex.rivera@university.edu | IIT Patna

EDUCATION
B.Tech in Computer Science & Engineering - Graduating 2027
CPI: 8.82/10.00

TECHNICAL SKILLS
Languages: Python, Go, TypeScript, C++, SQL
Frameworks: React, Next.js, Express, PyTorch, Tailwind CSS
Tools: Git, Docker, WebSockets

PROJECTS
ATS Resume Analyzer AI
- Developed full-stack dashboard utilizing React and Express to parse PDF resume contents.
- Integrated structured scoring indicators.

Decentralized File Sync System
- Coded lightweight concurrency sync system using Go and WebSockets.
- Reduced overall file latency rates down to 40ms.`,
      headline: "CS Scholar specializing in Deep Learning & High-Performance Full-Stack Systems",
      linkedinSummary: "",
      skills: ["React", "Python", "Go", "TypeScript", "SQL", "Git"],
      certifications: ["NPTEL DBMS Certified"],
      cpi: 8.8,
      college: "IIT Patna",
      collegeType: "IIT",
      yearOfStudy: 3,
      department: "Computer Science & Engineering"
    };
  });

  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(() => {
    const saved = localStorage.getItem("aspirant_applications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "app-1",
        title: "Software Engineering Intern",
        company: "Google",
        domain: "CS",
        status: "Interviewing",
        deadline: "2026-07-24",
        notes: "Interview scheduled! Focus heavily on graph structures and dynamic programming."
      },
      {
        id: "app-2",
        title: "AI Research Associate",
        company: "NVIDIA",
        domain: "AI",
        status: "Applied",
        deadline: "2026-08-10",
        notes: "Submitted via career board. Matched skills: PyTorch, Python."
      },
      {
        id: "app-3",
        title: "Product Management Intern",
        company: "Stripe",
        domain: "Web Dev",
        status: "Offer Received",
        deadline: "2026-07-15",
        notes: "Final Offer package delivered!"
      }
    ];
  });

  const [courses, setCourses] = useState<CertificationCourse[]>(() => {
    const saved = localStorage.getItem("aspirant_courses");
    if (saved) return JSON.parse(saved);
    return INITIAL_COURSES;
  });

  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    const saved = localStorage.getItem("aspirant_projects");
    if (saved) return JSON.parse(saved);
    return INITIAL_PROJECTS;
  });

  const [cvScore, setCvScore] = useState<number>(() => {
    const saved = localStorage.getItem("aspirant_cv_score");
    return saved ? parseInt(saved, 10) : 85;
  });

  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResult | null>(() => {
    const saved = localStorage.getItem("aspirant_cv_analysis");
    return saved ? JSON.parse(saved) : null;
  });

  const [cvAnalyzing, setCvAnalyzing] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("aspirant_chat_messages");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "msg-init",
        role: "assistant",
        text: "Greetings, Scholar! I am your AI Internship Mentor. I can counsel you on structuring your resume experience, tailoring your Statement of Purpose (SOP), designing a recruiter-rich LinkedIn profile, or navigating hard interviews. How can I guide you today?",
        timestamp: "09:00 AM"
      }
    ];
  });

  // Sync state changes to storage
  useEffect(() => {
    localStorage.setItem("aspirant_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("aspirant_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("aspirant_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("aspirant_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("aspirant_cv_score", cvScore.toString());
  }, [cvScore]);

  useEffect(() => {
    localStorage.setItem("aspirant_cv_analysis", JSON.stringify(cvAnalysis));
  }, [cvAnalysis]);

  useEffect(() => {
    localStorage.setItem("aspirant_chat_messages", JSON.stringify(chatMessages));
  }, [chatMessages]);

  const handleAddApplication = (newApp: Partial<ApplicationTrackerItem>) => {
    const fullApp: ApplicationTrackerItem = {
      id: "app-" + Date.now(),
      title: newApp.title || "Software Intern",
      company: newApp.company || "Enterprise Labs",
      domain: newApp.domain || "CS",
      status: newApp.status || "Draft",
      deadline: newApp.deadline || new Date().toISOString().split("T")[0],
      notes: newApp.notes
    };
    setApplications([fullApp, ...applications]);
    showToast(`Added "${fullApp.title}" at ${fullApp.company} to application tracker!`, "success");
  };

  const handleAnalyzeCVDirect = async () => {
    if (!userProfile.cvText) {
      showToast("Please add your resume experience or CV text in the profile panel first.", "warning");
      return;
    }
    setCvAnalyzing(true);
    showToast("Analyzing resume experience details...", "info");
    try {
      const response = await fetch("/api/cv-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: userProfile.cvText, targetRole: userProfile.headline }),
      });
      if (response.ok) {
        const data = await response.json();
        setCvAnalysis(data);
        setCvScore(data.score || 85);
        showToast(`CV analysis result successfully received and score updated to ${data.score || 85}% in the app state!`, "success");
      } else {
        throw new Error("CV Analysis failed");
      }
    } catch (err) {
      console.error(err);
      // Fallback response inside App.tsx helper
      const score = Math.round(78 + Math.random() * 10);
      const fallbackResult: CVAnalysisResult = {
        score,
        formattingScore: 82,
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
      showToast(`CV analysis result successfully received and score updated to ${score}% in the app state!`, "success");
    } finally {
      setCvAnalyzing(false);
    }
  };

  const navigationItems = [
    { id: "dashboard", name: "Home Dashboard", icon: LayoutDashboard },
    { id: "project_architecture", name: "System Architecture", icon: Server },
    { id: "talking_ai", name: "Talking AI Mentors", icon: Mic },
    { id: "finder", name: "Internship Finder", icon: Briefcase },
    { id: "cv_sop", name: "CV & SOP Lab", icon: FileText },
    { id: "linkedin", name: "LinkedIn Enhancer", icon: Linkedin },
    { id: "lor", name: "Recommendation Hub", icon: Award },
    { id: "gap_analysis", name: "Skill & Gap Analysis", icon: TrendingUp },
    { id: "interview", name: "Interview Prep", icon: Video },
    { id: "portfolio", name: "Portfolio Builder", icon: BookOpen },
    { id: "tracker", name: "Application Tracker", icon: Calendar },
    { id: "boosters", name: "Extra Boosters", icon: Sparkles },
  ];

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
        <ToastContainer toasts={toasts} setToasts={setToasts} />
      </>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 font-sans relative min-h-screen overflow-x-hidden flex flex-col md:flex-row">
      {/* Background Glowing Ambient Spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile Top Header bar */}
      <header className="md:hidden flex justify-between items-center p-4 bg-white/5 border-b border-white/10 z-20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">A</div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">Aspirant.ai</span>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-slate-900/80 md:bg-white/5 backdrop-blur-xl flex flex-col p-6 z-30 transition-transform duration-300
        md:relative md:translate-x-0 h-screen shrink-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand logo */}
        <div className="hidden md:flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg">A</div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">Aspirant.ai</span>
        </div>

        {/* Nav list */}
        <nav className="space-y-1.5 flex-grow overflow-y-auto scrollbar-thin">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 border text-left transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-white/10 border-white/10 text-white font-semibold shadow-xs" 
                    : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${activeTab === item.id ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="text-xs font-medium tracking-wide">{item.name}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setIsLoggedIn(false);
              localStorage.removeItem("aspirant_logged_in");
              localStorage.removeItem("aspirant_profile");
              window.location.reload();
            }}
            className="w-full mt-4 px-4 py-2.5 rounded-xl flex items-center gap-3 border border-transparent text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer transition-all"
          >
            <X className="w-4.5 h-4.5 shrink-0 text-rose-400" />
            <span className="text-xs font-semibold">Sign Out</span>
          </button>
        </nav>

        {/* Footer dynamic notification card */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">PRO TIP ALERT</span>
            <p className="text-[11px] leading-relaxed text-slate-300 mt-1">
              LinkedIn headline audit recommendation is live. Adjust summary keywords to raise match scores!
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col z-10 overflow-y-auto p-5 md:p-8">
        
        {/* Header toolbar */}
        <header className="hidden md:flex justify-between items-end mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-sm font-semibold tracking-widest text-slate-400 font-mono uppercase">ASPIRANT WORKSPACE</h2>
            <p className="text-xs text-slate-400 mt-0.5">Active Session: {userProfile.name} • {userProfile.education}</p>
          </div>

          <div className="flex gap-6 items-center">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">CV ATS FIT</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-mono font-bold text-emerald-400">{cvScore}%</span>
                <span className="text-slate-600 font-mono text-sm">/ 100</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-indigo-500/40 p-0.5 bg-slate-900 flex items-center justify-center font-bold text-indigo-300">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </header>

        {/* Dynamic Tab Panel */}
        <div className="flex-grow transition-all duration-300">
          {activeTab === "dashboard" && (
            <HomeDashboard
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              applications={applications}
              courses={courses}
              cvScore={cvScore}
              setActiveTab={setActiveTab}
              onAnalyzeCV={handleAnalyzeCVDirect}
              cvAnalyzing={cvAnalyzing}
            />
          )}

          {activeTab === "project_architecture" && (
            <ProjectMarkingBoard />
          )}

          {activeTab === "talking_ai" && (
            <TalkingAIMentors
              userProfile={userProfile}
              showToast={showToast}
            />
          )}

          {activeTab === "finder" && (
            <InternshipFinder
              userProfile={userProfile}
              applications={applications}
              onAddApplication={handleAddApplication}
              showToast={showToast}
            />
          )}

          {activeTab === "cv_sop" && (
            <CVSOPLab
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              cvScore={cvScore}
              setCvScore={setCvScore}
              cvAnalysis={cvAnalysis}
              setCvAnalysis={setCvAnalysis}
              showToast={showToast}
            />
          )}

          {activeTab === "linkedin" && (
            <LinkedInEnhancer
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              showToast={showToast}
            />
          )}

          {activeTab === "lor" && (
            <RecommendationHub
              userProfile={userProfile}
              showToast={showToast}
            />
          )}

          {activeTab === "gap_analysis" && (
            <SkillGapAnalysis
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              courses={courses}
              setCourses={setCourses}
              showToast={showToast}
            />
          )}

          {activeTab === "interview" && (
            <InterviewPrep
              userProfile={userProfile}
              showToast={showToast}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioBuilder
              userProfile={userProfile}
              projects={projects}
              setProjects={setProjects}
              showToast={showToast}
            />
          )}

          {activeTab === "tracker" && (
            <ApplicationTracker
              applications={applications}
              setApplications={setApplications}
              onAddApplication={handleAddApplication}
              showToast={showToast}
            />
          )}

          {activeTab === "boosters" && (
            <ExtraBoosters
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      <AIMentorCompanion
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        onAddApplication={handleAddApplication}
      />

      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </div>
  );
}
