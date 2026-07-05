import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in Settings > Secrets.");
  }
  aiClient = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return aiClient;
}

// 1. CV CHECKER API
app.post("/api/cv-check", async (req, res) => {
  try {
    const { cvText, targetRole } = req.body;
    if (!cvText) {
      return res.status(400).json({ error: "CV text is required" });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze the following student CV or resume${targetRole ? ` for the targeted role of "${targetRole}"` : ""}. 
Evaluate ATS compatibility, formatting style, clarity, detected skills, keyword density, and overall impact.
Provide a detailed structured analysis back.

CV Text:
"""
${cvText}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Overall ATS compatibility score from 0 to 100" },
            formattingScore: { type: Type.INTEGER, description: "Formatting and readability rating from 0 to 100" },
            detectedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of technical and soft skills identified in the resume"
            },
            keywordDensity: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  count: { type: Type.INTEGER },
                  status: { type: Type.STRING, description: "Must be 'good', 'missing', or 'overused'" }
                },
                required: ["keyword", "count", "status"]
              },
              description: "Evaluation of key industry terms detected and their usage density"
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable ATS-focused improvement bullets"
            },
            impactSectors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING, description: "e.g., Work Experience, Education, Projects" },
                  review: { type: Type.STRING, description: "Specific critique of the section contents" },
                  rating: { type: Type.INTEGER, description: "Rating score from 0 to 100" }
                },
                required: ["section", "review", "rating"]
              },
              description: "Section-by-section breakdown analysis"
            }
          },
          required: ["score", "formattingScore", "detectedSkills", "keywordDensity", "suggestions", "impactSectors"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("CV Check Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze CV" });
  }
});

// 2. SOP BUILDER API
app.post("/api/sop-builder", async (req, res) => {
  try {
    const { studentDetails, targetRole, templateType } = req.body;
    if (!studentDetails) {
      return res.status(400).json({ error: "Student details are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Build a professional, tailored Statement of Purpose (SOP) for a student applying to an internship.
Details about the student: ${studentDetails}
Target Role/Domain: ${targetRole || "Software Engineering/AI Internship"}
Style Template Type: ${templateType || "corporate"} (academic, corporate, or research)

Draft the complete, inspiring SOP text (around 500-700 words), structured with paragraphs, and provide qualitative impact feedback scoring clarity, goal alignment, and originality.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sopText: { type: Type.STRING, description: "The full Statement of Purpose formatted nicely with line breaks" },
            feedback: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.INTEGER, description: "Score from 0 to 100" },
                alignment: { type: Type.INTEGER, description: "Alignment with internship goals from 0 to 100" },
                originality: { type: Type.INTEGER, description: "Originality/voice score from 0 to 100" },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of 3 specific ways to further customize or perfect this draft"
                }
              },
              required: ["clarity", "alignment", "originality", "suggestions"]
            }
          },
          required: ["sopText", "feedback"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("SOP Builder Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate SOP" });
  }
});

// 3. LINKEDIN AUDIT API
app.post("/api/linkedin-audit", async (req, res) => {
  try {
    const { headline, summary, skills } = req.body;

    const ai = getGeminiClient();
    const prompt = `Perform a rigorous audit on the following LinkedIn Profile elements:
Headline: ${headline || "Student looking for internships"}
Current Summary: ${summary || "None provided"}
Skills listed: ${skills || "None provided"}

Generate an optimized headline suggestion, an engaging and highly narrative LinkedIn summary draft, targeted keyword additions to rank higher, and strategic engagement coach suggestions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlineSuggestion: { type: Type.STRING, description: "A catchy, keyword-rich headline tailored to get recruiter views" },
            optimizedSummary: { type: Type.STRING, description: "An engaging, professional summary draft in first person" },
            keywordSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Trending industry keywords/skills to append to the profile"
            },
            engagementCoach: {
              type: Type.OBJECT,
              properties: {
                postIdeas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 content ideas they can post about right now"
                },
                groupsToJoin: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Relevant group themes or professional organizations"
                },
                alumniStrategy: { type: Type.STRING, description: "Advice on how to approach and message alumni of target companies" }
              },
              required: ["postIdeas", "groupsToJoin", "alumniStrategy"]
            }
          },
          required: ["headlineSuggestion", "optimizedSummary", "keywordSuggestions", "engagementCoach"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("LinkedIn Audit Error:", error);
    res.status(500).json({ error: error.message || "Failed to audit profile" });
  }
});

// 4. RECOMMENDATION HUB API
app.post("/api/recommendation-generator", async (req, res) => {
  try {
    const { studentInfo, mentorRelationship, keyAchievements, tone } = req.body;
    if (!studentInfo) {
      return res.status(400).json({ error: "Student description is required" });
    }

    const ai = getGeminiClient();
    const prompt = `Draft a compelling, highly credible Letter of Recommendation (LOR) that a student can share with a mentor or professor for editing and signing.
Student Name/Details: ${studentInfo}
Mentor/Professor Relationship: ${mentorRelationship || "Academic advisor and course professor"}
Key Achievements to highlight: ${keyAchievements || "High grade in Core course, leadership in lab project"}
Tone: ${tone || "professional"} (e.g. enthusiastic, academic, corporate-oriented)

Return the letter draft and structured networking nudges to follow-up gracefully.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            letterDraft: { type: Type.STRING, description: "The full letter template draft with placeholders for dates/signatures" },
            networkingNudges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable steps on how to pitch this draft to professors/recruiters nicely"
            }
          },
          required: ["letterDraft", "networkingNudges"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Recommendation Generator Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendation" });
  }
});

// 5. INTERVIEW PREP - GENERATE QUESTIONS API
app.post("/api/interview-questions", async (req, res) => {
  try {
    const { targetRole, skills } = req.body;

    const ai = getGeminiClient();
    const prompt = `Generate a set of 5 highly specific internship interview questions for the role: "${targetRole || "Software Intern"}".
Include technical and HR behavioral/situational questions.
Skills background: ${skills || "General CS and Problem Solving"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Simple identifier like q1, q2" },
                  question: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Must be 'technical' or 'hr'" },
                  expectedFocus: { type: Type.STRING, description: "Brief hint about what the interviewer is evaluating" }
                },
                required: ["id", "question", "type", "expectedFocus"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Interview Questions Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate interview questions" });
  }
});

// 6. INTERVIEW FEEDBACK API
app.post("/api/interview-feedback", async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Act as an expert interviewer. Critically review the student's answer to this interview question.
Question: "${question}"
Student's Answer: "${answer}"

Provide an objective review score (0-100), identify specific strengths, highlight missing points or weaknesses, write a highly polished suggested revision of their answer, and provide brief confidence tips.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Quality rating out of 100" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedRevision: { type: Type.STRING, description: "A highly polished, revised response in first person" },
            confidenceTips: { type: Type.STRING, description: "Advice on delivery, pacing, or structure" }
          },
          required: ["score", "strengths", "weaknesses", "suggestedRevision", "confidenceTips"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Interview Feedback Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze answer" });
  }
});

// 7. MENTOR BOT API
app.post("/api/mentor-bot", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGeminiClient();
    // Reconstruct conversation chat history or just form content
    const lastMsg = messages[messages.length - 1]?.text || "";
    const history = messages.slice(0, -1).map((m: any) => `${m.role === "user" ? "Student" : "AI Mentor"}: ${m.text}`).join("\n");

    const prompt = `You are a warm, wise, encouraging AI Internship Mentor. 
You specialize in helping college and university students navigate internships, CV/resume questions, networking, skills building, and academic to professional transitions.
Provide highly practical, motivational, and short responses (under 150 words). Focus on actionable strategies.

Conversation History:
${history}

Latest Student Question:
"${lastMsg}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ reply: response.text || "I am here to guide you. How can I help with your internship journey?" });
  } catch (error: any) {
    console.error("Mentor Bot Error:", error);
    res.status(500).json({ reply: "Sorry, I had an issue connecting. " + (error.message || "") });
  }
});

// 8. INTERNSHIP MATCHER API
app.post("/api/match-internship", async (req, res) => {
  try {
    const { cvText, internshipTitle, requirements } = req.body;
    if (!cvText || !internshipTitle) {
      return res.status(400).json({ error: "CV text and internship title are required" });
    }

    const ai = getGeminiClient();
    const prompt = `Evaluate the fit between a student resume/CV and the following internship opportunity.
Opportunity Title: "${internshipTitle}"
Requirements: "${requirements || "Not specified"}"

Resume:
"""
${cvText}
"""

Calculate a matching score out of 100, identify matched skills, missing skills or critical gaps, and write a custom encouraging comparison paragraph.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER, description: "Compatibility percentage from 0 to 100" },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required skills/keywords not clearly highlighted in their CV" },
            matchingFeedback: { type: Type.STRING, description: "Enlightening comparison summarizing their fit, highlighting gap focus areas" }
          },
          required: ["matchScore", "matchedSkills", "missingSkills", "matchingFeedback"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Match Internship Error:", error);
    res.status(500).json({ error: error.message || "Failed to compare skills" });
  }
});

// 9. TALKING SUGGESTIONS API
app.post("/api/talking-suggestions", async (req, res) => {
  try {
    const { userProfile } = req.body;
    if (!userProfile) {
      return res.status(400).json({ error: "userProfile is required" });
    }

    const ai = getGeminiClient();
    const prompt = `You are Elena Nair, an academic advisor and internship coach.
Critically review this student's profile:
Name: ${userProfile.name}
College: ${userProfile.college || "Unknown"}
CPI / GPA: ${userProfile.cpi || "Not specified"}
Target Domain: ${userProfile.targetDomain || "Software Engineering / Research"}
Skills: ${userProfile.skills ? userProfile.skills.join(", ") : "None specified"}

Generate exactly 3 custom high-impact advice items tailored to this student profile. 
For each item, provide:
1. An engaging Title.
2. A matching Category: Choose from "Fellowship", "Resume ATS", "Skills Bridge", or "Advisory Outreach".
3. A short text description (1-2 sentences) for the student to read.
4. A customized, conversational monologue written in first-person as Elena (starting with an encouraging opening like "Elena here!") for the voice synthesis to read out loud.
5. An impact score or fit rating.
6. A short, action-focused button label.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Must be 'Fellowship', 'Resume ATS', 'Skills Bridge', or 'Advisory Outreach'" },
                  shortAdvice: { type: Type.STRING },
                  speakAdvice: { type: Type.STRING, description: "Engaging verbal spoken advice text starting with Elena's persona" },
                  impactScore: { type: Type.STRING },
                  actionLabel: { type: Type.STRING }
                },
                required: ["title", "category", "shortAdvice", "speakAdvice", "impactScore", "actionLabel"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Talking Suggestions Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate suggestions" });
  }
});

// VITE MIDDLEWARE AND STATIC SERVING
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
