import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { isDBConnected } from '../config/db.js';
import SEED_RECIPES from '../data/communityRecipes.js';

const memoryCommunityStore = new Map();

const communityRecipeSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, default: 'Home Chef' },
    authorTitle: { type: String, default: 'Pantry Cook' },
    recipeTitle: { type: String, required: true, trim: true },
    recipeDescription: { type: String, required: true, trim: true },
    ingredients: { type: [String], default: [] },
    recipeSteps: { type: [String], default: [] },
    cookTime: { type: Number, min: 1 },
    tags: { type: [String], default: [] },
    imagePath: { type: String, trim: true },
    stampsCount: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MongooseCommunityRecipe = mongoose.model('CommunityRecipe', communityRecipeSchema);

export const CommunityRepository = {
  async seedMissing() {
    if (isDBConnected()) {
      await Promise.all(
        SEED_RECIPES.map((recipe) => {
          const { _id, id, ...seedData } = recipe;
          return MongooseCommunityRecipe.updateOne(
            { recipeTitle: recipe.recipeTitle },
            { $setOnInsert: seedData },
            { upsert: true }
          );
        })
      );
      return;
    }

    const existingTitles = new Set(
      Array.from(memoryCommunityStore.values()).map((recipe) => recipe.recipeTitle.toLowerCase())
    );
    SEED_RECIPES.forEach((recipe) => {
      if (!existingTitles.has(recipe.recipeTitle.toLowerCase())) {
        memoryCommunityStore.set(recipe.id, { ...recipe });
      }
    });
  },

  async getAll() {
    let list = [];
    if (isDBConnected()) {
      const docs = await MongooseCommunityRecipe.find().sort({ stampsCount: -1, createdAt: -1 });
      if (docs.length > 0) {
        list = docs;
      }
    }
    if (list.length === 0) {
      list = Array.from(memoryCommunityStore.values()).sort(
        (a, b) => b.stampsCount - a.stampsCount || new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // De-duplicate by unique _id, id, and recipeTitle to prevent duplicate renders
    const seen = new Map();
    for (const item of list) {
      const key = String(item._id || item.id || item.recipeTitle).toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, item);
      }
    }
    return Array.from(seen.values());
  },

  async create(data) {
    if (isDBConnected()) {
      return await MongooseCommunityRecipe.create({
        authorName: data.authorName || 'Home Chef',
        authorTitle: data.authorTitle || 'Pantry Cook',
        recipeTitle: data.recipeTitle.trim(),
        recipeDescription: data.recipeDescription?.trim() || '',
        ingredients: data.ingredients || [],
        recipeSteps: data.recipeSteps || [],
        cookTime: data.cookTime,
        tags: data.tags || [],
        imagePath: data.imagePath,
        stampsCount: 1,
      });
    }

    const id = uuidv4();
    const newDoc = {
      _id: id,
      id: id,
      authorName: data.authorName || 'Home Chef',
      authorTitle: data.authorTitle || 'Pantry Cook',
      recipeTitle: data.recipeTitle.trim(),
      recipeDescription: data.recipeDescription?.trim() || '',
      ingredients: data.ingredients || [],
      recipeSteps: data.recipeSteps || [],
      cookTime: data.cookTime,
      tags: data.tags || [],
      imagePath: data.imagePath,
      stampsCount: 1,
      createdAt: new Date().toISOString(),
    };
    memoryCommunityStore.set(id, newDoc);
    return newDoc;
  },

  async stamp(id) {
    if (isDBConnected()) {
      return await MongooseCommunityRecipe.findByIdAndUpdate(
        id,
        { $inc: { stampsCount: 1 } },
        { new: true }
      );
    }
    const doc = memoryCommunityStore.get(id);
    if (doc) {
      doc.stampsCount = (doc.stampsCount || 0) + 1;
      memoryCommunityStore.set(id, doc);
      return doc;
    }
    return null;
  },
};

export default MongooseCommunityRecipe;
