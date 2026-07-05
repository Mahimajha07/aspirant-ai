import { 
  InternshipOpportunity, 
  CertificationCourse, 
  ScholarshipOpportunity, 
  PortfolioProject, 
  MockInterviewQuestion 
} from "./types";

export const INITIAL_INTERNSHIPS: InternshipOpportunity[] = [
  {
    id: "int-1",
    title: "AI Research & Development Intern",
    company: "Google DeepMind",
    domain: "AI",
    location: "London, UK (Remote Eligible)",
    stipend: "$45/hour",
    duration: "12 Weeks",
    eligibility: "Pre-final/Final year CS or AI/Math majors",
    requirements: "Strong Python coding, understanding of transformers, PyTorch/TensorFlow, and basic probability.",
    skillsNeeded: ["Python", "PyTorch", "Transformers", "Machine Learning"]
  },
  {
    id: "int-2",
    title: "Software Engineering Intern - Cloud Systems",
    company: "Microsoft Cloud Lab",
    domain: "CS",
    location: "Bangalore, India (Hybrid)",
    stipend: "₹65,000/month",
    duration: "6 Months",
    eligibility: "B.Tech/M.Tech Computer Science students",
    requirements: "Knowledge of distributed systems, C++ or Java, and familiarity with Azure or AWS basics.",
    skillsNeeded: ["Java", "C++", "Cloud Computing", "Distributed Systems"]
  },
  {
    id: "int-3",
    title: "Natural Language Processing Intern",
    company: "OpenAI Research Lab",
    domain: "AI",
    location: "San Francisco, CA",
    stipend: "$50/hour",
    duration: "16 Weeks",
    eligibility: "Graduate students in Computational Linguistics or CS",
    requirements: "Hands-on experience fine-tuning LLMs, prompt engineering paradigms, and dataset preparation.",
    skillsNeeded: ["Python", "Hugging Face", "LLMs", "Fine-Tuning"]
  },
  {
    id: "int-4",
    title: "Academic Research Intern (Data Analytics)",
    company: "Indian Institute of Science (IISc)",
    domain: "Research",
    location: "Bangalore, India",
    stipend: "₹25,000/month",
    duration: "3 Months",
    eligibility: "Undergraduates with academic research orientation",
    requirements: "Excellent statistical analysis skills, experience with R or Pandas, and academic paper drafting skills.",
    skillsNeeded: ["R", "Pandas", "Statistics", "Data Analysis", "Research Methodology"]
  },
  {
    id: "int-5",
    title: "Full Stack Development Intern",
    company: "Vercel Labs",
    domain: "Web Dev",
    location: "Remote (Global)",
    stipend: "$30/hour",
    duration: "12 Weeks",
    eligibility: "Open to students with a strong portfolio of React/Next.js apps",
    requirements: "Expertise in React, Tailwind CSS, TypeScript, Serverless functions, and Git collaboration workflows.",
    skillsNeeded: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"]
  }
];

export const INITIAL_COURSES: CertificationCourse[] = [
  {
    id: "crs-1",
    title: "Deep Learning Specialization",
    provider: "Coursera",
    domain: "AI",
    duration: "2 Months",
    status: "In Progress",
    link: "https://www.coursera.org/specializations/deep-learning"
  },
  {
    id: "crs-2",
    title: "AI Practitioner Certification",
    provider: "IBM SkillsBuild",
    domain: "AI",
    duration: "6 Weeks",
    status: "Not Started",
    link: "https://skillsbuild.org"
  },
  {
    id: "crs-3",
    title: "Database Management Systems",
    provider: "NPTEL",
    domain: "CS",
    duration: "12 Weeks",
    status: "Completed",
    link: "https://nptel.ac.in"
  },
  {
    id: "crs-4",
    title: "Azure Fundamentals (AZ-900)",
    provider: "Microsoft",
    domain: "Cloud Computing",
    duration: "3 Weeks",
    status: "Completed",
    link: "https://learn.microsoft.com"
  },
  {
    id: "crs-5",
    title: "Introduction to Generative AI",
    provider: "Google",
    domain: "AI",
    duration: "1 Week",
    status: "Not Started",
    link: "https://cloud.google.com/training"
  }
];

