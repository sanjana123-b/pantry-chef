import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let isConnected = false;
let memoryServer;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pantrychef';

  try {
    // Attempt standard connection with 1.5s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
    });
    isConnected = true;
    console.log("[Database] Connected to MongoDB");
  } catch (err) {
    console.warn(`[Database] Local/remote MongoDB is offline (${err.message}).`);
    try {
      memoryServer = await MongoMemoryServer.create();
      await mongoose.connect(memoryServer.getUri('pantrychef'), {
        serverSelectionTimeoutMS: 10000,
      });
      isConnected = true;
      console.log('[Database] Active Mode: In-Memory MongoDB fallback');
    } catch (memoryError) {
      if (memoryServer) {
        await memoryServer.stop();
        memoryServer = undefined;
      }
      isConnected = false;
      console.warn(`[Database] In-Memory MongoDB could not start (${memoryError.message}).`);
      console.log('[Database] Active Mode: In-memory ledger store');
    }
  }
};

export const isDBConnected = () => isConnected;
