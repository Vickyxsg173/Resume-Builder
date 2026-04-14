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
import MongoStore from "connect-mongo";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import path from "path";
import { fileURLToPath } from 'url';
import Razorpay from "razorpay";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';



// Global error handlers
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

// Environment variable validation
const requiredEnv = ['OPENROUTER_API_KEY', 'MONGODB_URI', 'SESSION_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.warn(`⚠️  WARNING: Environment variable ${key} is missing!`);
  }
});

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Supabase initialization
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com", "https://*.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com", "https://www.gstatic.com", "https://*.razorpay.com", "https://*.supabase.co", "https://ui-avatars.com"],
      connectSrc: ["'self'", "https://openrouter.ai", "https://hacker-news.firebaseio.com", "https://api.razorpay.com", "https://*.razorpay.com", "https://*.supabase.co"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://*.razorpay.com"],
      formAction: ["'self'", "https://api.razorpay.com", "https://*.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
}));
app.set('trust proxy', 1);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumeb')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error Details:', err.message);
  });

// Middleware
const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/generate-resume", apiLimiter);
app.use("/api/chat", apiLimiter);
app.use("/api/interview", apiLimiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: isProduction, // Cookies only over HTTPS in production
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

// Passport setup
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
        const email = profile.emails[0].value;
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
        const isAdmin = adminEmails.includes(email);
        
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          // User exists via Google
          user.isAdmin = isAdmin;
          await user.save();
          return done(null, user);
        }

        user = await User.findOne({ email });
        
        if (user) {
          // Link Google to existing Email account
          user.googleId = profile.id;
          if (!user.image || user.image.includes('ui-avatars')) {
            user.image = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        const newUserObj = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: email,
          image: profile.photos[0].value,
          isAdmin
        };
        user = await User.create(newUserObj);
        done(null, user);
        
      } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
      }
    }
  ));
} else {
  console.warn("⚠️  WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Authentication will not work.");
}

// Local auth strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const normalizedEmail = email.toLowerCase();
      console.log(`🔍 [LOGIN] Attempting for: ${normalizedEmail}`);
      
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        console.log(`❌ [LOGIN] User not found: ${normalizedEmail}`);
        return done(null, false, { message: 'Invalid email or password.' });
      }
      if (!user.isLocal) {
        console.log(`❌ [LOGIN] User is NOT local (Google login user): ${normalizedEmail}`);
        return done(null, false, { message: 'This account uses Google Login.' });
      }

      console.log(`🗝️ [LOGIN] Comparing passwords...`);
      console.log(`   - Stored Hash Prefix: ${user.password.substring(0, 7)}...`);
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        console.log(`❌ [LOGIN] Password mismatch for: ${normalizedEmail}`);
        return done(null, false, { message: 'Invalid email or password.' });
      }

      console.log(`✅ [LOGIN] Success: ${normalizedEmail}`);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


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

