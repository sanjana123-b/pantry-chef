import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Search,
  Sparkles,
  Bookmark,
  Share2,
  Heart,
  ChefHat,
  Plus,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { getCommunityRecipes, stampCommunityRecipe, publishCommunityRecipe } from '../api/client';

export default function Community({
  onSaveToPersonalFavorites,
  user,
}) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stampingIds, setStampingIds] = useState({});
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
      setRecipes(data || []);
    } catch (err) {
      console.error('Error fetching community recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityFeed();
  }, []);

  const handleUpvoteStamp = async (id) => {
    setStampingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await stampCommunityRecipe(id);
      setRecipes((prev) =>
        prev.map((r) => ((r._id || r.id) === id ? { ...r, stampsCount: (r.stampsCount || 0) + 1 } : r))
      );
    } catch (err) {
      console.error('Failed to stamp community recipe:', err);
    } finally {
      setStampingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleImportToFavorites = async (recipe) => {
    if (onSaveToPersonalFavorites) {
      await onSaveToPersonalFavorites(recipe);
    }
  };

  const handleCreateCommunityRecipe = async (e) => {
    e.preventDefault();
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
        authorName: user?.name || 'Home Chef',
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
      setPublishFeedback('Recipe successfully published to the Community Ledger!');
      setTimeout(() => setPublishFeedback(null), 4000);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const filtered = recipes.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      (r.recipeTitle || '').toLowerCase().includes(term) ||
      (r.recipeDescription || '').toLowerCase().includes(term) ||
      (r.authorName || '').toLowerCase().includes(term) ||
      (r.ingredients || []).some((i) => i.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#E3D7BE]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mustard/20 border border-mustard/40 text-charcoal text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-mustard" /> Public Recipe Exchange
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            The Community Ledger
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mt-1">
            Discover and stamp crowd-favorite pantry dishes shared by fellow home cooks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="self-start sm:self-auto px-5 py-3 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-serif font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 border border-[#A83E1E]"
        >
          <Plus className="w-4 h-4" />
          <span>Publish a Recipe Card</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {publishFeedback && (
        <div className="p-3.5 rounded-xl bg-sage/20 border border-sage/40 text-sage-hover font-medium text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{publishFeedback}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search community recipes by title, ingredients, or chef author..."
          className="w-full bg-[#FAF5E8] text-charcoal placeholder-charcoal-muted/60 pl-11 pr-4 py-3 rounded-xl border-2 border-[#E3D7BE] focus:outline-none focus:border-sage font-medium text-sm transition-all"
        />
      </div>

      {/* Feed Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="animate-spin w-8 h-8 border-3 border-tomato border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-serif text-charcoal font-medium">Opening community recipe ledger...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#FAF5E8] border-2 border-dashed border-[#D9CBAC] rounded-2xl p-10 text-center space-y-3">
          <ChefHat className="w-10 h-10 text-charcoal-muted mx-auto" />
          <h3 className="font-serif font-bold text-lg text-charcoal">
            No community recipes matched "{searchTerm}"
          </h3>
          <p className="text-xs text-charcoal-muted font-sans">
            Be the first to publish a pantry hack recipe to the community exchange!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, index) => {
            const id = r._id || r.id;
            const isStamping = !!stampingIds[id];
            return (
              <motion.div
                key={id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="index-card rounded-2xl p-6 bg-[#FAF7EE] border border-[#E4D7BF] shadow-card-soft flex flex-col justify-between space-y-4 relative group"
              >
                {/* Red Top Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-tomato/50 rounded-t-2xl" />

                <div className="space-y-3">
                  {/* Author Badge */}
                  <div className="flex items-center justify-between border-b border-[#EFE5D1] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-tomato/15 text-tomato flex items-center justify-center font-serif text-xs font-bold">
                        {r.authorName?.[0] || 'C'}
                      </div>
                      <div>
                        <span className="font-serif font-bold text-xs text-charcoal block leading-none">
                          {r.authorName || 'Home Cook'}
                        </span>
                        <span className="text-[10px] font-mono text-charcoal-muted">
                          {r.authorTitle || 'Pantry Cook'}
                        </span>
                      </div>
                    </div>

                    {/* Community Upvote Stamp Badge */}
                    <button
                      type="button"
                      onClick={() => handleUpvoteStamp(id)}
                      disabled={isStamping}
                      className="flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-tomato/10 text-tomato hover:bg-tomato/20 border border-tomato/30 transition-colors"
                      title="Stamp this community recipe"
                    >
                      <Flame className="w-3.5 h-3.5 text-mustard" />
                      <span>{r.stampsCount || 1} Stamps</span>
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-tomato transition-colors">
                    {r.recipeTitle}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-charcoal/80 font-sans leading-relaxed">
                    {r.recipeDescription}
                  </p>

                  {/* Ingredients */}
                  <div className="flex flex-wrap gap-1">
                    {(r.ingredients || []).map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4ECDB] text-charcoal-muted border border-[#E2D4BD]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Import CTA Button */}
                <div className="pt-3 border-t border-[#EFE5D1] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-sage-hover font-semibold">
                    {(r.recipeSteps || []).length} Cooking Steps
                  </span>

                  <button
                    type="button"
                    onClick={() => handleImportToFavorites(r)}
                    className="px-3 py-1.5 rounded-xl bg-tomato hover:bg-tomato-hover text-white text-xs font-serif font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Stamp to My Box</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Publish Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-3xl p-6 sm:p-7 shadow-card-elevated relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4D7BF]">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-tomato" />
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  Publish to Community Ledger
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-muted hover:text-tomato"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCommunityRecipe} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                  Recipe Title:
                </label>
                <input
                  type="text"
                  required
                  value={newRecipeData.recipeTitle}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, recipeTitle: e.target.value })
                  }
                  placeholder="e.g. Crispy Garlic Butter Rice Bowl"
                  className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-sm focus:outline-none focus:border-tomato font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                  Appetizing Description:
                </label>
                <textarea
                  rows={2}
                  required
                  value={newRecipeData.recipeDescription}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, recipeDescription: e.target.value })
                  }
                  placeholder="One sentence describing the dish and pantry staples utilized..."
                  className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-xs sm:text-sm focus:outline-none focus:border-tomato font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                  Key Ingredients (comma-separated):
                </label>
                <input
                  type="text"
                  required
                  value={newRecipeData.ingredients}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, ingredients: e.target.value })
                  }
                  placeholder="e.g. Rice, Garlic, Butter, Spinach, Eggs"
                  className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-xs sm:text-sm focus:outline-none focus:border-tomato font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                  Preparation Steps (one per line):
                </label>
                <textarea
                  rows={4}
                  required
                  value={newRecipeData.recipeSteps}
                  onChange={(e) =>
                    setNewRecipeData({ ...newRecipeData, recipeSteps: e.target.value })
                  }
                  placeholder="Melt butter with garlic in a wide pan&#10;Add cooked rice and press flat for crispness&#10;Toss in spinach and season with soy sauce"
                  className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-xs sm:text-sm focus:outline-none focus:border-tomato font-mono"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-tomato hover:bg-tomato-hover text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all mt-2"
              >
                Publish to Public Exchange
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
