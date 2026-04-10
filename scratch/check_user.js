import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'vikrantvaidya17@gmail.com' });
    if (user) {
      console.log("User found:");
      console.log("Email:", user.email);
      console.log("isLocal:", user.isLocal);
      console.log("googleId:", user.googleId);
    } else {
      console.log("User not found: vikrantv.pvt@gmail.com");
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkUser();
