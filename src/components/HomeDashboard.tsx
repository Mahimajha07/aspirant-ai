import React, { useState } from "react";
import { 
  Briefcase, 
  AlertCircle, 
  Award, 
  TrendingUp, 
  User, 
  FileText, 
  ChevronRight, 
  Save, 
  BookOpen, 
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { UserProfile, ApplicationTrackerItem, CertificationCourse } from "../types";

interface HomeDashboardProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  applications: ApplicationTrackerItem[];
  courses: CertificationCourse[];
  cvScore: number;
  setActiveTab: (tab: string) => void;
  onAnalyzeCV: () => void;
  cvAnalyzing: boolean;
}

export default function HomeDashboard({
  userProfile,
  setUserProfile,
  applications,
  courses,
  cvScore,
  setActiveTab,
  onAnalyzeCV,
  cvAnalyzing,
}: HomeDashboardProps) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [education, setEducation] = useState(userProfile.education);
  const [headline, setHeadline] = useState(userProfile.headline);
  const [cpi, setCpi] = useState(userProfile.cpi || 8.0);
  const [college, setCollege] = useState(userProfile.college || "IIT Patna");
  const [collegeType, setCollegeType] = useState(userProfile.collegeType || "IIT");
  const [yearOfStudy, setYearOfStudy] = useState(userProfile.yearOfStudy || 3);
  const [department, setDepartment] = useState(userProfile.department || "Computer Science");
  const [newSkill, setNewSkill] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Preference and connection states
  const [prefIit, setPrefIit] = useState(true);
  const [prefGov, setPrefGov] = useState(true);
  const [prefForeign, setPrefForeign] = useState(true);
  const [connectedLinkedIn, setConnectedLinkedIn] = useState(true);
  const [connectedGitHub, setConnectedGitHub] = useState(true);

  const activeApps = applications.filter(a => a.status !== "Rejected" && a.status !== "Offer Received");
  const upcomingDeadlines = applications.filter(a => a.status === "Draft" || a.status === "Applied");
  const completedCourses = courses.filter(c => c.status === "Completed");

  // Calculate overall profile strength score based on criteria
  const calculateProfileScore = () => {
    if (userProfile.name === "Mahima Jha") return 82; // Force to 82 as requested!
    let score = 0;
    if (userProfile.cvText) score += 20;
    if (userProfile.headline && userProfile.headline !== "Student looking for internships") score += 15;
    score += Math.min(userProfile.skills.length * 3, 15);
    score += Math.min(completedCourses.length * 5, 15);
    score += Math.min(applications.length * 5, 15);
    score += Math.round((cvScore / 100) * 20);
    return Math.min(score, 100);
  };

  const profileScore = calculateProfileScore();

  const handleSaveProfile = () => {
    setUserProfile({
      ...userProfile,
      name,
      email,
      education,
      headline,
      cpi: Number(cpi),
      college,
      collegeType: collegeType as any,
      yearOfStudy: Number(yearOfStudy),
      department,
    });
    setEditMode(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !userProfile.skills.includes(newSkill.trim())) {
      setUserProfile({
        ...userProfile,
        skills: [...userProfile.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserProfile({
      ...userProfile,
      skills: userProfile.skills.filter(s => s !== skillToRemove),
    });
  };

  // Automated smart alerts based on user profile state
  const getSmartAlerts = () => {
    const alerts = [];

    if (userProfile.name === "Mahima Jha") {
      alerts.push({
        id: "alert-drdo-deadline",
        text: "⏳ Urgent Deadline: The submission window for the DRDO Defence Systems & AI Research Internship closes in 5 days!",
        type: "warning",
        action: "Apply Now",
        tab: "finder"
      });
    }

    if (!userProfile.cvText) {
      alerts.push({
        id: "alert-cv",
        text: "Your ATS CV Analysis is pending. Paste your resume in the CV Lab to generate compatibility recommendations.",
        type: "warning",
        action: "Go to CV Lab",
        tab: "cv_sop"
      });
    } else if (cvScore < 75) {
      alerts.push({
        id: "alert-cv-low",
        text: `Your resume ATS match is current at ${cvScore}%. Recruiter databases favor scores above 80%. Consider optimizing keywords.`,
        type: "warning",
        action: "Optimize CV",
        tab: "cv_sop"
      });
    }

    if (userProfile.skills.length < 5) {
      alerts.push({
        id: "alert-skills",
        text: "Add at least 5 key technical skills to increase search matching relevance on the Internship Finder.",
        type: "info",
        action: "Edit Profile",
        tab: "dashboard"
      });
    }

    if (applications.length === 0) {
      alerts.push({
        id: "alert-apps",
        text: "No active tracked applications. 3 newly published internships match your listed skills this week!",
        type: "success",
        action: "Explore Openings",
        tab: "finder"
      });
    } else {
      const interviewApps = applications.filter(a => a.status === "Interviewing");
      if (interviewApps.length > 0) {
        alerts.push({
          id: "alert-interview",
          text: `You have ${interviewApps.length} active interview schedule(s)! Run a tailored mock simulation prep session to secure the role.`,
          type: "success",
          action: "Practice Interviews",
          tab: "interview"
        });
      }
    }

    return alerts;
  };

  const smartAlerts = getSmartAlerts();

  return (
    <div className="space-y-6" id="home-dashboard-root">
      
      {/* Top Banner - Welcome & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">Student Success Command</span>
            <h1 className="text-3xl font-sans font-bold tracking-tight text-white">
              Welcome back, {userProfile.name || "Scholar"}!
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              {userProfile.headline || "Ready to land your dream internship? Manage your resume audits, target list matching, LinkedIn profiles, and preparation loop here."}
            </p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => setActiveTab("finder")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" /> Find Internships
            </button>
            <button 
              onClick={() => setActiveTab("cv_sop")}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> CV ATS Checker
            </button>
          </div>
        </div>

        {/* Profile Strength Score */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="space-y-1 w-full">
            <h3 className="text-xs font-semibold text-slate-400 font-mono">PROFILE STRENGTH</h3>
            <div className="relative flex items-center justify-center py-4">
              {/* Circular progress container */}
              <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center relative">
                {/* Simulated highlight border */}
                <div 
                  className="absolute inset-0 rounded-full border-8 border-indigo-500 transition-all duration-1000" 
                  style={{ clipPath: `polygon(50% 50%, -50% -50%, ${profileScore >= 25 ? "150% -50%" : "50% -50%"}, ${profileScore >= 50 ? "150% 150%" : "50% -50%"}, ${profileScore >= 75 ? "-50% 150%" : "50% -50%"}, ${profileScore === 100 ? "-50% -50%" : "50% -50%"})` }}
                />
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-white font-sans">{profileScore}</span>
                  <span className="text-slate-400 text-xs block">/ 100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            {profileScore < 50 ? "Needs dynamic optimization" : profileScore < 85 ? "Strong! Keep building" : "Excellent professional readiness!"}
          </div>
        </div>
      </div>

      {/* Snapshot Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <div className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Active Applications</div>
          <div className="text-2xl font-bold text-white mt-1">{activeApps.length}</div>
          <div className="text-slate-500 text-xs mt-1">{upcomingDeadlines.length} awaiting response</div>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <div className="text-slate-400 font-mono text-[10px] uppercase font-semibold">CV ATS Match Score</div>
          <div className="text-2xl font-bold text-white mt-1">{cvScore}%</div>
          <div className="text-slate-500 text-xs mt-1">{cvScore === 0 ? "Not analyzed yet" : cvScore < 75 ? "Optimize formatting" : "A+ recruiting readiness"}</div>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <div className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Completed Skills Courses</div>
          <div className="text-2xl font-bold text-white mt-1">{completedCourses.length}</div>
          <div className="text-slate-500 text-xs mt-1">{courses.filter(c => c.status === "In Progress").length} currently in progress</div>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <div className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Earned Sync Badges</div>
          <div className="text-2xl font-bold text-white mt-1">{userProfile.certifications.length}</div>
          <div className="text-slate-500 text-xs mt-1">LinkedIn integrations live</div>
        </div>
      </div>

      {/* Main Grid: Smart Alerts & Profile setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Alerts & Tips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-sans text-slate-100 flex items-center gap-1.5">
              <AlertCircle className="w-5 h-5 text-indigo-400" /> Smart Action Alerts
            </h2>
            <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-xl font-mono font-semibold">
              {smartAlerts.length} items
            </span>
          </div>

          <div className="space-y-3">
            {smartAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-all ${
                  alert.type === "warning" ? "bg-amber-500/10 border-amber-500/20" :
                  alert.type === "success" ? "bg-emerald-500/10 border-emerald-500/20" :
                  "bg-indigo-500/10 border-indigo-500/20"
                }`}
              >
                <div className="space-y-1 max-w-xl">
                  <p className="text-slate-200 text-xs leading-relaxed">{alert.text}</p>
                </div>
                <button
                  onClick={() => setActiveTab(alert.tab)}
                  className={`px-3 py-1.5 font-bold text-xs rounded-lg transition-all flex items-center gap-1 w-fit self-start sm:self-center cursor-pointer ${
                    alert.type === "warning" ? "bg-amber-600 hover:bg-amber-500 text-white" :
                    alert.type === "success" ? "bg-emerald-600 hover:bg-emerald-500 text-white" :
                    "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {alert.action} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {smartAlerts.length === 0 && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 animate-pulse" />
                <p className="font-semibold text-slate-200">Everything is in peak order!</p>
                <p className="text-xs mt-1 leading-relaxed">Your ATS CV score is optimized, and you have highly strategic internship applications active.</p>
              </div>
            )}
          </div>

          {/* Quick Stats - CV Matcher overview */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Quick CV Optimizer</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Paste your resume or list of qualifications into the profile editor on the right or upload your full qualifications string directly. We check ATS compatibility in real-time.
            </p>
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-400">
                <span>ATS READINESS: {cvScore}%</span>
                <span>TARGET GOAL: 85%+</span>
              </div>
              <div className="w-full bg-white/5 border border-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${cvScore}%` }} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 block truncate">
                  {userProfile.cvText ? "Resume detected and ready to analyze." : "No resume text found. Add on the right."}
                </span>
                <button
                  onClick={onAnalyzeCV}
                  disabled={cvAnalyzing || !userProfile.cvText}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {cvAnalyzing ? "Analyzing..." : "Trigger Audit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Side-panel */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" /> Candidate Profile
            </h3>
            <button
              onClick={() => {
                if (editMode) {
                  handleSaveProfile();
                } else {
                  setEditMode(true);
                }
              }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              {editMode ? (
                <>
                  <Save className="w-3.5 h-3.5" /> Save
                </>
              ) : (
                "Edit Info"
              )}
            </button>
          </div>

          <div className="space-y-4">
            {editMode ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">College Name</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">College Type</label>
                    <select
                      value={collegeType}
                      onChange={(e) => setCollegeType(e.target.value as any)}
                      className="w-full text-xs bg-slate-900 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                    >
                      <option value="IIT">IIT</option>
                      <option value="NIT">NIT</option>
                      <option value="Foreign">Foreign Univ</option>
                      <option value="Other">Other college</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">CPI / CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cpi}
                      onChange={(e) => setCpi(Number(e.target.value))}
                      className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full text-xs bg-slate-900 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 font-mono uppercase block">Target Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-2.5 mt-1 focus:outline-none text-slate-100"
                  />
                </div>
                
                {/* Internship Preferences */}
                <div className="border-t border-white/5 pt-3 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Internship Preferences</label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={prefIit}
                        onChange={(e) => setPrefIit(e.target.checked)}
                        className="rounded bg-white/5 border border-white/10 text-indigo-600 focus:ring-indigo-500"
                      />
                      IIT/NIT Research Internships
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={prefGov}
                        onChange={(e) => setPrefGov(e.target.checked)}
                        className="rounded bg-white/5 border border-white/10 text-emerald-600 focus:ring-emerald-500"
                      />
                      Government Internships (DRDO, ISRO, BARC)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={prefForeign}
                        onChange={(e) => setPrefForeign(e.target.checked)}
                        className="rounded bg-white/5 border border-white/10 text-purple-600 focus:ring-purple-500"
                      />
                      Foreign Internships (DAAD, MITACS, OIST)
                    </label>
                  </div>
                </div>

                {/* LinkedIn/GitHub Toggles */}
                <div className="border-t border-white/5 pt-3 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">LinkedIn/GitHub Connections</label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={connectedLinkedIn}
                        onChange={(e) => setConnectedLinkedIn(e.target.checked)}
                        className="rounded bg-white/5 border border-white/10 text-indigo-600 focus:ring-indigo-500"
                      />
                      LinkedIn Connect
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={connectedGitHub}
                        onChange={(e) => setConnectedGitHub(e.target.checked)}
                        className="rounded bg-white/5 border border-white/10 text-indigo-600 focus:ring-indigo-500"
                      />
                      GitHub Connect
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div>
                  <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">Name</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{userProfile.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">College ({userProfile.collegeType || "IIT"})</div>
                    <div className="text-xs font-semibold text-slate-300 mt-0.5">{userProfile.college || userProfile.education}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">CPI / CGPA</div>
                    <div className="text-xs font-mono font-semibold text-emerald-400 mt-0.5">{userProfile.cpi || "8.0"} / 10.00</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">Department</div>
                    <div className="text-xs text-slate-300 mt-0.5">{userProfile.department || "Computer Science"}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">Year of Study</div>
                    <div className="text-xs text-slate-300 mt-0.5">{userProfile.yearOfStudy === 1 ? "1st" : userProfile.yearOfStudy === 2 ? "2nd" : userProfile.yearOfStudy === 3 ? "3rd" : userProfile.yearOfStudy === 4 ? "4th" : "5th"} Year</div>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">Headline / Focus</div>
                  <div className="text-xs text-slate-300 mt-0.5 italic leading-relaxed">"{userProfile.headline}"</div>
                </div>

                {/* Internship Preferences Display */}
                <div className="border-t border-white/5 pt-3.5 space-y-2">
                  <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">Internship Preferences</div>
                  <div className="flex flex-wrap gap-1">
                    {prefIit && (
                      <span className="inline-flex items-center text-[9px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        IIT/NIT Portals
                      </span>
                    )}
                    {prefGov && (
                      <span className="inline-flex items-center text-[9px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        Government (DRDO, ISRO)
                      </span>
                    )}
                    {prefForeign && (
                      <span className="inline-flex items-center text-[9px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/20 px-2 py-0.5 rounded-md">
                        Global (Mitacs, DAAD)
                      </span>
                    )}
                    {!prefIit && !prefGov && !prefForeign && (
                      <span className="text-[10px] text-slate-500 italic">None selected</span>
                    )}
                  </div>
                </div>

                {/* Connected Channels Display */}
                <div className="border-t border-white/5 pt-3.5 space-y-2">
                  <div className="text-slate-400 font-mono text-[9px] uppercase font-semibold">Connected Channels</div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${connectedLinkedIn ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" : "bg-slate-600"}`} />
                      <span className="text-[10px] font-mono text-slate-300">LinkedIn: {connectedLinkedIn ? "Active" : "OFF"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${connectedGitHub ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" : "bg-slate-600"}`} />
                      <span className="text-[10px] font-mono text-slate-300">GitHub: {connectedGitHub ? "Active" : "OFF"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Segment */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Verified Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="inline-flex items-center gap-1 text-[10px] bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 transition-colors border border-white/5 text-slate-300 px-2 py-0.5 rounded-lg font-mono"
                  >
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-400 cursor-pointer ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {userProfile.skills.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No skills listed yet. Add skills below.</span>
                )}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., PyTorch, Go"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-grow text-xs bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none text-slate-100"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Add
                </button>
              </form>
            </div>

            {/* CV Text Field (Quick edit) */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">CV Text Content</h4>
                <span className="text-[9px] text-indigo-400 font-mono">{userProfile.cvText ? `${userProfile.cvText.length} chars` : "empty"}</span>
              </div>
              <textarea
                value={userProfile.cvText}
                onChange={(e) => setUserProfile({ ...userProfile, cvText: e.target.value })}
                placeholder="Paste your raw qualifications, education, and experience text here to empower real-time matching."
                className="w-full h-24 text-xs bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none text-slate-100 font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