// Auth routes
app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message || "Login failed" });
    
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, user });
    });
  })(req, res, next);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: `${frontendUrl}/login` }),
  (req, res) => {
    res.redirect(frontendUrl);
  }
);

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const normalizedEmail = email.toLowerCase();
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
    const isAdmin = adminEmails.includes(email);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      isLocal: true,
      isAdmin,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || email)}&background=random`
    });

    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ error: "Login failed after signup" });
      res.status(201).json({ success: true, user: newUser });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Forgot password endpoint
app.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.isLocal) {
      return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: `ResumeBuild <${process.env.EMAIL_USER}>`,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("------------------------------");
    } else {
      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process forgot password" });
  }
});

// Reset password endpoint
app.post("/auth/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { 
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      },
      { new: true }
    );

    console.log(`✅ Password atomically reset for: ${updatedUser.email}`);

    req.login(updatedUser, (err) => {
      if (err) return res.status(500).json({ error: "Login failed after reset" });
      res.json({ success: true, message: "Password has been reset!", user: updatedUser });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

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

// Auth middleware
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// Credits reset middleware
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

// Profile photo upload
app.post("/api/profile/upload-photo", ensureAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${req.user._id}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // 1. Upload to Supabase Storage (using admin client to bypass CORS/Policies)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error("Supabase Admin Upload Error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { image: publicUrl },
      { new: true }
    );

    console.log(`✅ Profile photo updated via Backend: ${req.user.email}`);
    res.json({ success: true, user: updatedUser });

  } catch (err) {
    console.error("Backend Upload Failure:", err);
    res.status(500).json({ error: "Upload failed: " + (err.message || "Unknown error") });
  }
});

// Tier limits helper
const TIER_DEFAULTS = {
  none: { gen: 5, int: 15 },
  monthly: { gen: 10, int: 30 },
  yearly: { gen: 20, int: 50 }
};

const getTierLimits = (user) => {
  if (user.isAdmin) return { generationLimit: Infinity, interviewLimit: Infinity, tierName: "Admin" };
  
  let name = "Free";
  let defaults = TIER_DEFAULTS.none;

  if (user.isPremium) {
    name = user.premiumType === "yearly" ? "Yearly Premium" : "Monthly Premium";
    defaults = user.premiumType === "yearly" ? TIER_DEFAULTS.yearly : TIER_DEFAULTS.monthly;
  }
  
  let gen = user.generationLimit || defaults.gen;
  let int = user.interviewLimit || defaults.int;

  if (user.isPremium && gen <= TIER_DEFAULTS.none.gen) gen = defaults.gen;
  if (user.isPremium && int <= TIER_DEFAULTS.none.int) int = defaults.int;
  
  return { 
    generationLimit: gen, 
    interviewLimit: int, 
    tierName: name 
  };
};

// Admin middleware
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: "Access denied. Admin privileges required." });
};

// Profile routes
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

app.patch("/api/profile/image", ensureAuth, async (req, res) => {
  try {
    const { image } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { image }, { new: true });
    res.json(user);
  } catch (err) {
    console.error("Failed to update profile image:", err);
    res.status(500).json({ error: "Failed to update profile image" });
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

// Account deletion
app.delete("/api/profile", ensureAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    // Delete the user from MongoDB
    await User.findByIdAndDelete(userId);
    
    // Logout the user and destroy session
    req.logout((err) => {
      if (err) return res.status(500).json({ error: "Failed to logout during deletion" });
      req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Failed to destroy session" });
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Account deleted successfully" });
      });
    });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// Delete resume
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

// Credits info endpoint
app.get("/api/profile/credits", ensureAuth, checkAndResetCredits, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const limits = getTierLimits(user);
    
    res.json({
      isAdmin: user.isAdmin,
      generationsUsed: user.generationsUsed,
      generationLimit: limits.generationLimit,
      interviewsUsed: user.interviewsUsed,
      interviewLimit: limits.interviewLimit,
      isPremium: user.isPremium,
      premiumType: user.premiumType,
      tierName: limits.tierName
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch credits" });
  }
});

// Payment routes
app.post("/payment/create-order", ensureAuth, async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: "Payment gateway is not configured" });
  }
  const { plan } = req.body;
  const amount = plan === "monthly" ? 19900 : 229900;

  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${req.user._id.toString().slice(-10)}_${Date.now().toString().slice(-8)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ 
      error: "Failed to create payment order", 
      details: err.description || err.message || JSON.stringify(err)
    });
  }
});

app.post("/payment/verify", ensureAuth, async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: "Payment gateway is not configured" });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const genLimit = plan === 'yearly' ? 20 : 10;
      const intLimit = plan === 'yearly' ? 50 : 30;

      await User.findByIdAndUpdate(req.user._id, {
        isPremium: true,
        premiumType: plan,
        generationLimit: genLimit,
        interviewLimit: intLimit
      });
      res.json({ success: true, message: "Payment verified & Premium activated!" });
    } catch (err) {
      console.error("Upgrade Error:", err);
      res.status(500).json({ error: "Payment verified but failed to upgrade account" });
    }
  } else {
    console.error("Signature Mismatch!");
    console.error("Received Body:", body);
    console.error("Expected Signature:", expectedSignature);
    console.error("Received Signature:", razorpay_signature);
    res.status(400).json({ 
      success: false, 
      message: "Invalid payment signature",
      debug: { body, expected: expectedSignature, received: razorpay_signature }
    });
  }
});

// Admin routes
app.get("/api/admin/users", ensureAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "displayName email isPremium premiumType generationLimit interviewLimit createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.patch("/api/admin/users/:userId", ensureAdmin, async (req, res) => {
  try {
    const { premiumType, generationLimit, interviewLimit } = req.body;
    const isPremium = premiumType !== "none";
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        isPremium, 
        premiumType, 
        generationLimit: Number(generationLimit), 
        interviewLimit: Number(interviewLimit) 
      },
      { new: true }
    );
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/admin/users/:userId", ensureAdmin, async (req, res) => {
  try {
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(403).json({ error: "You cannot delete your own admin account." });
    }

    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin user deletion error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

const PORT = process.env.PORT || 5000;

// Resume generation route
app.post("/generate-resume", ensureAuth, checkAndResetCredits, async (req, res) => {
  try {
    // 🛡️ Limit Enforcement
    const limits = getTierLimits(req.user);
    if (!req.user.isAdmin && req.user.generationsUsed >= limits.generationLimit) {
      return res.status(403).json({ 
        success: false, 
        message: `Daily resume generation limit reached (${limits.generationLimit}/day). Upgrade for more!` 
      });
    }

    const userData = req.body;

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
        break;
      } catch (err) {
        if (retries === 0) throw err;
        console.log("Retrying due to rate limit...");
        retries--;
        await new Promise(res => setTimeout(res, 2000));
      }
    }

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

// Interview routes
app.get("/api/interview/start", ensureAuth, checkAndResetCredits, async (req, res) => {
  try {
    const limits = getTierLimits(req.user);
    if (!req.user.isAdmin && req.user.interviewsUsed >= limits.interviewLimit) {
      return res.status(403).json({ 
        error: `Daily interview limit reached (${limits.interviewLimit}/day). Upgrade for more!` 
      });
    }

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


// Hacker News route
app.get("/api/hn-news", async (req, res) => {
  try {
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );

    const ids = response.data;

    const topIds = ids.slice(0, 50);

    const storyPromises = topIds.map(id => 
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );

    const responses = await Promise.all(storyPromises);

    const news = responses.map((res, index) => ({
      title: res.data.title,
      url: res.data.url || `https://news.ycombinator.com/item?id=${topIds[index]}`,
      author: res.data.by,
    }));

    res.json({
      success: true,
      news: news,
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Chat route
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

TIER & PRICING DETAILS:
- Free Tier: 5 Daily Resume generations & 15 Daily Interview sessions.
- Monthly Premium (₹199/month): 10 Daily Resume generations & 30 Daily Interview sessions.
- Yearly Premium (₹2299/year - BEST VALUE): 20 Daily Resume generations & 50 Daily Interview sessions.
- Coming Soon Features (Roadmap): LinkedIn Profile Optimizer, Priority AI Processing, and Premium Multi-Design Templates.
- To upgrade: Guide users to the 'Profile' page where they can click 'Upgrade Now' or 'Upgrade to Premium'.
- All tiers include high-quality AI output and ATS-optimized formatting.

STRICT RULES:
- ABSOLUTELY DO NOT use bold text formatting (no asterisks **, no __).
- Use clear, plain text for headings if needed.
- Use standard bullet points (-) only.
- When users ask about upgrades or the 'Yearly' plan, ALWAYS highlight that it is the 'Best Value' and explicitly mention the 'Coming Soon' features (LinkedIn Optimizer, etc.) to show future value.
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

// Contact route
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

// Admin message management
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


// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Production build serving
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready on http://127.0.0.1:${PORT}`);
});