import express from 'express';
import { generateRecipesWithAI } from '../services/aiService.js';

const router = express.Router();

// POST /api/generate-recipes
router.post('/generate-recipes', async (req, res) => {
  try {
    const { ingredients, dietary, cuisine } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one ingredient to generate recipes.',
      });
    }

    const cleanIngredients = ingredients
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);

    if (cleanIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Ingredient names cannot be empty.',
      });
    }

    const recipes = await generateRecipesWithAI(cleanIngredients, {
      dietary: Array.isArray(dietary) ? dietary : [],
      cuisine: typeof cuisine === 'string' ? cuisine : '',
    });

    return res.status(200).json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error('Error in /api/generate-recipes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate recipes. Please try again.',
      details: error.message,
    });
  }
});

export default router;
