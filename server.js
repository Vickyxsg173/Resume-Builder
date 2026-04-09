import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";
import axios from "axios";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import User from "./models/User.js";
import Message from "./models/Message.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import path from "path";
import { fileURLToPath } from 'url';

// 🛑 GLOBAL ERROR HANDLERS (Absolute Top)
process.on('uncaughtException', (err) => {
  console.error('💥 CRASH: Uncaught Exception!');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (promise, reason) => {
  console.error('💥 CRASH: Unhandled Rejection!');
  console.error(reason);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// 🔍 Environment Variable Validation
const requiredEnv = ['OPENROUTER_API_KEY', 'MONGODB_URI', 'SESSION_SECRET'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.warn(`⚠️  WARNING: Environment variable ${key} is missing!`);
  }
});

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const app = express();

// 🔐 Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com", "https://www.gstatic.com"],
      connectSrc: ["'self'", "https://openrouter.ai", "https://hacker-news.firebaseio.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.set('trust proxy', 1);

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error Details:', err.message);
    // Optimization: Don't crash the server, just log the error
  });

// 🛡️ Middleware
const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());

// 🚦 Rate Limiting (Prevent AI Abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user && req.user.isAdmin, // 👑 Admin Bypass
});

// Apply limiter to expensive AI routes
app.use("/generate-resume", apiLimiter);
app.use("/api/chat", apiLimiter);
app.use("/api/interview", apiLimiter);

// 📦 Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true, // Prevents XSS from reading cookies
    secure: isProduction, // Cookies only over HTTPS in production
    sameSite: isProduction ? 'none' : 'lax' // CSRF protection
  }
}));

// 🔑 Passport Setup (Conditional to prevent crash)
app.use(passport.initialize());
app.use(passport.session());

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value
      };

      try {
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
        const isAdmin = adminEmails.includes(profile.emails[0].value);
        
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // Update admin status if it changed
          user.isAdmin = isAdmin;
          await user.save();
          done(null, user);
        } else {
          user = await User.create({ ...newUser, isAdmin });
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  ));
} else {
  console.warn("⚠️  WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Authentication will not work.");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 🚦 Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: `${frontendUrl}/login` }),
  (req, res) => {
    res.redirect(frontendUrl);
  }
);

app.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ success: true });
  });
});

app.get("/auth/user", (req, res) => {
  if (req.user) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Profile & Customization Middleware
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// 🔄 Daily Credits Reset Middleware
const checkAndResetCredits = async (req, res, next) => {
  if (!req.user || req.user.isAdmin) return next();

  const now = new Date();
  const lastReset = new Date(req.user.lastCreditReset || 0);

  // Check if it's a new calendar day (UTC)
  const isNewDay = 
    now.getUTCDate() !== lastReset.getUTCDate() || 
    now.getUTCMonth() !== lastReset.getUTCMonth() || 
    now.getUTCFullYear() !== lastReset.getUTCFullYear();

  if (isNewDay) {
    try {
      req.user.generationsUsed = 0;
      req.user.interviewsUsed = 0;
      req.user.lastCreditReset = now;
      await req.user.save();
    } catch (err) {
      console.error("Credit reset error:", err);
    }
  }
  next();
};

// 👑 Admin Authentication Middleware
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: "Access denied. Admin privileges required." });
};

// 👤 Profile Routes
app.get("/api/profile", ensureAuth, (req, res) => {
  res.json(req.user);
});

app.patch("/api/profile/skills", ensureAuth, async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { skills }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update skills" });
  }
});

app.post("/api/profile/resumes", ensureAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.user._id);
    user.savedResumes.push({ title, content });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to save resume" });
  }
});

// 🗑️ Delete a saved resume
app.delete("/api/profile/resumes/:resumeId", ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedResumes = user.savedResumes.filter(
      (r) => r._id.toString() !== req.params.resumeId
    );
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

// 💳 Get Credits Info
app.get("/api/profile/credits", ensureAuth, checkAndResetCredits, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      isAdmin: user.isAdmin,
      generationsUsed: user.generationsUsed,
      generationLimit: user.isAdmin ? Infinity : user.generationLimit,
      interviewsUsed: user.interviewsUsed,
      interviewLimit: user.isAdmin ? Infinity : user.interviewLimit,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch credits" });
  }
});

const PORT = process.env.PORT || 5000;

// 🔥 MAIN ROUTE — Auth required: history tracking + prevents API abuse
app.post("/generate-resume", ensureAuth, checkAndResetCredits, async (req, res) => {
  try {
    // 🛡️ Limit Enforcement
    if (!req.user.isAdmin && req.user.generationsUsed >= req.user.generationLimit) {
      return res.status(403).json({ 
        success: false, 
        message: "Daily resume generation limit reached (5/day). Your credits will refresh tomorrow!" 
      });
    }

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

    // 📊 Track usage & Return response
    await User.findByIdAndUpdate(req.user._id, { $inc: { generationsUsed: 1 } });

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

app.get("/api/interview/start", ensureAuth, checkAndResetCredits, async (req, res) => {
  try {
    // 🛡️ Limit Enforcement
    if (!req.user.isAdmin && req.user.interviewsUsed >= req.user.interviewLimit) {
      return res.status(403).json({ 
        error: "Daily interview limit reached (15/day). Your credits will refresh tomorrow!" 
      });
    }

    // 📊 Track usage
    await User.findByIdAndUpdate(req.user._id, { $inc: { interviewsUsed: 1 } });

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

app.post("/api/interview/answer", ensureAuth, async (req, res) => {
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

    // Step 3: Fetch all stories in parallel (Faster & more stable)
    const storyPromises = topIds.map(id => 
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );

    const responses = await Promise.all(storyPromises);

    const news = responses.map((res, index) => ({
      title: res.data.title,
      url: res.data.url || `https://news.ycombinator.com/item?id=${topIds[index]}`,
      author: res.data.by,
    }));

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

app.post("/api/chat", ensureAuth, async (req, res) => {
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

// 📬 Public Contact Route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ success: true, message: "Sent successfully" });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// 🛡️ Admin Message Management
app.get("/api/admin/messages", ensureAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.delete("/api/admin/messages/:id", ensureAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// 🚀 Server Start


// ✅ Serve Production Build (Unified Deployment)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("/{*path}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});