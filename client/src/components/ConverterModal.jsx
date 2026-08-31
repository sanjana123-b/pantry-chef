import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Thermometer, Repeat, X, Sparkles, BookOpen } from 'lucide-react';

const INGREDIENT_DENSITIES = {
  'All-Purpose Flour': 125, // 1 cup = 125g
  'Granulated Sugar': 200,
  'Brown Sugar (Packed)': 220,
  'Butter': 227,
  'Rolled Oats': 90,
  'White Rice': 185,
  'Milk / Water': 240,
};

export default function ConverterModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('weight'); // 'weight', 'temp', 'substitutions'

  // Weight / Volume State
  const [cups, setCups] = useState(1);
  const [selectedIngredient, setSelectedIngredient] = useState('All-Purpose Flour');

  // Temperature State
  const [tempF, setTempF] = useState(350);

  const grams = Math.round(cups * (INGREDIENT_DENSITIES[selectedIngredient] || 125));
  const tempC = Math.round(((tempF - 32) * 5) / 9);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-2xl p-6 shadow-card-elevated relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4D7BF]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sage/15 text-sage-hover border border-sage/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Kitchen Ledger Converter
              </h3>
              <p className="text-xs text-charcoal-muted font-sans">
                Quick measurement calculations & culinary substitutions
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

        {/* Tab Selector */}
        <div className="flex bg-[#EFE5CF] p-1 rounded-xl border border-[#DECFA4] mb-5">
          <button
            type="button"
            onClick={() => setTab('weight')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'weight'
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-tomato" />
            <span>Cups ↔ Grams</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('temp')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'temp'
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-mustard" />
            <span>Oven °F ↔ °C</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('substitutions')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'substitutions'
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sage" />
            <span>Substitutions</span>
          </button>
        </div>

        {/* Tab 1: Cups to Grams */}
        {tab === 'weight' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                Select Ingredient:
              </label>
              <select
                value={selectedIngredient}
                onChange={(e) => setSelectedIngredient(e.target.value)}
                className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] font-medium text-sm focus:outline-none focus:border-tomato"
              >
                {Object.keys(INGREDIENT_DENSITIES).map((ing) => (
                  <option key={ing} value={ing}>
                    {ing}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                Amount in US Cups:
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={cups}
                onChange={(e) => setCups(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] font-mono text-lg font-bold focus:outline-none focus:border-tomato"
              />
            </div>

            <div className="bg-[#F3EBDB] border-2 border-[#D5C4A2] rounded-xl p-4 text-center">
              <span className="text-xs font-mono text-charcoal-muted uppercase tracking-wider">
                Equivalent Weight in Grams:
              </span>
              <div className="font-mono text-3xl font-extrabold text-tomato mt-1">
                {grams} g
              </div>
              <span className="text-xs text-charcoal-muted font-sans mt-1 block">
                ({cups} cup {selectedIngredient})
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Oven Temp */}
        {tab === 'temp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                Fahrenheit (°F):
              </label>
              <input
                type="number"
                step="5"
                value={tempF}
                onChange={(e) => setTempF(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FBF7EE] text-charcoal px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] font-mono text-lg font-bold focus:outline-none focus:border-mustard"
              />
            </div>

            <div className="bg-[#F3EBDB] border-2 border-[#D5C4A2] rounded-xl p-4 text-center">
              <span className="text-xs font-mono text-charcoal-muted uppercase tracking-wider">
                Celsius (°C) & Gas Mark:
              </span>
              <div className="font-mono text-3xl font-extrabold text-charcoal mt-1">
                {tempC} °C
              </div>
              <span className="text-xs text-charcoal-muted font-sans mt-1 block">
                {tempF >= 425
                  ? '🔥 High / Hot Oven'
                  : tempF >= 350
                  ? '♨️ Moderate Oven'
                  : '🌿 Low / Gentle Oven'}
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Quick Substitutions Cheat Sheet */}
        {tab === 'substitutions' && (
          <div className="space-y-2.5 text-xs font-sans">
            <div className="p-2.5 rounded-lg bg-[#FBF7EE] border border-[#DDD2BE]">
              <span className="font-mono font-bold text-tomato uppercase block">
                1 Cup Buttermilk:
              </span>
              <span>1 Cup Milk + 1 tbsp Lemon Juice or White Vinegar (let sit 5 mins).</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FBF7EE] border border-[#DDD2BE]">
              <span className="font-mono font-bold text-sage-hover uppercase block">
                1 Large Baking Egg:
              </span>
              <span>1/4 Cup Applesauce OR 1 tbsp Ground Flax + 3 tbsp Water.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FBF7EE] border border-[#DDD2BE]">
              <span className="font-mono font-bold text-mustard uppercase block">
                1 Cup Brown Sugar:
              </span>
              <span>1 Cup White Sugar + 1 tbsp Molasses or Maple Syrup.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FBF7EE] border border-[#DDD2BE]">
              <span className="font-mono font-bold text-charcoal uppercase block">
                1 tsp Baking Powder:
              </span>
              <span>1/4 tsp Baking Soda + 1/2 tsp Cream of Tartar.</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
