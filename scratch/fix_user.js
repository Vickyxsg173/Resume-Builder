import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function fixUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'vikrantv.pvt@gmail.com';
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('Current status:', {
        email: user.email,
        premiumType: user.premiumType,
        isPremium: user.isPremium,
        generationLimit: user.generationLimit,
        interviewLimit: user.interviewLimit
      });
      
      const result = await User.updateOne(
        { email },
        { 
          $set: { 
            generationLimit: 5, 
            interviewLimit: 15,
            isPremium: false,
            premiumType: 'none'
          } 
        }
      );
      
      console.log('Update result:', result);
      
      const updatedUser = await User.findOne({ email });
      console.log('New status:', {
        email: updatedUser.email,
        premiumType: updatedUser.premiumType,
        isPremium: updatedUser.isPremium,
        generationLimit: updatedUser.generationLimit,
        interviewLimit: updatedUser.interviewLimit
      });
    } else {
      console.log('User not found:', email);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

fixUser();
