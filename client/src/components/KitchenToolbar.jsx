import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Sparkles,
  Dice5,
  UtensilsCrossed,
  Check,
} from 'lucide-react';

const DIETARY_OPTIONS = [
  { id: 'Vegetarian', label: 'Vegetarian', icon: '🥦', desc: 'No meat or seafood' },
  { id: 'Vegan', label: 'Vegan', icon: '🌱', desc: '100% plant-based' },
  { id: 'Gluten-Free', label: 'Gluten-Free', icon: '🌾', desc: 'No wheat or gluten' },
  { id: 'Dairy-Free', label: 'Dairy-Free', icon: '🥛', desc: 'No lactose or milk' },
  { id: 'High-Protein', label: 'High-Protein', icon: '🥩', desc: 'Protein focused' },
  { id: 'Low-Carb', label: 'Low-Carb', icon: '🥑', desc: 'Keto friendly' },
];

const CUISINES = [
  { id: 'Any Style', label: 'Any Style', icon: '🍽️' },
  { id: 'Italian', label: 'Italian', icon: '🍝' },
  { id: 'Asian Stir-Fry', label: 'Asian', icon: '🥢' },
  { id: 'Mexican', label: 'Mexican', icon: '🌮' },
  { id: 'Mediterranean', label: 'Mediterranean', icon: '🫒' },
  { id: 'French Bistro', label: 'French', icon: '🥖' },
  { id: 'Indian Curry', label: 'Indian', icon: '🍛' },
];

const TIME_STEPS = [
  { value: 10, label: '10 min', desc: 'Lightning fast' },
  { value: 20, label: '20 min', desc: 'Standard meal' },
  { value: 40, label: '40 min', desc: 'Slow simmer' },
  { value: 0, label: 'Any time', desc: 'No limit' },
];

export default function KitchenToolbar({
  selectedDietary = [],
  onToggleDietary,
  selectedCuisine = 'Any Style',
  onSelectCuisine,
  cookTime = 0,
  onSelectCookTime,
  onSurpriseMe,
}) {
  return (
    <div className="w-full bg-paper-card border border-paper-border rounded-card p-5 md:p-7 shadow-card-soft space-y-6">
      {/* 1. Time Slider / Duration Selector & Surprise Me Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-border">
        <div className="space-y-1">
          <label className="font-heading font-bold text-base text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-tomato" />
            <span>Target Cook Time</span>
          </label>
          <p className="text-xs text-ink-muted">
            Select your preferred prep & cook duration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TIME_STEPS.map((step) => {
            const isSelected = cookTime === step.value;
            return (
              <button
                key={step.value}
                type="button"
                onClick={() => onSelectCookTime && onSelectCookTime(step.value)}
                className={`px-3.5 py-1.5 rounded-btn text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-tomato text-white shadow-sm'
                    : 'bg-paper text-ink border border-paper-border hover:border-tomato/50'
                }`}
              >
                {step.label}
              </button>
            );
          })}

          {/* Surprise Me Button */}
          {onSurpriseMe && (
            <button
              type="button"
              onClick={onSurpriseMe}
              className="px-3.5 py-1.5 rounded-btn bg-butter/25 hover:bg-butter/40 text-ink border border-butter font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto sm:ml-2"
              title="Pick a random cuisine and staple combination"
            >
              <Dice5 className="w-3.5 h-3.5 text-tomato" />
              <span>Surprise me!</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Cuisine Style Visual Tiles */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-heading font-bold text-base text-ink flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-butter-hover" />
            <span>Cuisine Profile</span>
          </label>
          <span className="text-xs text-ink-muted font-medium">
            Active: <strong className="text-ink">{selectedCuisine}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {CUISINES.map((cuisine) => {
            const isSelected = selectedCuisine === cuisine.id || selectedCuisine === cuisine.label;
            return (
              <motion.button
                key={cuisine.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSelectCuisine(cuisine.id)}
                className={`p-3 rounded-card text-left transition-all border flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-tomato/10 border-tomato text-tomato font-bold shadow-sm ring-1 ring-tomato'
                    : 'bg-paper border-paper-border text-ink hover:border-paper-border/80 hover:bg-paper-muted'
                }`}
              >
                <span className="text-2xl select-none">{cuisine.icon}</span>
                <span className="text-xs font-semibold leading-tight line-clamp-1">
                  {cuisine.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. Dietary Constraints Large Visual Tiles */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-heading font-bold text-base text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-basil" />
            <span>Dietary & Allergy Exclusions</span>
          </label>
          <span className="text-xs text-ink-muted font-medium">
            {selectedDietary.length > 0
              ? `${selectedDietary.length} selected`
              : 'None (regular meals)'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = selectedDietary.includes(diet.id);
            return (
              <motion.button
                key={diet.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onToggleDietary(diet.id)}
                className={`p-3 rounded-card text-left transition-all border flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-basil/15 border-basil text-basil font-bold shadow-sm ring-1 ring-basil'
                    : 'bg-paper border-paper-border text-ink hover:border-paper-border/80 hover:bg-paper-muted'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl select-none">{diet.icon}</span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-basil text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold block leading-tight">
                    {diet.label}
                  </span>
                  <span className="text-[10px] text-ink-muted leading-tight block mt-0.5">
                    {diet.desc}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
