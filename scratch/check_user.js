import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function checkUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: 'vikrantv.pvt@gmail.com' });
  console.log('User found:', JSON.stringify(user, null, 2));
  await mongoose.disconnect();
}

checkUser();
