import express from 'express';
import { askSousChefWithAI } from '../services/aiService.js';

const router = express.Router();

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history, context, ingredients, allergens } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a cooking question or culinary inquiry.',
      });
    }

    const { reply, source } = await askSousChefWithAI(
      message.trim(),
      Array.isArray(history) ? history : [],
      context || { ingredients, allergens }
    );

    return res.status(200).json({
      success: true,
      reply,
      source: source || 'gemini',
    });
  } catch (error) {
    console.error('Error in /api/chat:', error.message, error.status ? `(status: ${error.status})` : '');
    return res.status(500).json({
      success: false,
      error: 'Chef Auguste is temporarily caught at the stove. Please try again in a moment!',
    });
  }
});

export default router;
