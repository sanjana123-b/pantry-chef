import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, AlertCircle, RefreshCw, Camera, ShieldCheck } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';
import KitchenToolbar from '../components/KitchenToolbar';
import WasteTrackerBanner from '../components/WasteTrackerBanner';
import RecipeStack from '../components/RecipeStack';
import LoadingSimmer from '../components/LoadingSimmer';
import { generateRecipes, saveFavorite } from '../api/client';

export default function Home({
  favorites,
  onRefreshFavorites,
  onOpenTimer,
  onOpenConverter,
  onToggleChat,
  onOpenScanner,
  onOpenAllergens,
  onOpenGroceryGap,
  onPublishCommunity,
  allergenProfile,
  isChatOpen,
}) {
  const [ingredients, setIngredients] = useState([
    'Eggs',
    'Garlic',
    'Tomatoes',
    'Olive Oil',
    'Spinach',
  ]);
  const [expiringItems, setExpiringItems] = useState(['Spinach', 'Tomatoes']);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('Any Style');

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  const handleAddIngredient = (item) => {
    setIngredients((prev) => [...prev, item]);
    setError(null);
  };

  const handleAddBatchIngredients = (items) => {
    setIngredients((prev) => {
      const combined = [...prev];
      items.forEach((item) => {
        if (!combined.some((i) => i.toLowerCase() === item.toLowerCase())) {
          combined.push(item);
        }
      });
      return combined;
    });
    setError(null);
  };

  const handleRemoveIngredient = (item) => {
    setIngredients((prev) => prev.filter((i) => i !== item));
    setExpiringItems((prev) => prev.filter((i) => i !== item));
  };

  const handleToggleExpiry = (item) => {
    setExpiringItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleClearAll = () => {
    setIngredients([]);
    setExpiringItems([]);
    setRecipes([]);
    setError(null);
  };

  const handleToggleDietary = (tag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async (forcedIngredients = null) => {
    const listToCook = forcedIngredients || ingredients;

    if (listToCook.length === 0) {
      setError('Please log at least one pantry ingredient in your jars before cooking.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generated = await generateRecipes(listToCook, {
        dietary: selectedDietary,
        cuisine: selectedCuisine,
      });
      setRecipes(generated);
      setTimeout(() => {
        const resultsEl = document.getElementById('recipe-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Failed to generate recipes:', err);
      setError(err.message || 'The kitchen stove fizzled out. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrioritizeExpiring = () => {
    if (expiringItems.length === 0) return;
    handleGenerate(expiringItems);
  };

  const handleSaveRecipe = async (recipe) => {
    const title = recipe.title || recipe.recipeTitle;
    setSavingId(title);

    try {
      const res = await saveFavorite({
        ingredients,
        recipeTitle: title,
        recipeDescription: recipe.description || recipe.recipeDescription || '',
        recipeSteps: recipe.steps || recipe.recipeSteps || [],
      });

      if (onRefreshFavorites) {
        await onRefreshFavorites();
      }

      setFeedbackNotice({
        type: 'success',
        message: res.alreadySaved
          ? `"${title}" is already in your Recipe Box!`
          : `Stamped "${title}" into your private Recipe Box!`,
      });

      setTimeout(() => setFeedbackNotice(null), 4000);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setFeedbackNotice({
        type: 'error',
        message: 'Could not stamp recipe to favorites. Please check connection.',
      });
      setTimeout(() => setFeedbackNotice(null), 4000);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Waste Tracker Freshness Alert Banner */}
      <section>
        <WasteTrackerBanner
          expiringItems={expiringItems}
          onPrioritizeExpiring={handlePrioritizeExpiring}
        />
      </section>

      {/* Hero Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/15 border border-sage/30 text-sage-hover text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-sage" /> Kitchen Notebook & Inventory
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
          What’s in your cupboards tonight?
        </h1>
        <p className="max-w-2xl mx-auto text-charcoal-muted text-sm sm:text-base leading-relaxed font-sans">
          Log whatever ingredients you have on hand, scan grocery receipts or crisper drawers, and let our AI ledger ink custom recipes.
        </p>
      </section>

      {/* Main Ingredient Shelf Input */}
      <section>
        <IngredientInput
          ingredients={ingredients}
          expiringItems={expiringItems}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onToggleExpiry={handleToggleExpiry}
          onClearAll={handleClearAll}
          onOpenScanner={onOpenScanner}
        />
      </section>

      {/* Kitchen Station Toolbar */}
      <section>
        <KitchenToolbar
          selectedDietary={selectedDietary}
          onToggleDietary={handleToggleDietary}
          selectedCuisine={selectedCuisine}
          onSelectCuisine={setSelectedCuisine}
          onOpenTimer={onOpenTimer}
          onOpenConverter={onOpenConverter}
          onToggleChat={onToggleChat}
          isChatOpen={isChatOpen}
        />
      </section>

      {/* Generate Action Button */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={() => handleGenerate()}
          disabled={isLoading || ingredients.length === 0}
          className="relative px-8 py-4 bg-tomato hover:bg-tomato-hover disabled:opacity-40 disabled:hover:bg-tomato text-white font-serif font-bold text-lg md:text-xl rounded-2xl shadow-card-elevated transition-all flex items-center gap-3 border-2 border-[#A83E1E] group"
        >
          <Flame className="w-6 h-6 group-hover:animate-bounce text-mustard" />
          <span>What can I cook with this?</span>
        </motion.button>
        <span className="text-xs font-mono text-charcoal-muted">
          Generates 2–3 bespoke recipes tailored to your ingredients and preferences
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-tomato/10 border border-tomato/30 text-tomato flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-sm">Recipe Generation Notice</h4>
            <p className="text-xs md:text-sm font-sans mt-0.5 text-charcoal/90">{error}</p>
          </div>
        </div>
      )}

      {/* Stamp Feedback Toast Notification */}
      {feedbackNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-3.5 rounded-xl border text-sm font-medium flex items-center justify-between gap-3 shadow-md ${
            feedbackNotice.type === 'success'
              ? 'bg-sage/15 border-sage/40 text-sage-hover'
              : 'bg-tomato/15 border-tomato/40 text-tomato'
          }`}
        >
          <span>{feedbackNotice.message}</span>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-xs opacity-70 hover:opacity-100 font-mono underline"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Loading Simmer State */}
      {isLoading && (
        <div className="bg-[#FAF5E8] border-2 border-dashed border-[#DECFA4] rounded-2xl p-8 shadow-card-soft">
          <LoadingSimmer />
        </div>
      )}

      {/* Torn-Paper Divider */}
      <div className="torn-divider w-full opacity-60" />

      {/* Results Section */}
      <div id="recipe-results">
        {recipes.length > 0 && !isLoading && (
          <RecipeStack
            recipes={recipes}
            favorites={favorites}
            savingId={savingId}
            onSaveRecipe={handleSaveRecipe}
            allergenProfile={allergenProfile}
            onOpenGroceryGap={onOpenGroceryGap}
            onPublishCommunity={onPublishCommunity}
            pantryIngredients={ingredients}
          />
        )}
      </div>
    </div>
  );
}
