import React, { useState } from "react";
import { Shield, Sparkles, LogIn, Key, UserCheck, AlertCircle } from "lucide-react";
import { UserProfile } from "../types";

interface LoginScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDemoTip, setShowDemoTip] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo.student@iitp.ac.in" && password === "Demo@123") {
      // Setup Mahima Jha's profile as requested
      const demoProfile: UserProfile = {
        name: "Mahima Jha",
        email: "demo.student@iitp.ac.in",
        education: "IIT Patna",
        college: "IIT Patna",
        collegeType: "IIT",
        yearOfStudy: 1,
        cpi: 8.53,
        department: "AI & CS",
        headline: "Aspiring AI Engineer specializing in Natural Language Processing and Deep Learning Models",
        linkedinSummary: "1st Year Artificial Intelligence & Computer Science student at IIT Patna. Passionate about machine learning pipelines, Python development, and high-performance systems.",
        cvText: `MAHIMA JHA
demo.student@iitp.ac.in | IIT Patna

EDUCATION
B.Tech in Artificial Intelligence & Computer Science - Graduating 2029
IIT Patna | CPI: 8.53/10.00

COURSES & CERTIFICATIONS
- IBM SkillsBuild AI Practitioner Certified
- NPTEL Database Management Systems
- Coursera Python for Everybody

TECHNICAL SKILLS
Languages: Python, C++, SQL, HTML/CSS
Frameworks/Libraries: PyTorch, NumPy, Pandas, React
Tools: Git, VS Code, Jupyter Notebooks

PROJECTS
Smart Syllabus AI Classifier
- Built a Python script that parses academic syllabus files and matches topics to verified courses.
- Utilized Pandas and NumPy for semantic alignment.`,
        skills: ["Python", "PyTorch", "C++", "SQL", "React", "Pandas"],
        certifications: ["IBM SkillsBuild Certified", "NPTEL DBMS", "Coursera Python Specialist"]
      };
      
      onLoginSuccess(demoProfile);
    } else {
      setError("Invalid credentials. Try our safe demo credentials below!");
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo.student@iitp.ac.in");
    setPassword("Demo@123");
    setError("");
    
    // Quick login as Mahima Jha
    setTimeout(() => {
      const demoProfile: UserProfile = {
        name: "Mahima Jha",
        email: "demo.student@iitp.ac.in",
        education: "IIT Patna",
        college: "IIT Patna",
        collegeType: "IIT",
        yearOfStudy: 1,
        cpi: 8.53,
        department: "AI & CS",
        headline: "Aspiring AI Engineer specializing in Natural Language Processing and Deep Learning Models",
        linkedinSummary: "1st Year Artificial Intelligence & Computer Science student at IIT Patna. Passionate about machine learning pipelines, Python development, and high-performance systems.",
        cvText: `MAHIMA JHA
demo.student@iitp.ac.in | IIT Patna

EDUCATION
B.Tech in Artificial Intelligence & Computer Science - Graduating 2029
IIT Patna | CPI: 8.53/10.00

COURSES & CERTIFICATIONS
- IBM SkillsBuild AI Practitioner Certified
- NPTEL Database Management Systems
- Coursera Python for Everybody

TECHNICAL SKILLS
Languages: Python, C++, SQL, HTML/CSS
Frameworks/Libraries: PyTorch, NumPy, Pandas, React
Tools: Git, VS Code, Jupyter Notebooks

PROJECTS
Smart Syllabus AI Classifier
- Built a Python script that parses academic syllabus files and matches topics to verified courses.
- Utilized Pandas and NumPy for semantic alignment.`,
        skills: ["Python", "PyTorch", "C++", "SQL", "React", "Pandas"],
        certifications: ["IBM SkillsBuild Certified", "NPTEL DBMS", "Coursera Python Specialist"]
      };
      onLoginSuccess(demoProfile);
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-4 overflow-hidden" id="login-container">
      {/* Background Backlights */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand & Tagline */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-2 border border-indigo-400/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white bg-clip-text">
            Internship Enhancement Hub
          </h1>
          <p className="text-slate-400 text-xs tracking-wider uppercase font-mono">
            Aspirant Career Growth Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
          
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-indigo-400" /> Member Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo.student@iitp.ac.in"
                className="w-full text-xs bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl p-3 focus:outline-none text-slate-100 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Demo Password Hint: Demo@123")}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl p-3 focus:outline-none text-slate-100 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-5 text-center">
            <span className="text-xs text-slate-400">Don't have an account? </span>
            <button
              onClick={() => alert("Sign up is disabled for this prototype. Please use our Showcase Quick Login below!")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Demo Fast Track Badge */}
        {showDemoTip && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-12 h-12 bg-emerald-500/10 rounded-full blur-md" />
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 mt-0.5 shrink-0">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  🔑 Showcase Fast-Track credentials
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Avoid typing the credentials manually! Click the quick-sign-in button below to instantly populate Mahima Jha's profile stats.
                </p>

                <div className="bg-slate-950/50 p-2.5 rounded-lg border border-white/5 font-mono text-[10px] space-y-1 text-slate-300">
                  <div><span className="text-slate-500">Email:</span> demo.student@iitp.ac.in</div>
                  <div><span className="text-slate-500">Pass:</span> Demo@123</div>
                </div>

                <button
                  onClick={handleDemoLogin}
                  className="mt-3 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10.5px] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Quick Login as Mahima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
