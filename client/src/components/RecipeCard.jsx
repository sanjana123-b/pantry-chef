import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Clock,
  Utensils,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Trash2,
  Tag,
  Users,
  Share2,
  ShoppingCart,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import SaveStamp from './SaveStamp';
import { checkRecipeAllergens } from './AllergenSettingsModal';

export default function RecipeCard({
  recipe,
  index = 0,
  rotation = 0,
  isSaved = false,
  isSaving = false,
  onToggleSave,
  onDelete,
  isFavoriteView = false,
  allergenProfile = { allergens: [], diets: [] },
  onOpenGroceryGap,
  onPublishCommunity,
  pantryIngredients = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [servings, setServings] = useState(2);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedNotice, setPublishedNotice] = useState(false);

  const toggleStep = (stepIdx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx],
    }));
  };

  const steps = recipe.steps || recipe.recipeSteps || [];
  const title = recipe.title || recipe.recipeTitle || 'Untitled Recipe';
  const description = recipe.description || recipe.recipeDescription || '';
  const ingredients = recipe.ingredients || [];

  // Allergen safety audit
  const { isSafe, violations } = checkRecipeAllergens(recipe, allergenProfile);

  const handleShareToCommunity = async () => {
    if (isPublishing || !onPublishCommunity) return;
    setIsPublishing(true);
    try {
      await onPublishCommunity(recipe);
      setPublishedNotice(true);
      setTimeout(() => setPublishedNotice(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  const multiplier = servings / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      whileHover={{
        rotate: 0,
        y: -6,
        scale: 1.01,
        zIndex: 20,
      }}
      className="index-card rounded-xl p-6 md:p-7 relative bg-[#FBF7EE] border border-[#E4D7BF] shadow-card-soft transition-all duration-300 group"
    >
      {/* Top Red Margin Line (like an authentic index card) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C1502E]/60 rounded-t-xl" />

      {/* Card Index Header */}
      <div className="flex items-start justify-between gap-4 mb-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-charcoal-muted uppercase tracking-wider bg-[#F3EAD8] px-2 py-0.5 rounded border border-[#DECFA4]">
            CARD #{String(index + 1).padStart(2, '0')}
          </span>

          {/* Allergen Safety Badge */}
          {(allergenProfile.allergens?.length > 0 || allergenProfile.diets?.length > 0) && (
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                isSafe
                  ? 'bg-sage/15 text-sage-hover border-sage/30'
                  : 'bg-tomato/15 text-tomato border-tomato/30 animate-pulse'
              }`}
            >
              {isSafe ? (
                <>
                  <ShieldCheck className="w-3 h-3" />
                  <span>Profile Safe</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3 h-3" />
                  <span>{violations.join(', ')}</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Action button: Save Stamp or Delete */}
        <div className="flex items-center gap-2">
          {isFavoriteView ? (
            <button
              type="button"
              onClick={() => onDelete && onDelete(recipe._id || recipe.id)}
              className="p-2 rounded-lg text-charcoal-muted hover:text-tomato hover:bg-tomato/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Remove from Recipe Box"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          ) : (
            <SaveStamp
              isSaved={isSaved}
              isSaving={isSaving}
              onToggleSave={onToggleSave}
            />
          )}
        </div>
      </div>

      {/* Recipe Title with hand-stamped underline */}
      <div className="mb-2">
        <h3 className="font-serif text-xl md:text-2xl font-bold text-charcoal tracking-tight group-hover:text-tomato transition-colors">
          <span className="hand-stamped-underline pb-1">{title}</span>
        </h3>
      </div>

      {/* Description */}
      <p className="text-charcoal/85 text-sm md:text-base leading-relaxed font-sans mb-3">
        {description}
      </p>

      {/* Serving Scaler & Toolbar Utilities Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 bg-[#F4EDE0] rounded-xl border border-[#E3D7BE] mb-4">
        {/* Serving Stepper */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-charcoal flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-tomato" /> Headcount:
          </span>
          <div className="flex items-center bg-[#FAF6EE] rounded-lg border border-[#D5C6A6] px-1 py-0.5">
            <button
              type="button"
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="px-2 py-0.5 text-xs font-mono font-bold text-charcoal hover:text-tomato"
              title="Decrease servings"
            >
              -
            </button>
            <span className="px-2 text-xs font-mono font-bold text-tomato">
              {servings} {servings === 1 ? 'serving' : 'servings'}
            </span>
            <button
              type="button"
              onClick={() => setServings((s) => Math.min(12, s + 1))}
              className="px-2 py-0.5 text-xs font-mono font-bold text-charcoal hover:text-tomato"
              title="Increase servings"
            >
              +
            </button>
          </div>
          {servings !== 2 && (
            <span className="text-[10px] font-mono text-sage-hover font-semibold">
              ({multiplier}x scale)
            </span>
          )}
        </div>

        {/* Shopping Gap & Community Share buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenGroceryGap && onOpenGroceryGap(recipe)}
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-[#FAF5E8] hover:bg-tomato/15 hover:text-tomato text-charcoal border border-[#D5C6A6] transition-colors"
            title="Export missing items or print"
          >
            <ShoppingCart className="w-3 h-3 text-tomato" />
            <span>Shopping Gap</span>
          </button>

          <button
            type="button"
            onClick={handleShareToCommunity}
            disabled={isPublishing || publishedNotice}
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-[#FAF5E8] hover:bg-sage/20 hover:text-sage-hover text-charcoal border border-[#D5C6A6] transition-colors"
            title="Share to Public Community Ledger"
          >
            <Share2 className="w-3 h-3 text-sage" />
            <span>{publishedNotice ? '✓ Shared!' : 'Share Public'}</span>
          </button>
        </div>
      </div>

      {/* Pantry Ingredients Used Tag Chips */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center mb-4 py-2 border-y border-[#EFE5D1]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-muted flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-sage" /> Key Staples ({servings} servings):
          </span>
          {ingredients.map((ing, i) => (
            <span
              key={i}
              className="text-xs font-mono px-2 py-0.5 rounded bg-[#F4ECDB] text-charcoal-muted border border-[#E2D4BD]"
            >
              {ing}
            </span>
          ))}
        </div>
      )}

      {/* Cooking Steps Section */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2 px-3 bg-[#F5EDDD] hover:bg-[#EFE5D1] rounded-lg border border-[#E3D6BC] transition-colors text-charcoal font-serif font-semibold text-sm"
        >
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-tomato" />
            <span>
              {isExpanded
                ? 'Hide Preparation Steps'
                : `View Preparation Steps (${steps.length} steps)`}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-charcoal-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-charcoal-muted" />
          )}
        </button>

        {/* Collapsible Steps list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2.5 pl-1 pr-1 bg-lined-ledger py-2 rounded-lg">
                {steps.map((step, sIdx) => {
                  const isDone = completedSteps[sIdx];
                  return (
                    <div
                      key={sIdx}
                      onClick={() => toggleStep(sIdx)}
                      className={`cursor-pointer flex items-start gap-3 p-2.5 rounded-lg transition-all border ${
                        isDone
                          ? 'bg-sage/10 border-sage/30 text-charcoal-muted line-through opacity-75'
                          : 'bg-[#FAF6EE] border-[#E8DFC9] hover:border-tomato/30 text-charcoal'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 flex-shrink-0 text-charcoal-muted hover:text-sage transition-colors"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isDone ? 'text-sage fill-sage/20' : 'text-[#C9B99E]'
                          }`}
                        />
                      </button>
                      <div className="flex-1 text-sm font-sans leading-relaxed">
                        <span className="font-mono font-bold text-xs text-charcoal-muted mr-1.5 uppercase">
                          Step {sIdx + 1}:
                        </span>
                        <span>{step}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Index Card Corner Stamp Motif */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-charcoal-muted font-mono border-t border-[#EFE5D1]">
        <span className="flex items-center gap-1">
          <ChefHat className="w-3.5 h-3.5 text-tomato" /> PantryChef AI Kitchen
        </span>
        <span className="font-handwritten text-sm text-mustard font-bold">
          Cook with what you have
        </span>
      </div>
    </motion.div>
  );
}
