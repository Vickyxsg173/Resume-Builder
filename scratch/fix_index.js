import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixIndex() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is missing in .env");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected.");

    const collection = mongoose.connection.collection('users');
    
    console.log("Checking indexes...");
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes.map(i => i.name));

    if (indexes.find(i => i.name === 'googleId_1')) {
      console.log("Dropping googleId_1 index...");
      await collection.dropIndex('googleId_1');
      console.log("✅ Index dropped.");
    } else {
      console.log("ℹ️ Index googleId_1 not found.");
    }

    console.log("Closing connection...");
    await mongoose.connection.close();
    console.log("Done. Please restart your server to allow Mongoose to recreate the sparse index.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

fixIndex();
