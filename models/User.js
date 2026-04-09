import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  savedResumes: [
    {
      title: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // 🔢 Usage Tracking
  generationsUsed: {
    type: Number,
    default: 0,
  },
  generationLimit: {
    type: Number,
    default: 5, // Free tier: 5 resume generations per day
  },
  interviewsUsed: {
    type: Number,
    default: 0,
  },
  interviewLimit: {
    type: Number,
    default: 15, // Free tier: 15 interview sessions per day
  },
  lastCreditReset: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  premiumType: {
    type: String,
    enum: ['monthly', 'yearly', 'none'],
    default: 'none',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
