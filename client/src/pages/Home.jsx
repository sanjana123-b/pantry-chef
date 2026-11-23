import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, AlertCircle, Dice5 } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';
import KitchenToolbar from '../components/KitchenToolbar';
import WasteTrackerBanner from '../components/WasteTrackerBanner';
import RecipeStack from '../components/RecipeStack';
import LoadingSimmer from '../components/LoadingSimmer';
import { generateRecipes, saveFavorite } from '../api/client';
import { getIngredientCategory } from '../utils/foodImageHelper';

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
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Eggs', quantity: '6 pcs', expiryDate: inThreeDays, category: 'Protein' },
    { id: '2', name: 'Garlic', quantity: '4 cloves', expiryDate: nextWeek, category: 'Vegetables' },
    { id: '3', name: 'Tomatoes', quantity: '3 ripe', expiryDate: tomorrow, category: 'Vegetables' },
    { id: '4', name: 'Olive Oil', quantity: '2 tbsp', expiryDate: '', category: 'Pantry staples' },
    { id: '5', name: 'Spinach', quantity: '1 bag', expiryDate: tomorrow, category: 'Vegetables' },
  ]);

  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('Any Style');
  const [cookTime, setCookTime] = useState(0); // 0 = any, 10, 20, 40

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Compute expiring items dynamically from expiry dates
  const expiringItems = ingredients
    .filter((item) => {
      const expDate = typeof item === 'string' ? null : item.expiryDate;
      if (!expDate) return false;
      const exp = new Date(expDate);
      const now = new Date();
      const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
      return diffDays <= 2;
    })
    .map((item) => (typeof item === 'string' ? item : item.name));

  const handleAddIngredient = (item) => {
    if (typeof item === 'string') {
      setIngredients((prev) => [
        ...prev,
        {
          id: `ing-${Date.now()}-${item}`,
          name: item,
          quantity: '',
          expiryDate: '',
          category: getIngredientCategory(item),
        },
      ]);
    } else {
      setIngredients((prev) => [
        ...prev,
        {
          id: `ing-${Date.now()}-${item.name}`,
          ...item,
          category: item.category || getIngredientCategory(item.name),
        },
      ]);
    }
    setError(null);
  };

  const handleRemoveIngredient = (nameToRemove) => {
    setIngredients((prev) =>
      prev.filter((i) => (typeof i === 'string' ? i : i.name).toLowerCase() !== nameToRemove.toLowerCase())
    );
  };

  const handleClearAll = () => {
    setIngredients([]);
    setRecipes([]);
    setError(null);
  };

  const handleToggleDietary = (tag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async (forcedList = null) => {
    const listRaw = forcedList || ingredients;

    if (listRaw.length === 0) {
      setError('Please add at least one pantry ingredient before cooking.');
      return;
    }

    // Format ingredients into clean strings for backend API
    const listToCook = listRaw.map((item) => {
      if (typeof item === 'string') return item;
      return item.quantity ? `${item.quantity} ${item.name}` : item.name;
    });

    setIsLoading(true);
    setError(null);

    const dietaryOptions = [...selectedDietary];
    if (cookTime > 0) {
      dietaryOptions.push(`Under ${cookTime} minutes`);
    }

    try {
      const generated = await generateRecipes(listToCook, {
        dietary: dietaryOptions,
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
    const expiringObjs = ingredients.filter((i) =>
      expiringItems.includes(typeof i === 'string' ? i : i.name)
    );
    handleGenerate(expiringObjs);
  };

  const handleSurpriseMe = () => {
    const randomCuisines = ['Italian', 'Asian Stir-Fry', 'Mexican', 'Mediterranean', 'French Bistro'];
    const chosenCuisine = randomCuisines[Math.floor(Math.random() * randomCuisines.length)];
    setSelectedCuisine(chosenCuisine);

    const surprisePool = [
      { name: 'Eggs', quantity: '4', category: 'Protein' },
      { name: 'Garlic', quantity: '3 cloves', category: 'Vegetables' },
      { name: 'Tomatoes', quantity: '2', category: 'Vegetables' },
      { name: 'Olive Oil', quantity: '1 tbsp', category: 'Pantry staples' },
      { name: 'Pasta', quantity: '250g', category: 'Grains' },
      { name: 'Parmesan', quantity: '1/4 cup', category: 'Dairy' },
    ];
    setIngredients(surprisePool);
    handleGenerate(surprisePool);
  };

  const handleSaveRecipe = async (recipe) => {
    const title = recipe.title || recipe.recipeTitle;
    setSavingId(title);

    const pantryNames = ingredients.map((i) => (typeof i === 'string' ? i : i.name));

    try {
      const res = await saveFavorite({
        ingredients: pantryNames,
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
          ? `"${title}" is already in My Recipes!`
          : `Saved "${title}" to My Recipes!`,
      });

      setTimeout(() => setFeedbackNotice(null), 4000);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setFeedbackNotice({
        type: 'error',
        message: 'Could not save recipe to favorites. Please check your connection.',
      });
      setTimeout(() => setFeedbackNotice(null), 4000);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Waste Tracker Freshness Alert Banner */}
      <section>
        <WasteTrackerBanner
          expiringItems={expiringItems}
          onPrioritizeExpiring={handlePrioritizeExpiring}
        />
      </section>

      {/* Hero Header */}
      <section className="text-center space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
          What’s in your pantry today?
        </h1>
        <p className="max-w-xl mx-auto text-ink-muted text-sm sm:text-base leading-relaxed">
          Add what you have in your fridge or cupboards, and let Auguste suggest quick, delicious recipes.
        </p>
      </section>

      {/* Main Ingredient Shelf Input */}
      <section>
        <IngredientInput
          ingredients={ingredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onClearAll={handleClearAll}
          onOpenScanner={onOpenScanner}
        />
      </section>

      {/* Kitchen Station Toolbar: Visual Tiles, Time Slider, Surprise Me */}
      <section>
        <KitchenToolbar
          selectedDietary={selectedDietary}
          onToggleDietary={handleToggleDietary}
          selectedCuisine={selectedCuisine}
          onSelectCuisine={setSelectedCuisine}
          cookTime={cookTime}
          onSelectCookTime={setCookTime}
          onSurpriseMe={handleSurpriseMe}
        />
      </section>

      {/* Generate Action Button */}
      <div className="flex flex-col items-center justify-center space-y-2 pt-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => handleGenerate()}
          disabled={isLoading || ingredients.length === 0}
          className="relative px-8 py-4 bg-tomato hover:bg-tomato-hover disabled:opacity-40 disabled:hover:bg-tomato text-white font-heading font-bold text-lg md:text-xl rounded-btn shadow-card-soft transition-all flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed"
        >
          <Flame className="w-5 h-5 text-butter" />
          <span>What can I cook with this?</span>
        </motion.button>
        <span className="text-xs text-ink-muted">
          Generates 2–3 bespoke recipes tailored to your ingredients
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-card bg-tomato/10 border border-tomato/30 text-tomato flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading font-bold text-sm">Recipe Notice</h4>
            <p className="text-xs md:text-sm mt-0.5 text-ink">{error}</p>
          </div>
        </div>
      )}

      {/* Feedback Toast Notification */}
      {feedbackNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-3.5 rounded-card border text-sm font-medium flex items-center justify-between gap-3 shadow-sm ${
            feedbackNotice.type === 'success'
              ? 'bg-basil/15 border-basil/30 text-basil'
              : 'bg-tomato/15 border-tomato/30 text-tomato'
          }`}
        >
          <span>{feedbackNotice.message}</span>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-xs opacity-70 hover:opacity-100 underline cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Loading Simmer State */}
      {isLoading && (
        <div className="bg-paper-card border border-paper-border rounded-card p-8 shadow-card-soft">
          <LoadingSimmer />
        </div>
      )}

      {/* Results Section */}
      <div id="recipe-results">
        <RecipeStack
          recipes={recipes}
          favorites={favorites}
          savingId={savingId}
          isLoading={isLoading}
          onSaveRecipe={handleSaveRecipe}
          allergenProfile={allergenProfile}
          onOpenGroceryGap={onOpenGroceryGap}
          onPublishCommunity={onPublishCommunity}
          pantryIngredients={ingredients.map((i) => (typeof i === 'string' ? i : i.name))}
        />
      </div>
    </div>
  );
}
