import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allow multiple nulls/undefined
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
  password: {
    type: String,
    select: false, // Don't return password by default
  },
  isLocal: {
    type: Boolean,
    default: false,
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
  // Usage tracking
  generationsUsed: {
    type: Number,
    default: 0,
  },
  generationLimit: {
    type: Number,
    default: 5,
  },
  interviewsUsed: {
    type: Number,
    default: 0,
  },
  interviewLimit: {
    type: Number,
    default: 15,
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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.model('User', userSchema);

export default User;
