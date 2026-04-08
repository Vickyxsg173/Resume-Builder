import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";
import axios from "axios";

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

Your task is to transform raw, unstructured user input into a highly professional, ATS-friendly resume.

User Data:
${JSON.stringify(userData, null, 2)}

STRICT INSTRUCTIONS:

1. MARKDOWN FORMATTING RULES (CRITICAL):
- ABSOLUTELY DO NOT use bold text formatting (no asterisks **, no __). We apply clean CSS fonts automatically.
- Use exactly ONE '#' for the candidate's Full Name at the very top.
- IMMEDIATELY below the Name, place the Contact Info and Links on a single plain text line separated by " | ". Do NOT use a header for this line.
- Use exactly TWO '##' for main Section Headers (e.g. ## Professional Summary, ## Experience, ## Education).
- Use exactly THREE '###' for job titles, company names, project titles, or degrees.
- Use the standard minus sign '-' strictly for bulleted lists.
- Do NOT use hyphens as dividers or random symbols. Keep it clean text.

2. STRUCTURE REQUIREMENT:
- Name (Heading 1)
- Contact Info & Links (Plain text, pipe separated)
- Professional Summary
- Key Skills
- Professional Experience
- Projects
- Education

3. ATS OPTIMIZATION & CONTENT:
- Ensure all bullet points use strong action verbs (Developed, Engineered, Optimized, Led).
- Add measurable impact/metrics wherever logically inferable.
- Keep it highly concise, avoiding generic fluff words like "hardworking".

4. OUTPUT FORMAT:
Return ONLY the final resume markdown text. Do not output any conversational filler or codeblocks.
`;

    let aiResume = "";
    let retries = 2;

    while (retries >= 0) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        aiResume = response.data.choices[0].message.content;
        break; // success
      } catch (err) {
        if (retries === 0) throw err;
        console.log("Retrying due to rate limit...");
        retries--;
        await new Promise(res => setTimeout(res, 2000));
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

app.get("/api/interview/start", async (req, res) => {
  try {
    const completion = await openrouter.chat.send({
      chatGenerationParams: {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional interviewer. Ask one challenging technical interview question.\n\nSTRICT RULES:\n1. Output ONLY the raw question text.\n2. Do NOT use any Markdown formatting whatsoever (no **asterisks**).\n3. Do NOT start your sentence with 'Question:' or 'Interview Question:'.",
          },
        ],
      },
    });

    const question = completion.choices[0].message.content;

    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

app.post("/api/interview/answer", async (req, res) => {
  const { question, answer } = req.body;

  try {
    const completion = await openrouter.chat.send({
      chatGenerationParams: {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an interviewer.

- Evaluate the answer
- Give feedback
- Give score out of 10

Respond clearly in plain text. Do NOT ask any follow-up or next question.
            `,
          },
          {
            role: "user",
            content: `Question: ${question}\nAnswer: ${answer}`,
          },
        ],
      },
    });

    const output = completion.choices[0].message.content;

    res.json({
      feedback: output,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Streaming failed" });
  }
});


app.get("/api/hn-news", async (req, res) => {
  try {
    // Step 1: Get top story IDs
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    const ids = response.data;

    // Step 2: Take first 5
    const topIds = ids.slice(0, 50);

    let news = [];

    // Step 3: Fetch each story (simple loop)
    for (let i = 0; i < topIds.length; i++) {
      const story = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${topIds[i]}.json`
      );

      news.push({
        title: story.data.title,
        url:
          story.data.url ||
          `https://news.ycombinator.com/item?id=${topIds[i]}`,
        author: story.data.by,
      });
    }

    // Step 4: Send to frontend
    res.json({
      success: true,
      news: news,
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant built INTO this website. You MUST only help users using the features and tools available on THIS platform.

CONTEXT OF THIS WEBSITE:
- Name of website/webapp is ResumeBuild
- Resume Builder (AI generates resumes from user input)
- Interview Simulator (asks questions and evaluates answers)
- AI Chat for career guidance
- Tech News section (if asked source or authenticity it is powered by hackernews so legit)
- Home,Build,InterviewPrep,News,About,Contact,Profile these are the pages in my website
- Details to enter in build page to create resume -> name,summary,skills,experience,projects,education

STRICT RULES:
- ABSOLUTELY DO NOT use bold text formatting (no asterisks **, no __).
- Use clear, plain text for headings if needed.
- Use standard bullet points (-) only.
- DO NOT suggest or mention other websites, platforms, or external tools
- DO NOT say "you can use other sites" or give alternatives outside this product
- ALWAYS guide the user on how to use THIS website's features
- If user asks about resumes → guide them to use the resume generator feature
- If user asks about interview prep → guide them to the interview simulator
- Keep answers practical and action-oriented within this platform

TONE:
- Helpful, product-focused, like an in-app assistant
- Concise and clear

Your goal is to make the user successfully use THIS website, not anything else.`
          },
          ...messages
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 🚀 Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});