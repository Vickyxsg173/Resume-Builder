import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

async function testPasswordResetSync() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    const email = 'test_reset@example.com';
    
    // 1. Cleanup & Create test user
    await User.deleteOne({ email });
    const initialPassword = 'oldpassword123';
    const hashedOld = await bcrypt.hash(initialPassword, 12);
    
    const user = await User.create({
      email,
      password: hashedOld,
      displayName: 'Reset Test',
      isLocal: true
    });
    console.log("Test user created.");

    // 2. Mock Reset
    const newPassword = 'newpassword456';
    const hashedNew = await bcrypt.hash(newPassword, 12);
    
    // Find user (without password selected)
    const foundUser = await User.findOne({ email });
    foundUser.password = hashedNew;
    await foundUser.save();
    console.log("Password updated via .save()");

    // 3. Verify Login Match
    const userForLogin = await User.findOne({ email }).select('+password');
    console.log("Password in DB (hashed):", userForLogin.password);
    
    const isMatch = await bcrypt.compare(newPassword, userForLogin.password);
    console.log("Comparison result:", isMatch ? "✅ SUCCESS: Passwords match!" : "❌ FAIL: Passwords do NOT match!");

    if (!isMatch) {
      const isOldMatch = await bcrypt.compare(initialPassword, userForLogin.password);
      console.log("Is it still the old password?", isOldMatch ? "YES (Update failed)" : "NO (Something else is wrong)");
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

testPasswordResetSync();
