import React from 'react';
import { Timer, Scale, MessageSquareText, Filter, Globe, Sparkles, ChefHat } from 'lucide-react';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'High-Protein',
  'Quick (<20 min)',
];

const CUISINES = [
  'Any Style',
  'Rustic Italian',
  'Warm Indian Curry',
  'Asian Stir-Fry',
  'Mexican Fiesta',
  'Mediterranean',
  'French Bistro',
];

export default function KitchenToolbar({
  selectedDietary,
  onToggleDietary,
  selectedCuisine,
  onSelectCuisine,
  onOpenTimer,
  onOpenConverter,
  onToggleChat,
  isChatOpen,
}) {
  return (
    <div className="w-full bg-[#FAF5E8] border-2 border-[#E3D7BE] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-4">
      {/* Top Toolbar Row: Kitchen Utensil Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3D7BE]/80">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-tomato" />
          <span className="font-serif font-bold text-sm sm:text-base text-charcoal">
            Kitchen Station Toolbar
          </span>
        </div>

        {/* Quick Utility Tool Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTimer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4ECDB] hover:bg-tomato/15 hover:text-tomato text-charcoal border border-[#DECFA4] text-xs font-mono font-semibold transition-all shadow-sm"
            title="Open Stovetop Timer"
          >
            <Timer className="w-3.5 h-3.5 text-tomato" />
            <span>Timer</span>
          </button>

          <button
            type="button"
            onClick={onOpenConverter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4ECDB] hover:bg-sage/20 hover:text-sage-hover text-charcoal border border-[#DECFA4] text-xs font-mono font-semibold transition-all shadow-sm"
            title="Measurement & Temp Converter"
          >
            <Scale className="w-3.5 h-3.5 text-sage" />
            <span>Converter</span>
          </button>

          <button
            type="button"
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm border ${
              isChatOpen
                ? 'bg-tomato text-white border-tomato'
                : 'bg-mustard/20 hover:bg-mustard/30 text-charcoal border-mustard/40'
            }`}
            title="Ask AI Sous-Chef"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Ask Sous-Chef</span>
          </button>
        </div>
      </div>

      {/* Second Row: Cuisine and Dietary Filters */}
      <div className="space-y-3">
        {/* Cuisine Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-mustard" /> Cuisine Style:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                type="button"
                onClick={() => onSelectCuisine(cuisine)}
                className={`text-xs font-sans px-2.5 py-1 rounded-lg border transition-all ${
                  selectedCuisine === cuisine
                    ? 'bg-mustard text-charcoal font-bold border-mustard-hover shadow-sm'
                    : 'bg-[#FBF7EE] text-charcoal-muted hover:text-charcoal border-[#DDD2BE]'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E3D7BE]/50">
          <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sage" /> Dietary Preferences:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map((tag) => {
              const isSelected = selectedDietary.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleDietary(tag)}
                  className={`text-xs font-sans px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-sage text-white font-bold border-sage-hover shadow-sm'
                      : 'bg-[#FBF7EE] text-charcoal-muted hover:text-charcoal border-[#DDD2BE]'
                  }`}
                >
                  <span>{tag}</span>
                  {isSelected && <span className="font-mono text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
