import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Search,
  Bookmark,
  Heart,
  ChefHat,
  Plus,
  CheckCircle2,
  X,
  Clock,
  Utensils,
} from 'lucide-react';
import { getCommunityRecipes, stampCommunityRecipe, publishCommunityRecipe } from '../api/client';
import ChefMascot from '../components/ChefMascot';
import { getCuratedDishPhoto, getIngredientEmoji } from '../utils/foodImageHelper';

const FILTER_TAGS = [
  'All',
  'Quick (<20 min)',
  'Vegetarian',
  'High-Protein',
  'Pasta & Rice',
  'Skillet & Stew',
];

export default function Community({
  onSaveToPersonalFavorites,
  user,
}) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [likedIds, setLikedIds] = useState({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newRecipeData, setNewRecipeData] = useState({
    recipeTitle: '',
    recipeDescription: '',
    ingredients: '',
    recipeSteps: '',
  });
  const [publishFeedback, setPublishFeedback] = useState(null);

  const fetchCommunityFeed = async () => {
    try {
      setIsLoading(true);
      const data = await getCommunityRecipes();

      // De-duplicate by _id, id, and recipeTitle on client
      const seen = new Set();
      const unique = [];
      for (const r of data || []) {
        const key = String(r._id || r.id || r.recipeTitle).toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(r);
        }
      }
      setRecipes(unique);
    } catch (err) {
      console.error('Error fetching community recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityFeed();
  }, []);

  const handleLike = async (id) => {
    if (!id || likedIds[id]) return;
    setLikedIds((prev) => ({ ...prev, [id]: true }));

    // Optimistically update like count
    setRecipes((prev) =>
      prev.map((r) =>
        (r._id || r.id) === id
          ? { ...r, stampsCount: (r.stampsCount || 1) + 1 }
          : r
      )
    );

    try {
      await stampCommunityRecipe(id);
    } catch (err) {
      console.error('Failed to register like:', err);
    }
  };

  const handleImportToFavorites = async (recipe) => {
    if (onSaveToPersonalFavorites) {
      await onSaveToPersonalFavorites(recipe);
    }
  };

  const handleCreateCommunityRecipe = async (e) => {
    e.preventDefault();
    if (!newRecipeData.recipeTitle.trim()) return;

    try {
      const ingredientsArray = newRecipeData.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);
      const stepsArray = newRecipeData.recipeSteps
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await publishCommunityRecipe({
        authorName: user?.name || 'Home Cook',
        authorTitle: user?.chefTitle || 'Pantry Explorer',
        recipeTitle: newRecipeData.recipeTitle,
        recipeDescription: newRecipeData.recipeDescription,
        ingredients: ingredientsArray,
        recipeSteps: stepsArray,
      });

      setIsShareModalOpen(false);
      setNewRecipeData({
        recipeTitle: '',
        recipeDescription: '',
        ingredients: '',
        recipeSteps: '',
      });
      fetchCommunityFeed();
      setPublishFeedback('Recipe successfully shared with the community!');
      setTimeout(() => setPublishFeedback(null), 4000);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  // Filter recipes by search query and tag
  const filtered = recipes.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.recipeTitle || '').toLowerCase().includes(term) ||
      (r.recipeDescription || '').toLowerCase().includes(term) ||
      (r.authorName || '').toLowerCase().includes(term) ||
      (r.ingredients || []).some((i) => i.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (selectedTag === 'All') return true;
    const fullText = `${r.recipeTitle} ${r.recipeDescription} ${(r.ingredients || []).join(' ')}`.toLowerCase();

    if (selectedTag === 'Quick (<20 min)') {
      return fullText.includes('quick') || fullText.includes('15') || fullText.includes('10') || fullText.includes('20');
    }
    if (selectedTag === 'Vegetarian') {
      return !/chicken|beef|meat|pork|bacon|fish|salmon|tuna|shrimp/.test(fullText);
    }
    if (selectedTag === 'High-Protein') {
      return /chicken|beef|egg|protein|bean|lentil|salmon|tofu/.test(fullText);
    }
    if (selectedTag === 'Pasta & Rice') {
      return /pasta|rice|noodle|spaghetti|risotto/.test(fullText);
    }
    if (selectedTag === 'Skillet & Stew') {
      return /skillet|stew|soup|simmer|sear|frittata/.test(fullText);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-butter" />
            <span>Community Recipes</span>
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Discover and share favorite pantry creations with other home cooks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="self-start sm:self-auto px-5 py-2.5 bg-tomato hover:bg-tomato-hover text-white rounded-btn font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Share a Recipe</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {publishFeedback && (
        <div className="p-3.5 rounded-btn bg-basil/15 border border-basil/30 text-basil font-medium text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{publishFeedback}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search community recipes by title, ingredients, or cook name..."
            className="w-full bg-paper text-ink placeholder-ink-muted/60 pl-11 pr-4 py-3 rounded-btn border border-paper-border focus:outline-none focus:border-tomato text-sm font-medium transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-tomato underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? 'bg-ink text-paper shadow-sm'
                  : 'bg-paper text-ink-muted hover:text-ink border border-paper-border'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-3 border-tomato border-t-transparent rounded-full mx-auto" />
          <p className="font-medium text-ink">Loading community recipes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-paper-card border border-dashed border-paper-border rounded-card p-10 text-center space-y-4">
          <ChefMascot mood="idle" size={90} className="mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-lg text-ink">
              {searchTerm ? `No community recipes matched "${searchTerm}"` : 'No community recipes yet'}
            </h3>
            <p className="text-sm text-ink-muted">
              {searchTerm
                ? 'Try a different search word or clear the filter to browse all recipes.'
                : 'Be the first home cook to share a delicious pantry creation!'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (searchTerm) setSearchTerm('');
              else setIsShareModalOpen(true);
            }}
            className="px-6 py-2.5 bg-tomato hover:bg-tomato-hover text-white font-semibold text-sm rounded-btn transition-colors cursor-pointer"
          >
            {searchTerm ? 'Clear search filter' : 'Share a recipe'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, index) => {
            const id = r._id || r.id;
            const photoUrl = getCuratedDishPhoto(r.recipeTitle, r.recipeDescription, r.ingredients);
            const likesCount = r.stampsCount || 1;
            const isLiked = !!likedIds[id];

            return (
              <motion.div
                key={id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-base overflow-hidden flex flex-col justify-between group hover:shadow-card-elevated"
              >
                {/* Recipe Photography Header */}
                <div className="relative h-44 w-full bg-paper-muted overflow-hidden">
                  <img
                    src={photoUrl}
                    alt={r.recipeTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

                  {/* Like Button on Image */}
                  <button
                    type="button"
                    onClick={() => handleLike(id)}
                    aria-label={`Like this recipe, current likes: ${likesCount}`}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-sm transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-tomato text-white'
                        : 'bg-paper/90 text-ink hover:bg-paper'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white text-white' : 'text-tomato'}`} />
                    <span>{likesCount}</span>
                  </button>

                  {/* Author Name on bottom of photo */}
                  <div className="absolute bottom-2.5 left-3 text-white">
                    <span className="text-xs font-bold block leading-none drop-shadow">
                      {r.authorName || 'Home Cook'}
                    </span>
                    <span className="text-[10px] text-white/80 drop-shadow">
                      {r.authorTitle || 'Pantry Cook'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold text-ink group-hover:text-tomato transition-colors line-clamp-1">
                      {r.recipeTitle}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                      {r.recipeDescription}
                    </p>

                    {/* Ingredients Used Chips with Emojis */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(r.ingredients || []).slice(0, 5).map((ing, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-paper text-ink border border-paper-border flex items-center gap-1"
                        >
                          <span>{getIngredientEmoji(ing)}</span>
                          <span>{ing}</span>
                        </span>
                      ))}
                      {(r.ingredients || []).length > 5 && (
                        <span className="text-[10px] text-ink-muted px-1.5 py-0.5">
                          +{(r.ingredients || []).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Action: Steps count & Save to My Recipes */}
                  <div className="pt-3 border-t border-paper-border flex items-center justify-between mt-3">
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-basil" />
                      <span>{(r.recipeSteps || []).length} steps</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleImportToFavorites(r)}
                      className="px-3 py-1.5 rounded-btn bg-paper hover:bg-tomato hover:text-white text-ink border border-paper-border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save recipe</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Share / Publish Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-paper-card border border-paper-border rounded-card p-6 sm:p-7 shadow-card-elevated relative max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-paper-border">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-tomato" />
                <h3 className="font-heading text-lg font-bold text-ink">
                  Share a Recipe with the Community
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-ink-muted hover:text-ink cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunityRecipe} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  required
                  value={newRecipeData.recipeTitle}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, recipeTitle: e.target.value })
                  }
                  placeholder="e.g. Grandma's 10-Minute Potato Frittata"
                  className="w-full bg-paper text-ink px-3.5 py-2.5 rounded-btn border border-paper-border text-sm focus:outline-none focus:border-tomato"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newRecipeData.recipeDescription}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, recipeDescription: e.target.value })
                  }
                  placeholder="Brief note on what makes this dish delicious or easy..."
                  className="w-full bg-paper text-ink px-3.5 py-2 rounded-btn border border-paper-border text-sm focus:outline-none focus:border-tomato resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  value={newRecipeData.ingredients}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, ingredients: e.target.value })
                  }
                  placeholder="Eggs, Potatoes, Onion, Olive Oil, Salt"
                  className="w-full bg-paper text-ink px-3.5 py-2.5 rounded-btn border border-paper-border text-sm focus:outline-none focus:border-tomato"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Preparation Steps (one step per line)
                </label>
                <textarea
                  rows={4}
                  value={newRecipeData.recipeSteps}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, recipeSteps: e.target.value })
                  }
                  placeholder="1. Slice potatoes into thin coins&#10;2. Brown onions in olive oil&#10;3. Pour whisked eggs over and cook until set"
                  className="w-full bg-paper text-ink px-3.5 py-2 rounded-btn border border-paper-border text-sm focus:outline-none focus:border-tomato resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRecipeData.recipeTitle.trim()}
                  className="px-5 py-2.5 bg-tomato hover:bg-tomato-hover disabled:opacity-40 text-white rounded-btn text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Publish Recipe
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
