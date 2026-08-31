import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Bookmark, Sparkles } from 'lucide-react';

export default function SaveStamp({ isSaved, isSaving, onToggleSave, compact = false }) {
  return (
    <div className="relative inline-flex items-center">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        onClick={onToggleSave}
        disabled={isSaving}
        className={`relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
          isSaved
            ? 'bg-tomato/15 text-tomato border-2 border-tomato/40'
            : 'bg-cream-dark/70 hover:bg-cream-dark text-charcoal border-2 border-aged-border hover:border-charcoal/30'
        } ${compact ? 'px-3 py-1.5 text-xs' : ''}`}
        title={isSaved ? 'Recipe stamped into your ledger' : 'Stamp to favorites'}
      >
        {/* Button icon & label */}
        <Bookmark
          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
            isSaved ? 'fill-tomato text-tomato' : 'text-charcoal-muted'
          }`}
        />
        <span className="font-sans font-semibold tracking-wide">
          {isSaved ? 'Stamped & Saved' : 'Save to Ledger'}
        </span>

        {/* Ink Stamp Overlay Badge when saved */}
        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ scale: 2.8, opacity: 0, rotate: -28 }}
              animate={{ scale: 1, opacity: 0.9, rotate: -6 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 20,
              }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center bg-tomato/10 rounded-md"
            >
              <div className="border border-dashed border-tomato/60 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest text-tomato font-bold -rotate-3 select-none">
                ★ RECIPE BOX ★
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
