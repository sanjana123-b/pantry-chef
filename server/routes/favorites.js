import express from 'express';
import { FavoriteRepository } from '../models/Favorite.js';

const router = express.Router();

// GET /api/favorites - Retrieve all saved recipes for current session user
router.get('/favorites', async (req, res) => {
  try {
    const favorites = await FavoriteRepository.findByUser(req.userId);
    return res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve saved recipes.',
    });
  }
});

// POST /api/favorites - Save a new recipe
router.post('/favorites', async (req, res) => {
  try {
    const { ingredients, recipeTitle, recipeDescription, recipeSteps } = req.body;

    if (!recipeTitle) {
      return res.status(400).json({
        success: false,
        error: 'Recipe title is required.',
      });
    }

    // Check if already saved for this user to avoid duplicates
    const existing = await FavoriteRepository.findOne(req.userId, recipeTitle);

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Recipe already in favorites.',
        favorite: existing,
        alreadySaved: true,
      });
    }

    const favorite = await FavoriteRepository.create({
      userId: req.userId,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      recipeTitle: recipeTitle.trim(),
      recipeDescription: recipeDescription?.trim() || '',
      recipeSteps: Array.isArray(recipeSteps) ? recipeSteps : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Recipe saved to favorites.',
      favorite,
      alreadySaved: false,
    });
  } catch (error) {
    console.error('Error saving favorite:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save recipe to favorites.',
    });
  }
});

// DELETE /api/favorites/:id - Remove a saved recipe
router.delete('/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FavoriteRepository.deleteOne(id, req.userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Saved recipe not found or unauthorized to delete.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Recipe removed from favorites.',
      id,
    });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove saved recipe.',
    });
  }
});

export default router;
