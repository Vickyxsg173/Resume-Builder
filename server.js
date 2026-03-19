import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";

dotenv.config();

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// 🔥 MAIN ROUTE
app.post("/generate-resume", async (req, res) => {
  try {
    const userData = req.body;

    // 🧠 Prompt Engineering
    const prompt = `
You are an expert resume writer and ATS optimization specialist.

Your task is to transform raw, unstructured, or basic user input into a highly professional, ATS-friendly resume that can compete with top-tier candidates.

User Data:
${JSON.stringify(userData, null, 2)}

STRICT INSTRUCTIONS:

1. STRUCTURE:
Create a well-structured resume with the following sections:
- Full Name (as heading)
- Professional Summary (2–4 impactful lines)
- Key Skills (bullet points, grouped if possible)
- Professional Experience (bullet points with achievements)
- Projects (with impact and technologies)
- Education
- (Optional) Certifications / Tools / Achievements if applicable

2. CONTENT ENHANCEMENT:
- Improve weak or vague content into strong, impactful statements
- Add action verbs (Developed, Optimized, Engineered, Led, Built)
- Add measurable impact wherever possible (%, time saved, performance improved)
- Infer reasonable improvements if data is vague (but keep realistic)

3. ATS OPTIMIZATION:
- Use relevant keywords from tech/domain
- Keep formatting clean (no emojis, no fancy symbols)
- Use bullet points for readability
- Avoid unnecessary fluff

4. FORMATTING:
- Use clear headings (ALL CAPS)
- Use consistent bullet points
- Maintain spacing between sections
- Make it look like a real professional resume (not a paragraph)

5. TONE:
- Professional, confident, concise
- No repetition
- No generic phrases like "hardworking individual"

6. OUTPUT FORMAT:
Return ONLY the final resume text (no explanations)

Generate a polished, industry-ready resume.
`;

    let aiResume = "";

    let retries = 2;
    let stream;

    while (retries >= 0) {
      try {
        stream = await openrouter.chat.send({
          chatGenerationParams: {
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            stream: true,
          },
        });
        break; // success
      } catch (err) {
        if (retries === 0) throw err;
        console.log("Retrying due to rate limit...");
        retries--;
        await new Promise(res => setTimeout(res, 2000));
      }
    }

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        aiResume += content;
      }
    }

    res.json({
      success: true,
      resume: aiResume,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

// 🚀 Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});