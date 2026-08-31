import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pantrychef';

  try {
    // Attempt standard connection with 1.5s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
    });
    isConnected = true;
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[Database] Local/remote MongoDB is offline (${err.message}).`);
    console.log('[Database] Active Mode: Fast In-Memory Memory Ledger Store (zero-config local mode enabled)');
  }
};

export const isDBConnected = () => isConnected;
