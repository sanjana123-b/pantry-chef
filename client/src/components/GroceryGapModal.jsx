import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Copy, Check, Printer, X, Sparkles, Plus } from 'lucide-react';

export default function GroceryGapModal({ isOpen, onClose, recipe, pantryIngredients = [] }) {
  const [copied, setCopied] = useState(false);
  const [customItem, setCustomItem] = useState('');

  if (!isOpen || !recipe) return null;

  const recipeTitle = recipe.title || recipe.recipeTitle || 'Recipe';
  const recipeIngredients = recipe.ingredients || [];

  // Identify what ingredients are in recipe but not in pantry
  const pantryLower = pantryIngredients.map((i) => i.toLowerCase());
  const detectedMissing = recipeIngredients.filter(
    (ing) => !pantryLower.some((p) => p.includes(ing.toLowerCase()) || ing.toLowerCase().includes(p))
  );

  const defaultItems = detectedMissing.length > 0
    ? detectedMissing
    : ['Kosher Sea Salt', 'Fresh Cracked Black Pepper', 'High-heat Cooking Oil', 'Fresh Lemon / Garnish'];

  const [shoppingItems, setShoppingItems] = useState(defaultItems);

  const handleAddItem = () => {
    if (!customItem.trim()) return;
    setShoppingItems((prev) => [...prev, customItem.trim()]);
    setCustomItem('');
  };

  const handleRemoveItem = (index) => {
    setShoppingItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyClipboard = () => {
    const listText = `🛒 PantryChef Shopping Gap List for "${recipeTitle}":\n` +
      shoppingItems.map((item) => `- [ ] ${item}`).join('\n') +
      `\n\nCook with what you have: http://localhost:5173`;

    navigator.clipboard.writeText(listText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
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
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Grocery Gap List & Export
              </h3>
              <p className="text-xs text-charcoal-muted font-sans truncate max-w-[240px] sm:max-w-xs">
                For: {recipeTitle}
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

        {/* Shopping Checklist */}
        <div className="space-y-4">
          <div className="p-3.5 bg-[#F4EDE0] rounded-2xl border border-[#DECFA4] space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold block">
              Items to Grab:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {shoppingItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6EE] border border-[#DDD0B7] text-xs font-mono text-charcoal"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-tomato font-bold">🛒</span>
                    <span>{item}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-charcoal-muted hover:text-tomato p-1"
                    title="Remove item"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Item Input */}
            <div className="flex gap-2 pt-2 border-t border-[#DECFA4]/60">
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder="Add extra pantry item..."
                className="flex-1 bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 px-3 py-1.5 rounded-lg border border-[#D5C6A6] text-xs focus:outline-none focus:border-tomato"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-tomato text-white text-xs font-mono font-bold rounded-lg hover:bg-tomato-hover transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleCopyClipboard}
              className="py-3 px-4 bg-tomato hover:bg-tomato-hover text-white font-serif font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-[#A83E1E]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-mustard" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy to Phone Notes</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handlePrint}
              className="py-3 px-4 bg-[#FAF7EE] hover:bg-[#EFE4CF] text-charcoal font-serif font-bold text-xs rounded-xl border border-[#D5C4A2] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4 text-sage" />
              <span>Print Recipe Card</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
