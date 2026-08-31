import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Curated high-resolution culinary stock photo collection by primary ingredient / dish type
const CULINARY_STOCK_MAP = [
  { keywords: ['egg', 'omelet', 'frittata', 'breakfast'], url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['pasta', 'spaghetti', 'noodle'], url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['skillet', 'pan', 'sear', 'saute'], url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['tomato', 'sauce', 'stew', 'curry'], url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['soup', 'simmer', 'broth', 'pot'], url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['rice', 'bowl', 'stir-fry'], url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['salad', 'spinach', 'greens', 'herb'], url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['chicken', 'roast', 'meat'], url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['potato', 'crisp', 'bake'], url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['cheese', 'toast', 'bake'], url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80' },
];

function matchCuratedImage(title, description, ingredients = []) {
  const fullText = `${title} ${description} ${ingredients.join(' ')}`.toLowerCase();
  for (const item of CULINARY_STOCK_MAP) {
    if (item.keywords.some((k) => fullText.includes(k))) {
      return item.url;
    }
  }
  return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';
}

// POST /api/generate-dish-image
router.post('/generate-dish-image', async (req, res) => {
  try {
    const { title, description, ingredients } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Recipe title is required to generate dish illustration.',
      });
    }

    const matchedUrl = matchCuratedImage(title, description || '', ingredients || []);

    return res.status(200).json({
      success: true,
      imageUrl: matchedUrl,
      source: 'curated_culinary_photo',
      title,
    });
  } catch (error) {
    console.error('Error generating dish image:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate dish image.',
    });
  }
});

export default router;
