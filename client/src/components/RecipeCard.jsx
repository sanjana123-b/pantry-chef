import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Play,
  AlertCircle,
} from 'lucide-react';
import SaveStamp from './SaveStamp';
import CookModeModal from './CookModeModal';
import { checkRecipeAllergens } from './AllergenSettingsModal';
import { getIngredientEmoji } from '../utils/foodImageHelper';

/**
 * Rescale ingredient quantities according to serving multiplier
 */
function rescaleIngredient(text, factor) {
  if (factor === 1 || !text) return text;
  return text.replace(/\b(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\b/g, (match) => {
    if (match.includes('/')) {
      const parts = match.trim().split(/\s+/);
      let num = 0;
      if (parts.length === 2) {
        num += parseFloat(parts[0]);
        const [n, d] = parts[1].split('/').map(Number);
        num += n / d;
      } else {
        const [n, d] = match.split('/').map(Number);
        num = n / d;
      }
      const scaled = num * factor;
      return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1).replace(/\.0$/, '');
    }
    const val = parseFloat(match);
    if (isNaN(val)) return match;
    const scaled = val * factor;
    return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1).replace(/\.0$/, '');
  });
}

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
  onStartTimer,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [servings, setServings] = useState(2);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedNotice, setPublishedNotice] = useState(false);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);

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

  // Ingredient match meter against pantry
  const pantryLower = pantryIngredients.map((p) =>
    (typeof p === 'string' ? p : p.name).toLowerCase()
  );

  const ingredientStatuses = ingredients.map((ing) => {
    const ingLower = ing.toLowerCase();
    const hasIt = pantryLower.some(
      (p) => ingLower.includes(p) || p.includes(ingLower)
    );
    return {
      name: ing,
      hasIt,
    };
  });

  const matchedCount = ingredientStatuses.filter((s) => s.hasIt).length;
  const totalCount = Math.max(1, ingredientStatuses.length);
  const matchPercentage = Math.round((matchedCount / totalCount) * 100);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.06 }}
        style={{ transform: `rotate(${rotation}deg)` }}
        whileHover={{ rotate: 0, y: -4, transition: { duration: 0.2 } }}
        className="card-base p-6 md:p-7 relative transition-all duration-300 group space-y-4"
      >
        {/* Card Header: Card Number & Safety Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted bg-paper-muted px-2.5 py-0.5 rounded-full border border-paper-border">
              Recipe {index + 1}
            </span>

            {/* Allergen Badge */}
            {(allergenProfile.allergens?.length > 0 || allergenProfile.diets?.length > 0) && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                  isSafe
                    ? 'bg-basil/15 text-basil border-basil/30'
                    : 'bg-tomato/15 text-tomato border-tomato/30 animate-pulse'
                }`}
              >
                {isSafe ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Safe for your diet</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Contains: {violations.join(', ')}</span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isFavoriteView ? (
              <button
                type="button"
                onClick={() => onDelete && onDelete(recipe._id || recipe.id)}
                className="p-2 rounded-btn text-ink-muted hover:text-tomato hover:bg-tomato/10 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Remove from My Recipes"
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

        {/* Recipe Title & Description */}
        <div>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-ink tracking-tight group-hover:text-tomato transition-colors">
            {title}
          </h3>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed mt-1">
            {description}
          </p>
        </div>

        {/* Ingredient Match Meter */}
        {pantryIngredients.length > 0 && (
          <div className="p-3 bg-paper rounded-btn border border-paper-border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink flex items-center gap-1.5">
                <span>Ingredient Match:</span>
                <strong className={matchPercentage >= 70 ? 'text-basil' : 'text-butter-hover'}>
                  {matchedCount} of {totalCount} ingredients ({matchPercentage}%)
                </strong>
              </span>
              {matchedCount < totalCount && (
                <button
                  type="button"
                  onClick={() => onOpenGroceryGap && onOpenGroceryGap(recipe)}
                  className="text-tomato hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>View missing</span>
                </button>
              )}
            </div>

            <div className="w-full h-2 bg-paper-border/60 rounded-full overflow-hidden">
              <div
                style={{ width: `${matchPercentage}%` }}
                className={`h-full rounded-full transition-all ${
                  matchPercentage >= 70 ? 'bg-basil' : 'bg-butter'
                }`}
              />
            </div>
          </div>
        )}

        {/* Servings Scaler & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-3.5 bg-paper rounded-btn border border-paper-border">
          {/* Servings Stepper */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-tomato" /> Servings:
            </span>
            <div className="flex items-center bg-paper-card rounded-btn border border-paper-border px-1 py-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="px-2 py-0.5 text-xs font-bold text-ink hover:text-tomato cursor-pointer"
                title="Decrease servings"
              >
                −
              </button>
              <span className="px-2 text-xs font-bold text-tomato">
                {servings} {servings === 1 ? 'serving' : 'servings'}
              </span>
              <button
                type="button"
                onClick={() => setServings((s) => Math.min(12, s + 1))}
                className="px-2 py-0.5 text-xs font-bold text-ink hover:text-tomato cursor-pointer"
                title="Increase servings"
              >
                +
              </button>
            </div>
            {servings !== 2 && (
              <span className="text-xs text-basil font-semibold">
                ({multiplier}x scale)
              </span>
            )}
          </div>

          {/* Cook Mode & Community Share */}
          <div className="flex items-center gap-2">
            {/* Start Cook Mode Button */}
            <button
              type="button"
              onClick={() => setIsCookModeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-tomato hover:bg-tomato-hover text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Cook Mode</span>
            </button>

            <button
              type="button"
              onClick={handleShareToCommunity}
              disabled={isPublishing || publishedNotice}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-btn bg-paper-card hover:bg-paper-muted text-ink border border-paper-border transition-colors cursor-pointer"
              title="Share to Community"
            >
              <Share2 className="w-3 h-3 text-basil" />
              <span>{publishedNotice ? '✓ Shared!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Scaled Ingredients Chips with Missing Item Highlights */}
        {ingredients.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-ink-muted block">
              Ingredients ({servings} servings):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ingredientStatuses.map((st, i) => {
                const scaledText = rescaleIngredient(st.name, multiplier);
                return (
                  <span
                    key={i}
                    onClick={() => !st.hasIt && onOpenGroceryGap && onOpenGroceryGap(recipe)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                      st.hasIt
                        ? 'bg-paper text-ink border-paper-border'
                        : 'bg-tomato/10 text-tomato border-tomato/30 hover:bg-tomato/20 cursor-pointer font-medium'
                    }`}
                    title={st.hasIt ? 'In your pantry' : 'Missing from pantry — click to view shopping list'}
                  >
                    <span>{getIngredientEmoji(st.name)}</span>
                    <span>{scaledText}</span>
                    {!st.hasIt && <span className="text-[10px] text-tomato font-bold">(missing)</span>}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Expandable Step-by-Step Preparation */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-2 px-3.5 bg-paper hover:bg-paper-muted rounded-btn border border-paper-border transition-colors text-ink font-semibold text-xs sm:text-sm cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-tomato" />
              <span>
                {isExpanded
                  ? 'Hide cooking steps'
                  : `View cooking steps (${steps.length} steps)`}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-ink-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {steps.map((step, sIdx) => {
                    const isDone = completedSteps[sIdx];
                    return (
                      <div
                        key={sIdx}
                        onClick={() => toggleStep(sIdx)}
                        className={`cursor-pointer flex items-start gap-3 p-3 rounded-btn transition-all border ${
                          isDone
                            ? 'bg-basil/10 border-basil/30 text-ink-muted line-through opacity-75'
                            : 'bg-paper border-paper-border hover:border-tomato/30 text-ink'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 flex-shrink-0 text-ink-muted hover:text-basil transition-colors"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isDone ? 'text-basil fill-basil/20' : 'text-paper-border'
                            }`}
                          />
                        </button>
                        <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                          <strong className="mr-1.5 text-ink">
                            Step {sIdx + 1}:
                          </strong>
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
      </motion.div>

      {/* Full-Screen Cook Mode Modal */}
      <CookModeModal
        isOpen={isCookModeOpen}
        onClose={() => setIsCookModeOpen(false)}
        recipe={{
          ...recipe,
          title,
          steps,
        }}
        onStartTimer={onStartTimer}
      />
    </>
  );
}
