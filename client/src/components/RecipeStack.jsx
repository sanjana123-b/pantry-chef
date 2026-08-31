import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, LayoutGrid, Sparkles } from 'lucide-react';
import RecipeCard from './RecipeCard';

export default function RecipeStack({
  recipes,
  favorites = [],
  savingId = null,
  onSaveRecipe,
  onDeleteFavorite,
  isFavoriteView = false,
  allergenProfile = { allergens: [], diets: [] },
  onOpenGroceryGap,
  onPublishCommunity,
  pantryIngredients = [],
}) {
  const [viewMode, setViewMode] = useState('stack'); // 'stack' or 'grid'

  if (!recipes || recipes.length === 0) {
    return null;
  }

  // Alternating slight rotations for the tactile stacked index card feel
  const rotations = [-1.5, 1.8, -1.2, 1.4, -1.6, 1.2];

  const checkIfSaved = (recipe) => {
    const title = recipe.title || recipe.recipeTitle;
    return favorites.some(
      (fav) => (fav.recipeTitle || fav.title)?.toLowerCase() === title?.toLowerCase()
    );
  };

  return (
    <div className="w-full">
      {/* Stack Controls & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-[#E4D7BF]">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal flex items-center gap-2">
            <span>{isFavoriteView ? 'Saved Recipe Ledger' : 'Freshly Inked Recipes'}</span>
            <span className="font-sans text-xs font-bold uppercase bg-tomato/15 text-tomato px-2.5 py-1 rounded-full border border-tomato/30">
              {recipes.length} {recipes.length === 1 ? 'Card' : 'Cards'}
            </span>
          </h2>
          <p className="text-xs md:text-sm text-charcoal-muted font-sans mt-0.5">
            {isFavoriteView
              ? 'Flip through the recipes stamped into your private box'
              : 'Hand-crafted AI recipe suggestions utilizing your pantry items'}
          </p>
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center bg-[#F3EBDD] p-1 rounded-xl border border-[#DECFA4]">
          <button
            type="button"
            onClick={() => setViewMode('stack')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              viewMode === 'stack'
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm border border-[#D9CBAC]'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
            title="Fanned Index Card Stack"
          >
            <Layers className="w-3.5 h-3.5 text-tomato" />
            <span className="hidden sm:inline">Fanned Stack</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              viewMode === 'grid'
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm border border-[#D9CBAC]'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
            title="Side-by-side Recipe Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-sage" />
            <span className="hidden sm:inline">Grid Spread</span>
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
            />
          );
        })}
      </div>
    </div>
  );
}
