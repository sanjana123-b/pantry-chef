import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Sparkles,
  Camera,
  Calendar,
  Layers,
  ChevronDown,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { getIngredientEmoji, getIngredientCategory } from '../utils/foodImageHelper';

const COMMON_SUGGESTIONS = [
  'Eggs',
  'Garlic',
  'Onion',
  'Tomatoes',
  'Olive Oil',
  'Pasta',
  'Rice',
  'Cheddar Cheese',
  'Parmesan',
  'Potatoes',
  'Chicken Breast',
  'Spinach',
  'Lemon',
  'Bell Pepper',
  'Black Beans',
  'Butter',
  'Milk',
  'Carrots',
  'Broccoli',
  'Mushrooms',
  'Ground Beef',
  'Flour',
  'Bread',
  'Greek Yogurt',
  'Avocado',
  'Heavy Cream',
  'Zucchini',
  'Bacon',
  'Soy Sauce',
  'Honey',
];

const CATEGORIES = ['All', 'Vegetables', 'Dairy', 'Protein', 'Grains', 'Pantry staples'];

export default function IngredientInput({
  ingredients = [],
  onAddIngredient,
  onRemoveIngredient,
  onClearAll,
  onOpenScanner,
}) {
  const [inputValue, setInputValue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize ingredients to uniform objects
  const normalizedIngredients = ingredients.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: `ing-${idx}-${item}`,
        name: item,
        quantity: '',
        expiryDate: '',
        category: getIngredientCategory(item),
      };
    }
    return {
      ...item,
      id: item.id || `ing-${idx}-${item.name}`,
      category: item.category || getIngredientCategory(item.name),
    };
  });

  // Autocomplete matching
  const matchingSuggestions = inputValue.trim()
    ? COMMON_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !normalizedIngredients.some((i) => i.name.toLowerCase() === s.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleAdd = (itemName) => {
    const nameToAdd = (itemName || inputValue).trim();
    if (!nameToAdd) return;

    const exists = normalizedIngredients.some(
      (item) => item.name.toLowerCase() === nameToAdd.toLowerCase()
    );
    if (!exists) {
      onAddIngredient({
        name: nameToAdd,
        quantity: quantity.trim(),
        expiryDate: expiryDate,
        category: getIngredientCategory(nameToAdd),
      });
    }

    setInputValue('');
    setQuantity('');
    setExpiryDate('');
    setShowAdvanced(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  // Helper to check if ingredient is expiring soon
  const isExpiring = (expDate) => {
    if (!expDate) return false;
    const exp = new Date(expDate);
    const now = new Date();
    const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
    return diffDays <= 2;
  };

  // Filtered ingredients by category tab
  const filteredIngredients =
    selectedCategory === 'All'
      ? normalizedIngredients
      : normalizedIngredients.filter((i) => i.category === selectedCategory);

  return (
    <div className="w-full bg-paper-card border border-paper-border rounded-card p-5 md:p-7 shadow-card-soft space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-paper-border">
        <div>
          <h3 className="font-heading text-lg md:text-xl font-bold text-ink tracking-tight flex items-center gap-2">
            <span>Pantry Inventory</span>
            <span className="text-xs font-semibold bg-paper-muted text-ink px-2.5 py-0.5 rounded-full border border-paper-border">
              {normalizedIngredients.length} items
            </span>
          </h3>
          <p className="text-xs text-ink-muted">
            Add ingredients with optional quantity and expiry dates, or snap a photo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-tomato/10 hover:bg-tomato/20 text-tomato text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="Scan Fridge or Receipt with Camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Photo</span>
          </button>

          {normalizedIngredients.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-ink-muted hover:text-tomato transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Input Form with Autocomplete */}
      <div className="space-y-2 relative">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Main Ingredient Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient (e.g. Eggs, Garlic, Rice)..."
              className="w-full bg-paper text-ink placeholder-ink-muted/60 px-4 py-3 rounded-btn border border-paper-border focus:outline-none focus:border-tomato text-sm font-medium transition-all"
            />

            {/* Autocomplete Suggestions Dropdown */}
            {isFocused && matchingSuggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-1.5 bg-paper-card border border-paper-border rounded-btn shadow-card-elevated z-30 overflow-hidden divide-y divide-paper-border"
              >
                {matchingSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => handleAdd(item)}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm hover:bg-tomato/10 flex items-center justify-between text-ink cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <span>{getIngredientEmoji(item)}</span>
                      <span>{item}</span>
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      {getIngredientCategory(item)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={() => handleAdd()}
            disabled={!inputValue.trim()}
            className="px-5 py-3 bg-tomato hover:bg-tomato-hover disabled:opacity-40 text-white font-semibold text-sm rounded-btn shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add ingredient</span>
          </button>
        </div>

        {/* Optional Quantity & Expiry Expand Toggle */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-ink-muted hover:text-ink flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>{showAdvanced ? '− Hide' : '+ Add'} quantity & expiry date</span>
          </button>
        </div>

        {/* Collapsible Quantity and Expiry Inputs */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 overflow-hidden"
            >
              <div>
                <label className="text-[11px] text-ink-muted font-medium block mb-1">
                  Quantity (optional)
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 2 cups, 500g, 3 cloves"
                  className="w-full bg-paper text-ink px-3 py-2 rounded-btn border border-paper-border text-xs focus:outline-none focus:border-tomato"
                />
              </div>
              <div>
                <label className="text-[11px] text-ink-muted font-medium block mb-1">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-paper text-ink px-3 py-2 rounded-btn border border-paper-border text-xs focus:outline-none focus:border-tomato"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Tabs */}
      {normalizedIngredients.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-paper-border">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? normalizedIngredients.length
                : normalizedIngredients.filter((i) => i.category === cat).length;
            if (cat !== 'All' && count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-ink text-paper font-semibold'
                    : 'bg-paper text-ink-muted hover:text-ink border border-paper-border'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Ingredients Shelf */}
      <div className="min-h-[72px] p-3.5 bg-paper rounded-card border border-paper-border">
        {normalizedIngredients.length === 0 ? (
          <div className="py-6 text-center space-y-1">
            <span className="text-sm font-medium text-ink">
              Your pantry is empty
            </span>
            <p className="text-xs text-ink-muted">
              Type ingredients above or click quick staples below to add them to your shelf!
            </p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <div className="py-4 text-center text-xs text-ink-muted">
            No ingredients in the "{selectedCategory}" category.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {filteredIngredients.map((item) => {
                const expiring = isExpiring(item.expiryDate);
                return (
                  <motion.div
                    key={item.id || item.name}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    layout
                    className={`inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-all ${
                      expiring
                        ? 'bg-butter/25 text-ink border-butter-hover/50'
                        : 'bg-paper-card text-ink border-paper-border hover:border-ink/20'
                    }`}
                  >
                    <span className="text-base select-none">
                      {getIngredientEmoji(item.name)}
                    </span>
                    <span className="font-semibold">{item.name}</span>

                    {item.quantity && (
                      <span className="text-[11px] text-ink-muted bg-paper px-1.5 py-0.5 rounded-full border border-paper-border">
                        {item.quantity}
                      </span>
                    )}

                    {item.expiryDate && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                          expiring
                            ? 'bg-tomato text-white font-bold'
                            : 'bg-paper text-ink-muted border border-paper-border'
                        }`}
                        title={`Expires: ${item.expiryDate}`}
                      >
                        {expiring && <AlertTriangle className="w-2.5 h-2.5" />}
                        {item.expiryDate.slice(5)}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveIngredient(item.name)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1 rounded-full text-ink-muted hover:text-tomato hover:bg-tomato/10 transition-colors ml-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick Staples Bar */}
      <div className="pt-2">
        <span className="text-[11px] text-ink-muted block mb-2 font-medium">
          Quick add pantry staples:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SUGGESTIONS.slice(0, 10).map((staple) => {
            const isAdded = normalizedIngredients.some(
              (i) => i.name.toLowerCase() === staple.toLowerCase()
            );
            return (
              <button
                key={staple}
                type="button"
                onClick={() => handleAdd(staple)}
                disabled={isAdded}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAdded
                    ? 'opacity-40 bg-paper-muted border-paper-border text-ink-muted cursor-not-allowed'
                    : 'bg-paper text-ink border-paper-border hover:border-tomato hover:text-tomato'
                }`}
              >
                <span>{getIngredientEmoji(staple)}</span>
                <span>{staple}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
