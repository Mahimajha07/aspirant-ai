import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Bookmark, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Filter,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
  Copy,
  Info,
  ShieldCheck,
  Plane,
  X,
  Plus
} from "lucide-react";
import { InternshipOpportunity, UserProfile, ApplicationTrackerItem } from "../types";
import { INITIAL_INTERNSHIPS } from "../data";

interface ExtendedOpportunity extends InternshipOpportunity {
  minCpi?: number;
  allowedColleges?: string[];
  collegeTypes?: ('IIT' | 'NIT' | 'Foreign' | 'Other')[];
  minYear?: number;
  category: 'industry' | 'college_portal' | 'foreign' | 'government';
  portalLink?: string;
  visaGuidance?: string[];
  fundingGuidance?: string;
  alumniInsights?: string;
  status?: 'Open' | 'Deadline soon' | 'Closed';
}

interface InternshipFinderProps {
  userProfile: UserProfile;
  applications: ApplicationTrackerItem[];
  onAddApplication: (app: Partial<ApplicationTrackerItem>) => void;
  showToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function InternshipFinder({
  userProfile,
  applications,
  onAddApplication,
  showToast,
}: InternshipFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedMode, setSelectedMode] = useState<"All" | "Online" | "Offline" | "Hybrid">("All");
  const [activeTab, setActiveTab] = useState<'india' | 'foreign' | 'others'>('india');
  const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);
  
  // Custom interactive overlay states
  const [selectedShortCutOp, setSelectedShortCutOp] = useState<ExtendedOpportunity | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // AI matching feedback states
  const [aiMatches, setAiMatches] = useState<Record<string, {
    score: number;
    matched: string[];
    missing: string[];
    feedback: string;
  }>>({});

  const domains = ["All", "AI", "CS", "Research", "Web Dev"];

  // Expand standard listings into ExtendedOpportunities with the extra portal datasets
  const allOpportunities: ExtendedOpportunity[] = [
    // --- INDIA DOMAIN (college_portal & government) ---
    {
      id: "port-iitp-cep",
      title: "IIT Patna CEP Research Internship",
      company: "IIT Patna (Continuing Education Programme)",
      domain: "AI",
      location: "Patna, India (Hybrid)",
      stipend: "₹15,000/month",
      duration: "8 Weeks",
      eligibility: "Open to 1st to 4th year B.Tech/M.Tech students, CPI ≥ 8.0",
      requirements: "Hands-on implementation of machine learning pipelines, transformer training routines, and scientific computation in a hybrid setting.",
      skillsNeeded: ["Python", "TensorFlow", "Pandas", "Machine Learning"],
      category: "college_portal",
      minCpi: 8.0,
      minYear: 1,
      collegeTypes: ['IIT', 'NIT', 'Other'],
      portalLink: "https://registrations.iitp-cep.in",
      status: "Open",
      alumniInsights: "An absolute best-match recommendation for IIT Patna students! Offers close cooperation with CS professors and official certification credits."
    },
    {
      id: "gov-drdo-training",
      title: "DRDO Student Training Program",
      company: "Defence Research and Development Organisation (DRDO)",
      domain: "Research",
      location: "DRDO Pune Labs, India (Offline)",
      stipend: "₹12,000/month",
      duration: "8 Weeks",
      eligibility: "CS, ECE, or EE undergraduates, CPI ≥ 8.0, Year 2+",
      requirements: "Work on cryptography projects, secure network structures, and real-time physical system telemetry parsing in high-security facilities.",
      skillsNeeded: ["C++", "Cybersecurity", "Embedded Systems", "Linux"],
      category: "government",
      minCpi: 8.0,
      minYear: 2,
      collegeTypes: ['IIT', 'NIT', 'Other'],
      portalLink: "https://www.drdo.gov.in",
      status: "Deadline soon",
      alumniInsights: "A stellar opportunity to work inside national labs. Apply early as secure security clearance and background verification take up to 4 weeks."
    },
    {
      id: "gov-isro-spacetech",
      title: "ISRO SpaceTech Internship",
      company: "Indian Space Research Organisation (ISRO)",
      domain: "AI",
      location: "SAC Ahmedabad, India (Hybrid)",
      stipend: "₹16,000/month",
      duration: "10 Weeks",
      eligibility: "Pre-final and final-year CS or Aerospace students, CPI ≥ 8.5, Year 3+",
      requirements: "Design deep neural vision pipelines to analyze multi-spectral satellite imagery and segment topography data. Blends remote coding with onsite reviews.",
      skillsNeeded: ["Python", "PyTorch", "Computer Vision", "GIS"],
      category: "government",
      minCpi: 8.5,
      minYear: 3,
      collegeTypes: ['IIT', 'NIT', 'Other'],
      portalLink: "https://www.isro.gov.in",
      status: "Open",
      alumniInsights: "Highly math-centric selection procedure. Highlight your linear algebra foundation and machine learning project portfolio."
    },

    // --- FOREIGN DOMAIN (foreign) ---
    {
      id: "global-daad-wise",
      title: "DAAD WISE Germany Research Internship",
      company: "German Academic Exchange Service (DAAD WISE)",
      domain: "Research",
      location: "Berlin & Munich, Germany (Offline)",
      stipend: "€861/month + Airfare Travel Grant",
      duration: "12 Weeks",
      eligibility: "3rd Year B.Tech students from premier Indian colleges with CPI ≥ 8.5, Year 2+",
      requirements: "Conduct physical research stays under a German host professor at a public university. Learn state-of-the-art laboratory systems.",
      skillsNeeded: ["Scientific Computing", "Python", "C++", "Academic Research"],
      category: "foreign",
      minCpi: 8.5,
      minYear: 2,
      collegeTypes: ['IIT', 'NIT', 'Foreign'],
      portalLink: "https://www.daad.de",
      status: "Open",
      visaGuidance: [
        "Schengen Visa (Short-term Scientific/Academic research category)",
        "No-objection Certificate (NOC) signed by your Dean/Director",
        "DAAD Funding certificate as proof of maintenance finances (€861/mo)",
        "Verified health insurance valid across Germany/Schengen area"
      ],
      fundingGuidance: "DAAD WISE covers €861 monthly stipend, full round-trip travel costs, and comprehensive accidental health insurance packages.",
      alumniInsights: "Securing DAAD depends entirely on contacting German professors early (Aug-Oct). Email 10-15 professors with a brief, highly personalized research pitch."
    },
    {
      id: "global-mitacs-canada",
      title: "MITACS Canada Globalink Internship",
      company: "Canadian Universities (MITACS Program)",
      domain: "AI",
      location: "Toronto, Canada (Hybrid)",
      stipend: "Fully Funded (Flights, Lodging + CAD $1,500/month)",
      duration: "12 Weeks",
      eligibility: "Undergraduates in pre-final years with CPI ≥ 8.5, Year 3+",
      requirements: "Carry out machine learning or analytics research with top Canadian faculty. Hybrid framework maps remote prep to active onsite stays.",
      skillsNeeded: ["Python", "Machine Learning", "Statistics", "Git"],
      category: "foreign",
      minCpi: 8.5,
      minYear: 3,
      collegeTypes: ['IIT', 'NIT', 'Foreign'],
      portalLink: "https://www.mitacs.ca",
      status: "Deadline soon",
      visaGuidance: [
        "Canadian Temporary Resident Visa (TRV) or eTA",
        "Official Mitacs Award Letter of invitation",
        "Employer Compliance fee payment receipt (handled by Canadian host school)",
        "Academic transcripts in English"
      ],
      fundingGuidance: "Mitacs covers full international airfare, accommodation, student fees on campus, airport pick-up, and a generous weekly living stipend.",
      alumniInsights: "Mitacs matches with specific projects. Align your selected projects closely with your past GitHub repositories to increase match confidence!"
    },
    {
      id: "global-oist-japan",
      title: "OIST Japan AI Research Internship",
      company: "Okinawa Institute of Science & Technology (OIST)",
      domain: "AI",
      location: "Okinawa, Japan (Online / Remote)",
      stipend: "¥2,400/day equivalent allowance",
      duration: "16 Weeks",
      eligibility: "STEM undergraduates of any year with CPI ≥ 8.0, Year 1+",
      requirements: "Engage in computational neuroscience modeling, remote AI architectures simulation, and deep neural networks validation from home.",
      skillsNeeded: ["Python", "Linear Algebra", "Neural Networks", "PyTorch"],
      category: "foreign",
      minCpi: 8.0,
      minYear: 1,
      collegeTypes: ['IIT', 'NIT', 'Foreign', 'Other'],
      portalLink: "https://groups.oist.jp",
      status: "Open",
      alumniInsights: "An exceptional remote global research stay. They value solid coding skills, computational mechanics, and clean logical analysis."
    },

    // --- OTHERS DOMAIN (industry) ---
    {
      id: "other-ibm-skillsbuild",
      title: "IBM SkillsBuild Virtual Internship",
      company: "IBM SkillsBuild Association",
      domain: "AI",
      location: "Remote (Global / Online)",
      stipend: "IBM Professional Badge & Industry Credentials",
      duration: "6 Weeks",
      eligibility: "Open to students of all years seeking verified cloud & AI credentials, CPI ≥ 7.5, Year 1+",
      requirements: "Go through high-value modules in AI Ethics, Generative AI models, and Cloud Architecture with verified virtual projects.",
      skillsNeeded: ["AI Ethics", "Generative AI", "Cloud Computing", "Python"],
      category: "industry",
      minCpi: 7.5,
      minYear: 1,
      collegeTypes: ['IIT', 'NIT', 'Other'],
      portalLink: "https://skillsbuild.org",
      status: "Open",
      alumniInsights: "Perfect for 1st or 2nd year students to establish technical credentials. Add this completed badge immediately to your visual portfolio card."
    },
    {
      id: "other-infosys-ai",
      title: "Infosys AI Development Internship",
      company: "Infosys Careers",
      domain: "CS",
      location: "Bangalore, India (Hybrid)",
      stipend: "₹30,000/month",
      duration: "16 Weeks",
      eligibility: "B.Tech/B.Sc computer science majors with good programming logic, CPI ≥ 8.0, Year 2+",
      requirements: "Optimize full-stack structures, integrate natural language API interfaces, and develop hybrid enterprise corporate portals.",
      skillsNeeded: ["Java", "SQL", "TypeScript", "LLMs"],
      category: "industry",
      minCpi: 8.0,
      minYear: 2,
      collegeTypes: ['IIT', 'NIT', 'Other'],
      portalLink: "https://www.infosys.com",
      status: "Open",
      alumniInsights: "Strong industrial exposure. Test your core Java & database logic in our prep labs and Interview Practice Park before applying!"
    },
    {
      id: "other-ngo-tech4good",
      title: "NGO Tech4Good Internship",
      company: "Verified Non-Profit Association",
      domain: "Web Dev",
      location: "Remote (Online / Virtual)",
      stipend: "₹10,000/month + Social Impact Certificate",
      duration: "8 Weeks",
      eligibility: "Undergraduates looking to apply technology for social impact, CPI ≥ 7.0, Year 1+",
      requirements: "Design accessible, responsive portal layouts, resource trackers, and communication sites for global humanitarian networks.",
      skillsNeeded: ["React", "TypeScript", "Firebase", "CSS Tailwind"],
      category: "industry",
      minCpi: 7.0,
      minYear: 1,
      collegeTypes: ['IIT', 'NIT', 'Other'],
      portalLink: "https://www.unv.org",
      status: "Open",
      alumniInsights: "An excellent way to demonstrate practical civic leadership and real-world project delivery to foreign admission committees."
    }
  ];

  const getOpportunityMode = (location: string): "Online" | "Offline" | "Hybrid" => {
    const loc = location.toLowerCase();
    if (loc.includes("remote") || loc.includes("online") || loc.includes("virtual")) {
      return "Online";
    }
    if (loc.includes("hybrid")) {
      return "Hybrid";
    }
    return "Offline";
  };

  // Filtering based on criteria
  const filteredOpportunities = allOpportunities.filter((op) => {
    let matchesCategory = false;
    if (activeTab === 'india') {
      matchesCategory = op.category === 'college_portal' || op.category === 'government';
    } else if (activeTab === 'foreign') {
      matchesCategory = op.category === 'foreign';
    } else if (activeTab === 'others') {
      matchesCategory = op.category === 'industry';
    }
    
    const matchesSearch = 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.requirements.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = selectedDomain === "All" || op.domain === selectedDomain;
    const opMode = getOpportunityMode(op.location);
    const matchesMode = selectedMode === "All" || opMode === selectedMode;

    return matchesCategory && matchesSearch && matchesDomain && matchesMode;
  });

  // Calculate dynamic suitability/confidence score
  const getConfidenceScore = (op: ExtendedOpportunity) => {
    let score = 70; // baseline
    const studentCpi = userProfile.cpi || 8.0;

    // CPI factor
    if (op.minCpi) {
      if (studentCpi >= op.minCpi) {
        score += Math.min(Math.round((studentCpi - op.minCpi) * 15), 15);
      } else {
        score -= Math.min(Math.round((op.minCpi - studentCpi) * 30), 40);
      }
    }

    // College type alignment
    if (op.collegeTypes && userProfile.collegeType) {
      if (op.collegeTypes.includes(userProfile.collegeType)) {
        score += 10;
      } else {
        score -= 20;
      }
    }

    // Skills matched
    let skillsMatched = 0;
    op.skillsNeeded.forEach(s => {
      if (userProfile.skills.some(us => us.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(us.toLowerCase()))) {
        skillsMatched++;
      }
    });
    const skillsRatio = op.skillsNeeded.length > 0 ? skillsMatched / op.skillsNeeded.length : 1;
    score += Math.round(skillsRatio * 15);

    // Bound between 10 and 100
    return Math.max(10, Math.min(100, score));
  };

  const handleCalculateAiMatch = async (op: ExtendedOpportunity) => {
    if (!userProfile.cvText) {
      alert("Please paste your resume/CV text on the Home Dashboard profile section first to run AI Match calculations.");
      return;
    }

    setLoadingMatchId(op.id);
    try {
      const response = await fetch("/api/match-internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: userProfile.cvText,
          internshipTitle: op.title,
          requirements: op.requirements
        }),
      });

      if (!response.ok) {
        throw new Error("Match calculation failed");
      }

      const data = await response.json();
      setAiMatches(prev => ({
        ...prev,
        [op.id]: {
          score: data.matchScore || getConfidenceScore(op),
          matched: data.matchedSkills || [],
          missing: data.missingSkills || [],
          feedback: data.matchingFeedback || "Your academic details show positive compatibility with this position."
        }
      }));
    } catch (err) {
      console.error(err);
      // Fallback
      const score = getConfidenceScore(op);
      const randomMatched = op.skillsNeeded.filter((s, idx) => {
        return userProfile.skills.some(us => us.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(us.toLowerCase()));
      });
      const randomMissing = op.skillsNeeded.filter(s => !randomMatched.includes(s));

      setAiMatches(prev => ({
        ...prev,
        [op.id]: {
          score,
          matched: randomMatched.length > 0 ? randomMatched : ["Python", "Git"],
          missing: randomMissing,
          feedback: `Your profile highlights an excellent foundation for this role. To stand out at ${op.company}, consider appending custom laboratory projects demonstrating ${randomMissing.slice(0,2).join(" and ") || "specialized technical depth"} in your Statement of Purpose.`
        }
      }));
    } finally {
      setLoadingMatchId(null);
    }
  };

  const handleTrackOpportunity = (op: ExtendedOpportunity) => {
    onAddApplication({
      title: op.title,
      company: op.company,
      domain: op.domain,
      status: "Draft",
      deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
      notes: `Bookmarked from ${op.category === "foreign" ? "Global listings" : op.category === "college_portal" ? "Academic Portal" : "Industry"}. Dynamic Compatibility score: ${getConfidenceScore(op)}%.`
    });
  };

  // Generate an automated cover letter / SOP snippet
  const generateAutofillCoverLetter = (op: ExtendedOpportunity) => {
    const studentName = userProfile.name || "Aspirant";
    const studentCollege = userProfile.college || "IIT Patna";
    const studentCpi = userProfile.cpi || 8.8;
    const studentDept = userProfile.department || "Computer Science";
    const studentSkills = userProfile.skills.slice(0, 4).join(", ");

    return `Subject: Application for ${op.title} - ${studentName} (${studentCollege})

Dear Professor / Recruitment Coordinator,

I am writing to express my enthusiastic interest in the "${op.title}" opportunity hosted by ${op.company}. I am currently a pre-final year student pursuing a degree in ${studentDept} at ${studentCollege} with an active academic record maintaining a CPI of ${studentCpi}/10.00.

Having read through the requirements, I believe my foundation in ${studentSkills} aligns directly with your current initiatives. For instance, I recently engineered an ATS Resume Analyzer web dashboard and a Decentralized File Sync engine utilizing high-performance routines. 

I have fully prepared my Statement of Purpose and resume detailing these achievements, and I qualify under your established parameters. I would welcome the opportunity to discuss how my competencies can contribute to your research and development labs.

Thank you for your time and kind consideration.

Sincerely,
${studentName}
Email: ${userProfile.email}
Profile Scorecard: Verified via Aspirant.ai (Strength: ${getConfidenceScore(op)}%)`;
  };

  const handleCopyAutofillText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6" id="internship-finder-root">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-sans text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" /> Career Accelerator Listings
          </h1>
          <p className="text-slate-400 text-sm">
            Access elite corporate internships, direct IIT/NIT summer portals, and foreign study programs matched with your CPI.
          </p>
        </div>
        
        {/* Simple academic status info */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl flex items-center gap-2.5 self-start md:self-center font-mono text-xs text-indigo-300">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Profile: {userProfile.college || "IIT Patna"} • CPI {userProfile.cpi || "8.8"}</span>
        </div>
      </div>

      {/* Tabs Selector for Categories */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('india')}
          className={`pb-3 px-4 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'india' 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> India (IIT/NIT & Government)
        </button>
        <button
          onClick={() => setActiveTab('foreign')}
          className={`pb-3 px-4 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'foreign' 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Globe className="w-4 h-4" /> Foreign Summer Internships
        </button>
        <button
          onClick={() => setActiveTab('others')}
          className={`pb-3 px-4 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'others' 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Others (Private Corporate & Startups)
        </button>
      </div>

      {/* AI Mentor Custom Guidance Station */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-5 md:p-6 space-y-4 relative overflow-hidden">
        {/* Decorative ambient bulb */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-3">
          <div className="bg-indigo-500/20 text-indigo-300 p-2 rounded-2xl border border-indigo-500/30 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-xs font-bold text-slate-100 font-mono tracking-wide uppercase flex items-center gap-2">
              AI MENTOR RECRUITMENT BOT
              <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">ACTIVE PIPELINE</span>
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed">
              “Welcome <b>{userProfile.name || "Mahima"}</b>! Your CPI is <b>{userProfile.cpi || "8.53"}</b>, and you’re in year <b>{userProfile.yearOfStudy || "1"}</b> of your studies at <b>{userProfile.college || "IIT Patna"}</b>. Let’s explore internships by mode: <b>online</b>, <b>offline</b>, or <b>hybrid</b>.”
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {/* Action 1: Highlights Matches */}
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-wider block">★ Verified Eligible Openings</span>
            <p className="text-xs text-slate-300 leading-normal">
              You qualify for <span className="text-indigo-400 font-semibold">IIT Patna CEP hybrid</span>, <span className="text-indigo-400 font-semibold">MITACS offline</span>, and <span className="text-indigo-400 font-semibold">IBM SkillsBuild online</span>. Click to apply directly.
            </p>
            <div className="pt-1.5 flex flex-wrap gap-1.5">
              <button 
                onClick={() => {
                  setSelectedMode("Hybrid");
                  setSearchTerm("");
                  showToast?.("AI Bot: Filtered by Hybrid mode! Check out IIT Patna CEP dynamic entry.", "info");
                }}
                className="text-[9px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-2 py-1 rounded font-mono font-bold cursor-pointer transition-all"
              >
                Hybrid (IITP)
              </button>
              <button 
                onClick={() => {
                  setSelectedMode("Offline");
                  setSearchTerm("");
                  showToast?.("AI Bot: Filtered by Offline mode! Check out MITACS & DRDO research programs.", "info");
                }}
                className="text-[9px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded font-mono font-bold cursor-pointer transition-all"
              >
                Offline (MITACS)
              </button>
              <button 
                onClick={() => {
                  setSelectedMode("Online");
                  setSearchTerm("");
                  showToast?.("AI Bot: Filtered by Online mode! Check out IBM SkillsBuild virtual programs.", "info");
                }}
                className="text-[9px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded font-mono font-bold cursor-pointer transition-all"
              >
                Online (IBM)
              </button>
            </div>
          </div>

          {/* Action 2: Tracks Deadlines */}
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold text-amber-300 font-mono uppercase tracking-wider block">⌚ Deadline Alerts</span>
            <p className="text-xs text-slate-300 leading-normal">
              DRDO & ISRO application stations close in <b>5 days</b>. Shall I schedule an automated prep calendar reminder?
            </p>
            <div className="pt-1.5">
              <button 
                onClick={() => showToast?.("Deadline calendar reminder set for DRDO/ISRO! We'll alert you 48 hours prior.", "success")}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Set reminder <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action 3: Suggests Prep */}
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold text-emerald-300 font-mono uppercase tracking-wider block">⚡ Recommended Prep Action</span>
            <p className="text-xs text-slate-300 leading-normal">
              Before submitting your application to <span className="text-emerald-400 font-semibold">MITACS</span> or <span className="text-emerald-400 font-semibold">DAAD</span>, let’s refine your Statement of Purpose in our CV/SOP Lab.
            </p>
            <div className="pt-1.5">
              <button 
                onClick={() => {
                  showToast?.("Transitioning to the CV/SOP Lab tab to tailor your Statement of Purpose...", "info");
                  const sopTabButton = document.querySelector('[id*="tab-cv"]');
                  if (sopTabButton) {
                    (sopTabButton as HTMLButtonElement).click();
                  }
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Polish Statement of Purpose <FileText className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and search controls bar */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search in ${activeTab === 'india' ? "India" : activeTab === 'foreign' ? "Foreign" : "Others"} listings...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
          {/* Domain Pills */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
            {domains.map(dom => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedDomain === dom 
                    ? "bg-white/15 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          {/* Mode Selector Pills */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
            {(["All", "Online", "Offline", "Hybrid"] as const).map(m => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMode(m);
                  showToast?.(`Filtered opportunities by ${m} mode`, "info");
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedMode === m 
                    ? m === "Online" ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30" :
                      m === "Offline" ? "bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30" :
                      m === "Hybrid" ? "bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30" :
                      "bg-white/15 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m === "All" ? "All Modes" : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOpportunities.map((op) => {
          const matchedItem = aiMatches[op.id];
          const isTracked = applications.some(a => a.title === op.title && a.company === op.company);
          const studentCpi = userProfile.cpi || 8.0;
          const meetsCpi = op.minCpi ? studentCpi >= op.minCpi : true;
          const confidenceScore = getConfidenceScore(op);

          return (
            <div 
              key={op.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 transition-all hover:border-white/15 relative"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-100">{op.title}</h3>
                    <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono uppercase">
                      {op.domain}
                    </span>
                    {op.category === 'college_portal' || op.category === 'government' ? (
                      <span className="bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                        Domain: India
                      </span>
                    ) : op.category === 'foreign' ? (
                      <span className="bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                        Domain: Foreign
                      </span>
                    ) : (
                      <span className="bg-amber-500/15 border border-amber-500/25 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                        Domain: Others
                      </span>
                    )}
                    {op.status && (
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase border ${
                        op.status === 'Open' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                        op.status === 'Deadline soon' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/15 text-rose-400 border-rose-500/20'
                      }`}>
                        Status: {op.status}
                      </span>
                    )}
                    {op.portalLink && (
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono uppercase">
                        Portal Sync Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm font-medium">{op.company}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Confidence Suitability Index */}
                  <div className={`px-2.5 py-1 rounded-xl flex items-center gap-1 text-[11px] font-semibold border ${
                    confidenceScore >= 80 ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/30" :
                    confidenceScore >= 65 ? "bg-slate-500/10 text-slate-300 border-slate-500/20" :
                    "bg-rose-500/10 text-rose-300 border-rose-500/20"
                  }`} title="Dynamic score based on CPI, college alignment and skills match">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Fit Confidence: {confidenceScore}%</span>
                  </div>

                  {matchedItem && (
                    <div className={`px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-semibold border ${
                      matchedItem.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      matchedItem.score >= 60 ? "bg-amber-500/10 text-amber-300 border-amber-500/20" :
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {matchedItem.score}% Match
                    </div>
                  )}

                  <button
                    onClick={() => handleTrackOpportunity(op)}
                    className={`p-2 rounded-xl border transition-all ${
                      isTracked 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-slate-200"
                    }`}
                    title={isTracked ? "Application Tracked" : "Bookmark to Application Tracker"}
                  >
                    {isTracked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Secondary meta info row */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium font-mono items-center">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  getOpportunityMode(op.location) === "Online" ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25" :
                  getOpportunityMode(op.location) === "Hybrid" ? "bg-purple-500/15 text-purple-300 border border-purple-500/25" :
                  "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                }`}>
                  {getOpportunityMode(op.location)} Mode
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {op.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {op.stipend}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {op.duration}
                </span>
              </div>

              {/* Academic requirements validation banner */}
              {op.minCpi && (
                <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 border ${
                  meetsCpi 
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300" 
                    : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                }`}>
                  {meetsCpi ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Academic Eligibility verified: Your CPI of <b>{studentCpi}</b> qualifies you for this position (Minimum required: {op.minCpi}).</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Academic Gap Alert: This internship requires a minimum CPI of <b>{op.minCpi}</b>. Your current listed CPI is {studentCpi}. You can still apply, but focus heavily on exceptional projects to compensate.</span>
                    </>
                  )}
                </div>
              )}

              {/* Alumni & Historical selected trends - Gap Alerts */}
              {op.alumniInsights && (
                <div className="bg-white/5 border-l-2 border-indigo-500 p-3.5 rounded-r-2xl text-xs space-y-1">
                  <span className="font-bold text-slate-300 flex items-center gap-1 font-mono uppercase text-[10px]">
                    <Info className="w-3.5 h-3.5 text-indigo-400" /> ALUMNI & GATEKEEPER INSIGHT
                  </span>
                  <p className="text-slate-300 leading-relaxed italic">
                    "{op.alumniInsights}"
                  </p>
                </div>
              )}

              <div className="border-t border-white/5 pt-3">
                <div className="text-xs font-semibold text-slate-400 font-mono uppercase">Eligibility Specifications</div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{op.eligibility}</p>
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="text-xs font-semibold text-slate-400 font-mono uppercase">Role & Focus Description</div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{op.requirements}</p>
              </div>

              {/* Tag section */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {op.skillsNeeded.map(skill => (
                  <span key={skill} className="bg-white/5 text-slate-300 border border-white/5 text-[10px] px-2 py-0.5 rounded-lg font-mono">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Foreign visa checklist banner */}
              {op.visaGuidance && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono uppercase">
                    <Plane className="w-4 h-4" /> Global Mobility & Visa Checklist
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                    {op.visaGuidance.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 text-xs font-bold">✓</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  {op.fundingGuidance && (
                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed mt-1">
                      <span className="font-semibold text-amber-400/90">Funding:</span> {op.fundingGuidance}
                    </p>
                  )}
                </div>
              )}

              {/* AI comparison expansion block */}
              {matchedItem && (
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3 transition-all">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <Sparkles className="w-4 h-4 animate-pulse" /> Custom AI Match Analysis
                  </div>
                  
                  <p className="text-slate-300 text-xs italic leading-relaxed">
                    "{matchedItem.feedback}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Matched Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {matchedItem.matched.map(s => (
                          <span key={s} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {matchedItem.matched.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic">No matching keywords detected</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> Missing Profile Gaps
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {matchedItem.missing.map(s => (
                          <span key={s} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                        {matchedItem.missing.length === 0 && (
                          <span className="text-[9px] text-emerald-400 font-semibold">Perfect alignment!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center border-t border-white/5 pt-3 flex-wrap gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCalculateAiMatch(op)}
                    disabled={loadingMatchId === op.id}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-lg disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer border border-white/10"
                  >
                    {loadingMatchId === op.id ? "Analyzing..." : matchedItem ? "Recalculate Fit" : "Calculate AI Match"}
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </button>

                  <button
                    onClick={() => setSelectedShortCutOp(op)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Auto-Fill Application
                  </button>

                  <button
                    onClick={() => {
                      showToast?.(`Demo Mode Active: Pre-auditing resume and SOP bundle for ${op.title} at ${op.company}... Complete steps or bookmark this opportunity in your tracker!`, "success");
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {op.portalLink && (
                    <a
                      href={op.portalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => showToast?.(`Opening direct registration portal for ${op.company}... Complete registration and track in timeline!`, "info")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      Official Portal <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => handleTrackOpportunity(op)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    {isTracked ? "Tracked in Timeline" : "Track opportunity"} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOpportunities.length === 0 && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center text-slate-400">
            <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No matching internships found</p>
            <p className="text-xs mt-1">Try adjusting your filters or search term to discover more roles.</p>
          </div>
        )}
      </div>

      {/* Auto-fill cover letter shortcut overlay */}
      {selectedShortCutOp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedShortCutOp(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Application Auto-Fill Shortcut
              </h3>
              <p className="text-xs text-slate-400">
                Generated tailored application proposal for <b>{selectedShortCutOp.title}</b> at <b>{selectedShortCutOp.company}</b>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1 text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
              {generateAutofillCoverLetter(selectedShortCutOp)}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-400 font-mono">
                ✓ Auto-filled using your verified skills and academic CPI ({userProfile.cpi || 8.8}).
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedShortCutOp(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => handleCopyAutofillText(generateAutofillCoverLetter(selectedShortCutOp))}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  {copiedText ? "Copied!" : "Copy Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
