import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { sessionUser } from './middleware/sessionUser.js';
import recipesRouter from './routes/recipes.js';
import favoritesRouter from './routes/favorites.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';
import visionRouter from './routes/vision.js';
import communityRouter from './routes/community.js';
import imageGenRouter from './routes/imageGen.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with fallback in-memory instance)
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

// Apply session cookie middleware to all /api requests
app.use('/api', sessionUser);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sessionUser: req.userId || 'anonymous',
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api', recipesRouter);
app.use('/api', favoritesRouter);
app.use('/api', chatRouter);
app.use('/api', visionRouter);
app.use('/api', communityRouter);
app.use('/api', imageGenRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`\n🍲 PantryChef Server running on http://localhost:${PORT}`);
  console.log(`📜 Ready to craft recipes from pantry staples\n`);
});
