import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { isDBConnected } from '../config/db.js';

// In-Memory store fallback
const memoryCommunityStore = new Map();

// Seed initial community recipes so the feed is vibrant and inspiring immediately
const SEED_RECIPES = [
  {
    _id: 'seed-1',
    id: 'seed-1',
    authorName: 'Chef Clara',
    authorTitle: 'Zero-Waste Artisan',
    recipeTitle: 'Caramelized Onion & Potato Skillet Frittata',
    recipeDescription: 'An honest skillet lunch utilizing leftover boiled potatoes and slow-browned sweet onions.',
    ingredients: ['Potatoes', 'Onions', 'Eggs', 'Olive Oil', 'Black Pepper'],
    recipeSteps: [
      'Slice cold cooked potatoes into 1/4-inch coins.',
      'Slowly caramelize sliced onions in 2 tbsp olive oil until deep golden brown (approx 10 mins).',
      'Whisk 4 eggs with salt, pepper, and a splash of water.',
      'Layer potatoes over onions in the pan, pour eggs over, and cook on low flame for 6 mins.',
      'Slide under broiler for 2 mins until puffed and golden. Serve warm.'
    ],
    stampsCount: 42,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'seed-2',
    id: 'seed-2',
    authorName: 'Chef Mateo',
    authorTitle: 'Crisper Drawer Wizard',
    recipeTitle: 'Rustic Garlic Tomato Bean Stew',
    recipeDescription: 'A 15-minute hearty pantry reduction made exclusively with canned staples and herbs.',
    ingredients: ['Cannellini Beans', 'Canned Tomatoes', 'Garlic', 'Olive Oil', 'Dried Oregano'],
    recipeSteps: [
      'Gently heat 3 tbsp olive oil in a saucepan with 4 smashed garlic cloves until fragrant.',
      'Add whole canned tomatoes, crushing them lightly with a wooden spoon.',
      'Rinse beans and stir into the simmering sauce with oregano and sea salt.',
      'Simmer for 10 minutes until thick and glossy. Serve with crusty bread.'
    ],
    stampsCount: 38,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: 'seed-3',
    id: 'seed-3',
    authorName: 'Chef Sophie',
    authorTitle: 'Weekend Baker & Cook',
    recipeTitle: 'Crispy Wilted Spinach & Garlic Butter Rice',
    recipeDescription: 'Transform day-old cold rice into a golden, fragrant bowl packed with greens.',
    ingredients: ['Cooked Rice', 'Spinach', 'Garlic', 'Butter', 'Soy Sauce'],
    recipeSteps: [
      'Melt butter in a wide frying pan over medium-high heat with minced garlic.',
      'Add day-old rice, pressing down flat to develop a crispy, golden bottom layer (4 mins).',
      'Toss in fresh spinach leaves, letting them wilt in the residual pan steam.',
      'Drizzle with a dash of soy sauce, toss well, and serve steaming hot.'
    ],
    stampsCount: 29,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

// Initialize memory store with seed recipes
SEED_RECIPES.forEach((r) => memoryCommunityStore.set(r.id, { ...r }));

const communityRecipeSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, default: 'Home Chef' },
    authorTitle: { type: String, default: 'Pantry Cook' },
    recipeTitle: { type: String, required: true, trim: true },
    recipeDescription: { type: String, required: true, trim: true },
    ingredients: { type: [String], default: [] },
    recipeSteps: { type: [String], default: [] },
    stampsCount: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MongooseCommunityRecipe = mongoose.model('CommunityRecipe', communityRecipeSchema);

export const CommunityRepository = {
  async getAll() {
    if (isDBConnected()) {
      const docs = await MongooseCommunityRecipe.find().sort({ stampsCount: -1, createdAt: -1 });
      if (docs.length > 0) return docs;
    }
    return Array.from(memoryCommunityStore.values()).sort(
      (a, b) => b.stampsCount - a.stampsCount || new Date(b.createdAt) - new Date(a.createdAt)
    );
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
