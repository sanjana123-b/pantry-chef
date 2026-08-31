import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, X, Check, Sparkles } from 'lucide-react';

export const ALLERGEN_LIST = [
  { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
  { id: 'tree_nuts', label: 'Tree Nuts (Almonds, Walnuts, Cashews)', icon: '🌰' },
  { id: 'dairy', label: 'Dairy / Milk', icon: '🥛' },
  { id: 'gluten', label: 'Gluten / Wheat', icon: '🌾' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'shellfish', label: 'Shellfish & Crustaceans', icon: '🦐' },
  { id: 'fish', label: 'Fish & Seafood', icon: '🐟' },
  { id: 'soy', label: 'Soy & Tofu', icon: '🌱' },
  { id: 'sesame', label: 'Sesame', icon: '🥯' },
];

export const DIET_GOALS = [
  { id: 'low_sodium', label: 'Low Sodium (<500mg)', icon: '🧂' },
  { id: 'keto', label: 'Keto / Strict Low-Carb', icon: '🥑' },
  { id: 'vegan', label: 'Strict Vegan (100% Plant-Based)', icon: '🌿' },
  { id: 'halal', label: 'Halal Certified Ingredients', icon: '🌙' },
  { id: 'kosher', label: 'Kosher Rules', icon: '✡️' },
];

/**
 * Helper to audit a recipe against user's allergen profile
 */
export function checkRecipeAllergens(recipe, profile = { allergens: [], diets: [] }) {
  const textToCheck = `${recipe.title || recipe.recipeTitle} ${recipe.description || recipe.recipeDescription} ${(recipe.ingredients || []).join(' ')} ${(recipe.steps || recipe.recipeSteps || []).join(' ')}`.toLowerCase();

  const violations = [];

  if (profile.allergens?.includes('peanuts') && (textToCheck.includes('peanut') || textToCheck.includes('groundnut'))) {
    violations.push('Contains Peanuts 🥜');
  }
  if (profile.allergens?.includes('tree_nuts') && (textToCheck.includes('almond') || textToCheck.includes('walnut') || textToCheck.includes('cashew') || textToCheck.includes('pecan') || textToCheck.includes('nut'))) {
    violations.push('Contains Tree Nuts 🌰');
  }
  if (profile.allergens?.includes('dairy') && (textToCheck.includes('milk') || textToCheck.includes('cheese') || textToCheck.includes('butter') || textToCheck.includes('cream') || textToCheck.includes('yogurt'))) {
    violations.push('Contains Dairy 🥛');
  }
  if (profile.allergens?.includes('gluten') && (textToCheck.includes('flour') || textToCheck.includes('bread') || textToCheck.includes('pasta') || textToCheck.includes('wheat') || textToCheck.includes('soy sauce'))) {
    violations.push('Contains Gluten 🌾');
  }
  if (profile.allergens?.includes('eggs') && textToCheck.includes('egg')) {
    violations.push('Contains Eggs 🥚');
  }
  if (profile.allergens?.includes('shellfish') && (textToCheck.includes('shrimp') || textToCheck.includes('crab') || textToCheck.includes('lobster') || textToCheck.includes('prawn'))) {
    violations.push('Contains Shellfish 🦐');
  }
  if (profile.allergens?.includes('soy') && (textToCheck.includes('soy') || textToCheck.includes('tofu') || textToCheck.includes('edamame'))) {
    violations.push('Contains Soy 🌱');
  }

  const isSafe = violations.length === 0;
  return { isSafe, violations };
}

export default function AllergenSettingsModal({
  isOpen,
  onClose,
  allergenProfile,
  onUpdateProfile,
}) {
  if (!isOpen) return null;

  const toggleAllergen = (id) => {
    const current = allergenProfile.allergens || [];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    onUpdateProfile({ ...allergenProfile, allergens: updated });
  };

  const toggleDiet = (id) => {
    const current = allergenProfile.diets || [];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    onUpdateProfile({ ...allergenProfile, diets: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-3xl p-6 sm:p-7 shadow-card-elevated relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4D7BF]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-tomato/15 text-tomato border border-tomato/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Allergen & Health Safety Profile
              </h3>
              <p className="text-xs text-charcoal-muted font-sans">
                Flag ingredients and warn against unsafe recipe suggestions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-tomato hover:bg-tomato/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Allergen Checkbox Grid */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold block mb-2">
              🚨 Strict Allergens to Avoid:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALLERGEN_LIST.map((item) => {
                const isSelected = (allergenProfile.allergens || []).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAllergen(item.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-tomato/15 border-tomato text-tomato font-bold shadow-sm'
                        : 'bg-[#FBF7EE] border-[#DDD2BE] text-charcoal hover:border-charcoal/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-tomato" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diets / Health Rules */}
          <div className="pt-2 border-t border-[#E4D7BF]">
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold block mb-2">
              🌿 Health & Dietary Rules:
            </span>
            <div className="space-y-2">
              {DIET_GOALS.map((item) => {
                const isSelected = (allergenProfile.diets || []).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleDiet(item.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-sage/20 border-sage text-sage-hover font-bold shadow-sm'
                        : 'bg-[#FBF7EE] border-[#DDD2BE] text-charcoal hover:border-charcoal/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-sage" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save / Close CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-tomato hover:bg-tomato-hover text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Safety Preferences</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
