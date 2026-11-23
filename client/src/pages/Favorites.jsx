import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Search, Trash2, ChefHat, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import RecipeStack from '../components/RecipeStack';
import ChefMascot from '../components/ChefMascot';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-basil" />
            <span>My Recipes</span>
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Your personal collection of saved recipes.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-paper hover:bg-paper-muted text-ink rounded-btn border border-paper-border text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-tomato" />
          <span>Find More Recipes</span>
        </button>
      </div>

      {/* Search Bar */}
      {favorites.length > 0 && (
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved recipes by title or ingredient..."
            className="w-full bg-paper-card text-ink placeholder-ink-muted/60 pl-11 pr-4 py-3 rounded-btn border border-paper-border focus:outline-none focus:border-basil font-medium text-sm transition-all shadow-sm"
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
      )}

      {/* Content */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="animate-spin w-8 h-8 border-3 border-tomato border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-medium text-ink">Loading your saved recipes...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-paper-card border border-dashed border-paper-border rounded-card p-10 text-center space-y-4">
          <ChefMascot mood="idle" size={90} className="mx-auto" />
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading text-xl font-bold text-ink">
              Your recipe collection is waiting for its first dish!
            </h3>
            <p className="text-sm text-ink-muted">
              Whenever you generate recipes in the Pantry, click <strong>"Save recipe"</strong> to save them here for easy access.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNavigateHome}
            className="px-6 py-3 bg-tomato hover:bg-tomato-hover text-white font-semibold text-sm rounded-btn shadow-card-soft transition-all cursor-pointer"
          >
            Find recipes now
          </motion.button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-paper-card border border-paper-border rounded-card p-8 text-center text-ink-muted">
          <p className="text-sm">No saved recipes match "{searchTerm}".</p>
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
