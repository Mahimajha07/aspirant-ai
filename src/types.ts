export interface InternshipOpportunity {
  id: string;
  title: string;
  company: string;
  domain: 'AI' | 'CS' | 'Research' | 'Data Science' | 'Web Dev' | 'Other';
  location: string;
  stipend: string;
  duration: string;
  eligibility: string;
  requirements: string;
  matchScore?: number;
  skillsNeeded: string[];
}

export interface ApplicationTrackerItem {
  id: string;
  title: string;
  company: string;
  domain: string;
  status: 'Draft' | 'Applied' | 'Interviewing' | 'Offer Received' | 'Rejected';
  dateApplied?: string;
  deadline: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  education: string;
  cvText: string;
  headline: string;
  linkedinSummary: string;
  skills: string[];
  certifications: string[];
  cpi?: number;
  college?: string;
  collegeType?: 'IIT' | 'NIT' | 'Foreign' | 'Other';
  yearOfStudy?: number;
  department?: string;
}

export interface CVAnalysisResult {
  score: number;
  formattingScore: number;
  detectedSkills: string[];
  keywordDensity: {
    keyword: string;
    count: number;
    status: 'good' | 'missing' | 'overused';
  }[];
  suggestions: string[];
  impactSectors: {
    section: string;
    review: string;
    rating: number;
  }[];
}

export interface SOPDraft {
  id: string;
  title: string;
  targetRole: string;
  templateType: 'academic' | 'corporate' | 'research';
  sopText: string;
  feedback?: {
    clarity: number;
    alignment: number;
    originality: number;
    suggestions: string[];
  };
  lastSaved: string;
}

export interface LinkedInAuditResult {
  headlineSuggestion: string;
  optimizedSummary: string;
  keywordSuggestions: string[];
  engagementCoach: {
    postIdeas: string[];
    groupsToJoin: string[];
    alumniStrategy: string;
  };
}

export interface RecommendationDraft {
  id: string;
  mentorName: string;
  mentorRole: string;
  studentAchievements: string;
  tone: string;
  letterDraft: string;
  networkingNudges: string[];
  lastSaved: string;
}

export interface CertificationCourse {
  id: string;
  title: string;
  provider: 'NPTEL' | 'IBM SkillsBuild' | 'Coursera' | 'Udacity' | 'Google' | 'Microsoft';
  domain: string;
  duration: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  link: string;
}

export interface EarnedBadge {
  id: string;
  title: string;
  provider: string;
  dateEarned: string;
  syncedToLinkedIn: boolean;
}

export interface MockInterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'hr';
  expectedFocus: string;
  userAnswer?: string;
  feedback?: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestedRevision: string;
    confidenceTips: string;
  };
}

export interface MockInterviewSession {
  id: string;
  role: string;
  date: string;
  score: number;
  questions: MockInterviewQuestion[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  githubLink?: string;
  liveLink?: string;
  starImpact: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  skills: string[];
}

export interface ScholarshipOpportunity {
  id: string;
  title: string;
  provider: string;
  fundingAmount: string;
  deadline: string;
  eligibility: string;
  benefits: string;
  link: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
