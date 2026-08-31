import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Search, Trash2, ChefHat, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import RecipeStack from '../components/RecipeStack';
import { deleteFavorite } from '../api/client';

export default function Favorites({
  favorites,
  isLoading,
  onRefreshFavorites,
  onNavigateHome,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!id) return;
    setDeletingId(id);
    try {
      await deleteFavorite(id);
      if (onRefreshFavorites) {
        await onRefreshFavorites();
      }
    } catch (err) {
      console.error('Failed to remove recipe:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredFavorites = favorites.filter((fav) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = (fav.recipeTitle || fav.title || '').toLowerCase().includes(term);
    const descMatch = (fav.recipeDescription || fav.description || '').toLowerCase().includes(term);
    const ingMatch = (fav.ingredients || []).some((ing) =>
      ing.toLowerCase().includes(term)
    );
    return titleMatch || descMatch || ingMatch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Recipe Box Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#E3D7BE]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-handwritten text-xl text-tomato font-bold">
              Personal Collection
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-sage" />
            <span>The Recipe Box</span>
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mt-1">
            Stored in your personal session ledger. Return anytime to pull out your saved cards.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-[#FAF5E8] hover:bg-[#EFE4CF] text-charcoal rounded-xl border border-[#D5C4A2] text-sm font-medium transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-tomato" />
          <span>Cook New Recipes</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      {favorites.length > 0 && (
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved cards by recipe name or ingredient..."
            className="w-full bg-[#FAF5E8] text-charcoal placeholder-charcoal-muted/60 pl-11 pr-4 py-3 rounded-xl border-2 border-[#E3D7BE] focus:outline-none focus:border-sage font-medium text-sm transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-charcoal-muted hover:text-tomato underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Recipe Box Content */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="animate-spin w-8 h-8 border-3 border-tomato border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-serif text-charcoal font-medium">Opening recipe box lid...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-[#FAF5E8] border-2 border-dashed border-[#D9CBAC] rounded-2xl p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-mustard/20 text-mustard border border-mustard/40 flex items-center justify-center mx-auto">
            <BookMarked className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Your recipe box is waiting for its first card!
            </h3>
            <p className="text-sm text-charcoal-muted font-sans">
              Whenever you generate recipes in the Kitchen Notebook, hit the <strong>"Save to Ledger"</strong> ink stamp on any recipe you love.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNavigateHome}
            className="px-6 py-3 bg-tomato text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Start Cooking Now
          </motion.button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-[#FAF5E8] border border-[#E3D7BE] rounded-xl p-8 text-center text-charcoal-muted">
          <p className="font-sans text-sm">No saved recipes match "{searchTerm}".</p>
        </div>
      ) : (
        <RecipeStack
          recipes={filteredFavorites}
          favorites={favorites}
          onDeleteFavorite={handleDelete}
          isFavoriteView={true}
        />
      )}
    </div>
  );
}
