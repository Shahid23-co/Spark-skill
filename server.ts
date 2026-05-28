import express from "express";
import path from "path";
import dns from "dns";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Ensure support for local environment variables
dotenv.config();

// Standard initialization of Gemini AI if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. AI components will respond with descriptive simulated insights.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API router
  const apiRouter = express.Router();

  // Simple Health Route
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Career Guide Suggestion Endpoint
  apiRouter.post("/ai/career-guide", async (req, res) => {
    const { interests, currentSkills } = req.body;

    if (!interests) {
      return res.status(400).json({ error: "Interests and goals are required." });
    }

    if (!ai) {
      // Return high-quality, friendly mock roadmap if GEMINI_API_KEY is not configured yet
      return res.json({
        careerPath: "Creative Technical Content Producer",
        description: "An exciting blend of visual design, video creation, and technical automation. Perfect for teenagers looking to learn quickly, build an active portfolio, and contract for startups.",
        estimatedSalary: "$45,000 - $75,000/year (Part-time / Freelance entry)",
        difficulty: "Medium",
        timelineWeeks: 12,
        roadmapSteps: [
          {
            title: "Master Visual Storytelling & Editing Primitives",
            description: "Learn timeline management, cuts, sound nesting, and aspect ratio standards using CapCut or DaVinci Resolve.",
            estimatedDays: 14,
            xpValue: 450
          },
          {
            title: "Develop Thumbnail & Eye-catching Graphics Templates",
            description: "Study micro-visual typography, high-contrast layouts, and mobile-friendly compositions using Figma/Photoshop.",
            estimatedDays: 14,
            xpValue: 500
          },
          {
            title: "Promote Growth on YouTube & Social Pipelines",
            description: "Understand CTR, hooks, community engagement algorithms, and indexing search metrics.",
            estimatedDays: 21,
            xpValue: 600
          },
          {
            title: "Automate Creation with AI Visual & Copywriting Tools",
            description: "Use Gemini and mid-journey agents for fast concept generation, script outline scripting, and asset mockups.",
            estimatedDays: 14,
            xpValue: 400
          },
          {
            title: "Publish Portfolio and Land Initial Gig Work",
            description: "Curate your best 3 creative pieces, join the SkillSpark Earn Zone, and deliver to premium simulated clients.",
            estimatedDays: 21,
            xpValue: 800
          }
        ]
      });
    }

    try {
      const prompt = `Formulate a complete teenagers-and-beginners skilled learning roadmap based on:
Interests: "${interests}"
Current Skills: "${currentSkills || 'None / complete beginner'}"

Create a highly modern, exciting, and accessible freelance or career path. Your guidelines are to define a title, a short energetic summary, realistic starting salary ranges (freelance entry-level), difficulty rating, timeline in weeks, and 4 to 5 core roadmap milestones. Ensure the milestones progress from zero-experience to a final project or freelance gig landing milestone. Maintain an encouraging and friendly tone. Output strictly in JSON format matching the schema provided.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the head Career Mentor at SkillSpark, an energetic AI advisor helping teenagers transform their interests into actual design, video editing, coding, and creator freelance skills.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              careerPath: { type: Type.STRING, description: "Title of the suggested career path or specialty" },
              description: { type: Type.STRING, description: "Exciting, inspiring summary explaining why this path matches their interests" },
              estimatedSalary: { type: Type.STRING, description: "Estimated starter yearly salary range or micro-gig hourly rate" },
              difficulty: { type: Type.STRING, description: "Difficulty level (e.g., Easy, Medium, Hard)" },
              timelineWeeks: { type: Type.INTEGER, description: "Recommended learning timeline in weeks" },
              roadmapSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Milestone/step title" },
                    description: { type: Type.STRING, description: "Clear action steps and tools to use" },
                    estimatedDays: { type: Type.INTEGER, description: "How many days of learning/practice this step takes" },
                    xpValue: { type: Type.INTEGER, description: "XP reward for completing this milestone (e.g. 100 to 500)" }
                  },
                  required: ["title", "description", "estimatedDays", "xpValue"]
                }
              }
            },
            required: ["careerPath", "description", "estimatedSalary", "difficulty", "timelineWeeks", "roadmapSteps"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response content from Gemini.");
      }

      const parsedRoadmap = JSON.parse(responseText.trim());
      res.json(parsedRoadmap);
    } catch (err: any) {
      console.error("Gemini Career Guide error:", err);
      res.status(500).json({ error: "Failed to generate your personalized career plan. Please try again." });
    }
  });

  // AI Chatbot Mentor Endpoint
  apiRouter.post("/ai/mentor", async (req, res) => {
    const { message, chatHistory, currentPath } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      // Mock chat mentor response when API key is not active
      return res.json({
        reply: "Hey! Outstanding to meet you here in SkillSpark! 🌟 I'm your AI Mentor, ready to guide you in visual design, content creation, coding, or video editing. Since we're in offline preview mode, I can tell you that the best way to start is to check the Core Courses section in your mobile dashboard! Is there a particular tool (like CapCut, Figma, or VS Code) you'd like to crush first?"
      });
    }

    try {
      const historyParts = (chatHistory || []).map((msg: { sender: string; text: string }) => {
        return {
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        };
      });

      // Append active context
      const chatContext = currentPath
        ? `[Context: Student is currently exploring details about the career path: "${currentPath}"]`
        : "";

      const completeHistory = [
        ...historyParts,
        { role: "user", parts: [{ text: `${chatContext} Query: ${message}` }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: completeHistory,
        config: {
          systemInstruction: "You are the SkillSpark AI Chatbot Mentor, a brilliant, super supportive, and energetic tech advisor for teenagers and young beginners (ages 13-20). You guide them on how to learn digital skills (like Figma design, video editing, coding with Python/Vite, building YouTube channels, creating thumbnail formulas, and freelancing). Keep your responses concise (under 4 conversational bullet points or 150 words), encouraging, filled with helpful tips, and styled with high-vibe teen-friendly emojis. Highlight high-value skills and remind them that mistakes are part of printing money with skills!"
        }
      });

      res.json({ reply: response.text || "I'm deep in thought! Double check my prompts or spark me again." });
    } catch (err: any) {
      console.error("Gemini Mentor error:", err);
      res.status(500).json({ error: "Failed to contact your AI mentor. Please try again." });
    }
  });

  app.use("/api", apiRouter);

  // Serve Vite in development, serve static in production
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Starting Vite development server middleware on port 3000...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Running in PRODUCTION mode... serving built client assets.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ SkillSpark Server is shining bright at http://localhost:${PORT}`);
  });
}

startServer();