export const INITIAL_SCHOLARSHIPS: ScholarshipOpportunity[] = [
  {
    id: "sch-1",
    title: "Google Generation Scholarship (Asia Pacific)",
    provider: "Google",
    fundingAmount: "$2,500 USD",
    deadline: "2026-09-15",
    eligibility: "Women studying computer science or related technical fields.",
    benefits: "Funding + invite to specialized career development sessions and Google mentorship channels.",
    link: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac"
  },
  {
    id: "sch-2",
    title: "Reliance Foundation Undergraduate Scholarships",
    provider: "Reliance Foundation",
    fundingAmount: "Up to ₹2,00,000 over degree",
    deadline: "2026-10-31",
    eligibility: "First-year undergraduate students in any stream with household income constraints.",
    benefits: "Direct financial support and entrance into an active alumni/networking system with internship support.",
    link: "https://www.reliancefoundation.org"
  },
  {
    id: "sch-3",
    title: "Adobe Research Women-in-Technology Scholarship",
    provider: "Adobe Research",
    fundingAmount: "$10,000 USD",
    deadline: "2026-11-15",
    eligibility: "Female students majoring in computer science or engineering globally.",
    benefits: "Direct stipend, access to Adobe mentors, and an interview for a Summer Internship at Adobe.",
    link: "https://research.adobe.com/scholarships/"
  }
];

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "ATS-Resume-Analyzer-AI",
    description: "An AI-powered web service that parses PDF resumes and rates ATS compatibility utilizing deep learning.",
    githubLink: "https://github.com/example/ats-analyzer",
    liveLink: "https://ats-analyzer-demo.example.com",
    starImpact: {
      situation: "Students often faced ATS rejections due to bad formatting and missing industry keywords on CVs.",
      task: "Develop an automated rating system that parses resumes, analyzes keyword density, and provides constructive optimization rules.",
      action: "Built a full-stack dashboard using React and Express, integrated a multi-stage parser and used the Gemini API to grade resumes against custom criteria.",
      result: "Helped 200+ students optimize their profiles, raising their test scores by an average of 35% and landing 15+ interviews."
    },
    skills: ["React", "Express", "Vite", "Tailwind CSS", "Gemini API"]
  },
  {
    id: "proj-2",
    title: "Decentralized File Sync System",
    description: "A fast, concurrent distributed server designed to sync system files with conflict-free replicated data types.",
    githubLink: "https://github.com/example/dfs-sync",
    starImpact: {
      situation: "Local file editors had severe synchronization lag and file override conflicts when multiple devs were working concurrently.",
      task: "Create a highly concurrent, zero-lag local daemon that syncs files and auto-resolves overrides.",
      action: "Programmed a server-side client using Go and WebSockets, utilizing lamport timestamps to structure merge order.",
      result: "Achieved sync completion speeds of under 40ms and safely prevented 99% of merge overrides."
    },
    skills: ["Go", "WebSockets", "Distributed Systems", "CRDTs"]
  }
];

export const COMMON_INTERVIEW_QUESTIONS: MockInterviewQuestion[] = [
  {
    id: "q-1",
    question: "Tell me about a time you faced a technical roadblock in a project and how you solved it.",
    type: "hr",
    expectedFocus: "Evaluates resourcefulness, problem-solving, debugging skills, and communication of technical constraints."
  },
  {
    id: "q-2",
    question: "What is the difference between deep learning and classical machine learning? When would you prefer one over the other?",
    type: "technical",
    expectedFocus: "Evaluates core understanding of algorithm scaling, data size tradeoffs, feature engineering, and computing overhead."
  },
  {
    id: "q-3",
    question: "How do you explain a complex technical concept (like recursion or transformers) to a completely non-technical stakeholder?",
    type: "hr",
    expectedFocus: "Evaluates empathy, clarity of communication, and the ability to abstract details to core mental models."
  },
  {
    id: "q-4",
    question: "Explain what a Conflict-Free Replicated Data Type (CRDT) is and how it solves distributed state synchronization issues.",
    type: "technical",
    expectedFocus: "Evaluates system architecture skills, state awareness, distributed replication theory, and precision of design."
  },
  {
    id: "q-5",
    question: "Why do you want to intern at our company, and what specific value do you expect to add during your time here?",
    type: "hr",
    expectedFocus: "Evaluates alignment, cultural fit, self-initiative, research on company values, and professional enthusiasm."
  }
];
