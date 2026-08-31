import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Camera, Clock, AlertTriangle } from 'lucide-react';

const COMMON_STAPLES = [
  'Eggs',
  'Garlic',
  'Onion',
  'Tomatoes',
  'Pasta',
  'Rice',
  'Olive Oil',
  'Cheddar Cheese',
  'Potatoes',
  'Chicken Breast',
  'Spinach',
  'Lemon',
  'Bell Pepper',
  'Black Beans',
];

// Custom Mini Jar Icon Component
const JarIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Jar Lid */}
    <rect x="7" y="2" width="10" height="3" rx="1" fill="#D9A441" stroke="#2B2320" strokeWidth="1.5" />
    <line x1="6" y1="5" x2="18" y2="5" stroke="#2B2320" strokeWidth="1.5" />
    {/* Jar Body */}
    <path
      d="M6 6 C6 5.5, 6.5 5, 7 5 L17 5 C17.5 5, 18 5.5, 18 6 L18 19 C18 20.5, 16.5 22, 15 22 L9 22 C7.5 22, 6 20.5, 6 19 Z"
      fill="#FAF4E6"
      stroke="#2B2320"
      strokeWidth="1.5"
    />
    {/* Jar Label Line */}
    <rect x="8" y="10" width="8" height="6" rx="1" stroke="#C1502E" strokeWidth="1" strokeDasharray="2 1" fill="#FAF5E8" />
  </svg>
);

export default function IngredientInput({
  ingredients,
  expiringItems = [],
  onAddIngredient,
  onRemoveIngredient,
  onToggleExpiry,
  onClearAll,
  onOpenScanner,
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (name) => {
    const trimmed = (name || inputValue).trim();
    if (!trimmed) return;
    
    const exists = ingredients.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      onAddIngredient(trimmed);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="w-full bg-[#FAF5E8] border-2 border-[#E3D7BE] rounded-2xl p-5 md:p-7 shadow-card-soft">
      {/* Ledger Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E3D7BE]/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#FAF0D9] border border-mustard/40 rounded-lg text-charcoal">
            <JarIcon className="w-5 h-5 text-tomato" />
          </div>
          <div>
            <h3 className="font-serif text-lg md:text-xl font-bold text-charcoal tracking-tight flex items-center gap-2">
              Pantry Inventory
              <span className="text-xs font-mono font-normal bg-mustard/20 text-charcoal px-2 py-0.5 rounded-full border border-mustard/30">
                {ingredients.length} items logged
              </span>
            </h3>
            <p className="text-xs text-charcoal-muted font-sans">
              Type items or snap a photo of your fridge & grocery receipts
            </p>
          </div>
        </div>

        {/* Action Controls: Photo Scanner & Clear */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tomato/15 hover:bg-tomato/25 text-tomato border border-tomato/30 text-xs font-mono font-bold transition-all shadow-sm"
            title="Scan Fridge or Receipt with Gemini Vision"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Photo</span>
          </button>

          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-mono text-charcoal-muted hover:text-tomato underline decoration-dotted transition-colors"
            >
              Clear shelf
            </button>
          )}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Garlic, Pasta, Canned Tomatoes, Eggs, Spinach..."
            className="w-full bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 px-4 py-3 pl-4 rounded-xl border-2 border-[#D9CBAC] focus:outline-none focus:border-tomato focus:ring-2 focus:ring-tomato/20 font-medium transition-all text-sm md:text-base"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => handleAdd()}
          disabled={!inputValue.trim()}
          className="px-5 py-3 bg-tomato hover:bg-tomato-hover disabled:opacity-40 disabled:hover:bg-tomato text-white font-serif font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Jar</span>
        </motion.button>
      </div>

      {/* Jar Label Chips Shelf */}
      <div className="min-h-[64px] p-3 bg-[#F4EDE0]/60 rounded-xl border border-[#E3D7BE] mb-4">
        {ingredients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <span className="font-handwritten text-lg text-charcoal-muted">
              Your pantry shelf is currently bare...
            </span>
            <p className="text-xs text-charcoal-muted/80 mt-0.5">
              Add ingredients above, tap staples below, or scan a photo to auto-fill!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 items-center">
            <AnimatePresence mode="popLayout">
              {ingredients.map((item) => {
                const isExpiring = expiringItems.includes(item);
                return (
                  <motion.div
                    key={item}
                    initial={{ scale: 0.7, opacity: 0, y: 8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`jar-token group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-lg border-2 transition-all ${
                      isExpiring
                        ? 'border-mustard bg-[#FFF7E6] shadow-sm'
                        : 'border-[#D5C6A6] bg-[#FAF5E8]'
                    }`}
                  >
                    <JarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-mono text-xs md:text-sm font-semibold text-charcoal tracking-tight capitalize">
                      {item}
                    </span>

                    {/* Expiry Tag Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleExpiry && onToggleExpiry(item)}
                      className={`px-1 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        isExpiring
                          ? 'bg-mustard/30 text-charcoal font-bold'
                          : 'opacity-40 hover:opacity-100 hover:bg-mustard/20 text-charcoal-muted'
                      }`}
                      title={isExpiring ? 'Marked as expiring soon' : 'Click to tag as expiring soon'}
                    >
                      {isExpiring ? '⚠️ Expiring' : '⏳'}
                    </button>

                    {/* Remove Jar Token */}
                    <button
                      type="button"
                      onClick={() => onRemoveIngredient(item)}
                      className="p-0.5 rounded-full hover:bg-tomato/20 hover:text-tomato text-charcoal-muted transition-colors ml-0.5"
                      title={`Remove ${item}`}
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

      {/* Quick Staples Pantry Picker */}
      <div className="pt-2 border-t border-[#E3D7BE]/70">
        <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold block mb-2">
          ★ Quick Pantry Staples (tap to add):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_STAPLES.map((staple) => {
            const isAdded = ingredients.some(
              (i) => i.toLowerCase() === staple.toLowerCase()
            );
            return (
              <button
                key={staple}
                type="button"
                onClick={() => !isAdded && handleAdd(staple)}
                disabled={isAdded}
                className={`text-xs font-sans px-2.5 py-1 rounded-md border transition-all flex items-center gap-1 ${
                  isAdded
                    ? 'bg-sage/20 text-sage-hover border-sage/40 opacity-70 cursor-default'
                    : 'bg-[#FBF7EE] text-charcoal/80 border-[#DDD2BE] hover:border-tomato hover:text-tomato hover:bg-tomato/5'
                }`}
              >
                <span>{staple}</span>
                {isAdded ? (
                  <span className="text-[10px] font-mono">✓</span>
                ) : (
                  <span className="text-charcoal-muted/60 text-[10px]">+</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
