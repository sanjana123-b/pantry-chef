import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { isDBConnected } from '../config/db.js';

// In-Memory fallback store for zero-config local development
const memoryStore = new Map();

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    ingredients: {
      type: [String],
      required: true,
      default: [],
    },
    recipeTitle: {
      type: String,
      required: true,
      trim: true,
    },
    recipeDescription: {
      type: String,
      required: true,
      trim: true,
    },
    recipeSteps: {
      type: [String],
      required: true,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseFavorite = mongoose.model('Favorite', favoriteSchema);

export const FavoriteRepository = {
  async findByUser(userId) {
    if (isDBConnected()) {
      return await MongooseFavorite.find({ userId }).sort({ createdAt: -1 });
    }
    const userFavorites = Array.from(memoryStore.values())
      .filter((fav) => fav.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return userFavorites;
  },

  async findOne(userId, title) {
    if (isDBConnected()) {
      return await MongooseFavorite.findOne({
        userId,
        recipeTitle: title.trim(),
      });
    }
    return Array.from(memoryStore.values()).find(
      (fav) => fav.userId === userId && fav.recipeTitle.toLowerCase() === title.trim().toLowerCase()
    ) || null;
  },

  async create(data) {
    if (isDBConnected()) {
      return await MongooseFavorite.create(data);
    }
    const id = uuidv4();
    const newDoc = {
      _id: id,
      id: id,
      userId: data.userId,
      ingredients: data.ingredients || [],
      recipeTitle: data.recipeTitle.trim(),
      recipeDescription: data.recipeDescription?.trim() || '',
      recipeSteps: data.recipeSteps || [],
      createdAt: new Date().toISOString(),
    };
    memoryStore.set(id, newDoc);
    return newDoc;
  },

  async deleteOne(id, userId) {
    if (isDBConnected()) {
      return await MongooseFavorite.findOneAndDelete({ _id: id, userId });
    }
    const doc = memoryStore.get(id);
    if (doc && doc.userId === userId) {
      memoryStore.delete(id);
      return doc;
    }
    return null;
  }
};

export default MongooseFavorite;
