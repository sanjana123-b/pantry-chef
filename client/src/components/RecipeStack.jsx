import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, LayoutGrid, Sparkles } from 'lucide-react';
import RecipeCard from './RecipeCard';

/**
 * Skeleton card component for loading states
 */
function RecipeCardSkeleton() {
  return (
    <div className="card-base p-6 md:p-7 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-paper-border/60 rounded-full" />
        <div className="h-8 w-28 bg-paper-border/60 rounded-btn" />
      </div>
      <div className="space-y-2">
        <div className="h-7 w-2/3 bg-paper-border/70 rounded-md" />
        <div className="h-4 w-full bg-paper-border/50 rounded" />
        <div className="h-4 w-4/5 bg-paper-border/50 rounded" />
      </div>
      <div className="h-10 w-full bg-paper-border/40 rounded-btn" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-paper-border/50 rounded-full" />
        <div className="h-6 w-16 bg-paper-border/50 rounded-full" />
        <div className="h-6 w-24 bg-paper-border/50 rounded-full" />
      </div>
    </div>
  );
}

export default function RecipeStack({
  recipes = [],
  favorites = [],
  savingId = null,
  isLoading = false,
  onSaveRecipe,
  onDeleteFavorite,
  isFavoriteView = false,
  allergenProfile = { allergens: [], diets: [] },
  onOpenGroceryGap,
  onPublishCommunity,
  pantryIngredients = [],
  onStartTimer,
}) {
  const [viewMode, setViewMode] = useState('stack');

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="w-full space-y-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-44 bg-paper-border/60 rounded-md animate-pulse" />
        </div>
        <div className="space-y-6">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return null;
  }

  const rotations = [-1.2, 1.4, -0.8, 1.2, -1.0, 0.8];

  const checkIfSaved = (recipe) => {
    const title = recipe.title || recipe.recipeTitle;
    return favorites.some(
      (fav) => (fav.recipeTitle || fav.title)?.toLowerCase() === title?.toLowerCase()
    );
  };

  return (
    <div className="w-full">
      {/* Controls & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-paper-border">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink flex items-center gap-2">
            <span>{isFavoriteView ? 'My Recipes' : 'Suggested Recipes'}</span>
            <span className="text-xs font-semibold bg-tomato/15 text-tomato px-2.5 py-0.5 rounded-full border border-tomato/30">
              {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'}
            </span>
          </h2>
          <p className="text-xs md:text-sm text-ink-muted mt-0.5">
            {isFavoriteView
              ? 'Your saved collection of dishes ready to cook'
              : 'Recipes crafted to make the most of your pantry ingredients'}
          </p>
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center bg-paper p-1 rounded-btn border border-paper-border">
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'stack'
                ? 'bg-paper-card text-ink shadow-sm border border-paper-border'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Single Column Stack"
          >
            <Layers className="w-3.5 h-3.5 text-tomato" />
            <span className="hidden sm:inline">Stack</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-paper-card text-ink shadow-sm border border-paper-border'
                : 'text-ink-muted hover:text-ink'
            }`}
            title="Side-by-side Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-basil" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* Recipe Cards List / Grid */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
            : 'space-y-6 md:space-y-7'
        }
      >
        {recipes.map((recipe, index) => {
          const rotationAngle = viewMode === 'stack' ? rotations[index % rotations.length] : 0;
          const isSaved = checkIfSaved(recipe);
          const isSaving = savingId === (recipe.title || recipe._id);

          return (
            <RecipeCard
              key={recipe._id || recipe.title || index}
              recipe={recipe}
              index={index}
              rotation={rotationAngle}
              isSaved={isSaved}
              isSaving={isSaving}
              onToggleSave={() => onSaveRecipe && onSaveRecipe(recipe)}
              onDelete={onDeleteFavorite}
              isFavoriteView={isFavoriteView}
              allergenProfile={allergenProfile}
              onOpenGroceryGap={onOpenGroceryGap}
              onPublishCommunity={onPublishCommunity}
              pantryIngredients={pantryIngredients}
              onStartTimer={onStartTimer}
            />
          );
        })}
      </div>
    </div>
  );
}
