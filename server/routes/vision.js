import express from 'express';
import { scanPantryPhotoWithAI } from '../services/aiService.js';

const router = express.Router();

// POST /api/scan-pantry
router.post('/scan-pantry', async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid image (base64 string) of your fridge, pantry, or grocery receipt.',
      });
    }

    const ingredients = await scanPantryPhotoWithAI(image, mimeType || 'image/jpeg');

    return res.status(200).json({
      success: true,
      ingredients,
      count: ingredients.length,
    });
  } catch (error) {
    console.error('Error in /api/scan-pantry:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to scan image. Please try another photo or enter ingredients manually.',
    });
  }
});

export default router;
