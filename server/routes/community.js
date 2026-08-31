import express from 'express';
import { CommunityRepository } from '../models/CommunityRecipe.js';

const router = express.Router();

// GET /api/community - Retrieve community recipes
router.get('/community', async (req, res) => {
  try {
    const recipes = await CommunityRepository.getAll();
    return res.status(200).json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error('Error fetching community recipes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve community recipes.',
    });
  }
});

// POST /api/community - Publish a recipe to the Community Exchange
router.post('/community', async (req, res) => {
  try {
    const { authorName, authorTitle, recipeTitle, recipeDescription, ingredients, recipeSteps } = req.body;

    if (!recipeTitle) {
      return res.status(400).json({
        success: false,
        error: 'Recipe title is required.',
      });
    }

    const newRecipe = await CommunityRepository.create({
      authorName: authorName || 'Home Cook',
      authorTitle: authorTitle || 'Pantry Explorer',
      recipeTitle: recipeTitle.trim(),
      recipeDescription: recipeDescription?.trim() || '',
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      recipeSteps: Array.isArray(recipeSteps) ? recipeSteps : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Recipe published to the Public Community Ledger!',
      recipe: newRecipe,
    });
  } catch (error) {
    console.error('Error publishing community recipe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to publish recipe to community.',
    });
  }
});

// POST /api/community/:id/stamp - Upvote/stamp a community recipe
router.post('/community/:id/stamp', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await CommunityRepository.stamp(id);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Stamp registered in the community ledger!',
      recipe: updated,
    });
  } catch (error) {
    console.error('Error stamping community recipe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to stamp community recipe.',
    });
  }
});

export default router;
