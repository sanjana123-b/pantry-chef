import express from 'express';
import { askSousChefWithAI } from '../services/aiService.js';

const router = express.Router();

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a cooking question or culinary inquiry.',
      });
    }

    const reply = await askSousChefWithAI(message.trim(), Array.isArray(history) ? history : []);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      success: false,
      error: 'Chef is temporarily caught at the stove. Please ask again!',
    });
  }
});

export default router;
