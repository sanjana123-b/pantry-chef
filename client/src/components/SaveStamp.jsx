import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Check } from 'lucide-react';
import ChefMascot from './ChefMascot';

const CONFETTI_PARTICLES = [
  { id: 1, x: -28, y: -24, color: '#E8452C', size: 6 },
  { id: 2, x: 28, y: -26, color: '#2F7D4F', size: 7 },
  { id: 3, x: -36, y: -4, color: '#FFC83D', size: 5 },
  { id: 4, x: 38, y: -6, color: '#3B2A4A', size: 6 },
  { id: 5, x: -20, y: -38, color: '#FFC83D', size: 7 },
  { id: 6, x: 20, y: -40, color: '#E8452C', size: 5 },
  { id: 7, x: -10, y: -44, color: '#2F7D4F', size: 6 },
  { id: 8, x: 10, y: -46, color: '#FFC83D', size: 6 },
];

export default function SaveStamp({ isSaved, isSaving, onToggleSave, compact = false }) {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleClick = (e) => {
    if (!isSaved) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2400);
    }
    onToggleSave(e);
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        disabled={isSaving}
        className={`relative group flex items-center gap-2 px-3.5 py-2 rounded-btn font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
          isSaved
            ? 'bg-basil/15 text-basil border border-basil/30 hover:bg-basil/20'
            : 'bg-paper-card hover:bg-paper-muted text-ink border border-paper-border hover:border-tomato/40 shadow-sm'
        } ${compact ? 'px-2.5 py-1 text-xs' : ''}`}
        title={isSaved ? 'Recipe saved to My Recipes' : 'Save recipe to My Recipes'}
        aria-label={isSaved ? 'Recipe saved' : 'Save recipe'}
      >
        <Bookmark
          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
            isSaved ? 'fill-basil text-basil' : 'text-ink-muted'
          }`}
        />
        <span>{isSaved ? 'Saved to My Recipes' : 'Save recipe'}</span>
      </motion.button>

      {/* Confetti & Cheering Mascot Pop-up celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -48, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center"
          >
            {/* Framer-motion confetti particles */}
            {CONFETTI_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 0.4],
                  rotate: [0, 180],
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size,
                  borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                }}
                className="absolute top-4 left-1/2"
              />
            ))}

            {/* Mini Cheering Auguste Mascot */}
            <div className="bg-paper-card border border-paper-border px-3 py-1.5 rounded-full shadow-card-elevated flex items-center gap-1.5">
              <ChefMascot mood="cheer" size={32} />
              <span className="text-xs font-bold text-basil flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
