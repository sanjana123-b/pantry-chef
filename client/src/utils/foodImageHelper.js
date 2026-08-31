/**
 * Curated High-Definition Culinary Photography Fallback Engine
 */
const CULINARY_IMAGE_CATALOG = [
  {
    keywords: ['egg', 'omelet', 'frittata', 'scramble', 'breakfast'],
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['pasta', 'spaghetti', 'penne', 'macaroni', 'noodle'],
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['skillet', 'pan', 'sear', 'crispy', 'fry', 'saute'],
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['tomato', 'marinara', 'stew', 'curry', 'sauce'],
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['soup', 'simmer', 'broth', 'pot', 'chowder'],
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['rice', 'grain', 'bowl', 'stir-fry'],
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['salad', 'spinach', 'greens', 'lettuce', 'herb'],
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['chicken', 'poultry', 'roast', 'meat'],
    url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['potato', 'crisp', 'bake', 'tater'],
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  },
  {
    keywords: ['cheese', 'toast', 'melt', 'cheddar'],
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  },
];

export function getCuratedDishPhoto(title = '', description = '', ingredients = []) {
  const full = `${title} ${description} ${ingredients.join(' ')}`.toLowerCase();
  for (const item of CULINARY_IMAGE_CATALOG) {
    if (item.keywords.some((k) => full.includes(k))) {
      return item.url;
    }
  }
  return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';
}
