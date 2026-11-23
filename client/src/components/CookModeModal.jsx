import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import ChefMascot from './ChefMascot';

export default function CookModeModal({
  isOpen,
  onClose,
  recipe,
  onStartTimer,
}) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen || !recipe) return null;

  const steps = recipe.steps || recipe.recipeSteps || [];
  const title = recipe.title || recipe.recipeTitle || 'Recipe';
  const totalSteps = Math.max(1, steps.length);
  const currentStepText = steps[currentStep] || '';
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Detect time in text (e.g. "simmer 5 minutes" or "bake 25 mins")
  const durationMatch = currentStepText.match(/\b(\d+)\s*(?:minutes?|mins?)\b/i);
  const detectedMinutes = durationMatch ? parseInt(durationMatch[1], 10) : null;

  const isCompleted = currentStep === totalSteps - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-paper/98 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 md:p-12 overflow-y-auto">
        {/* Header Bar */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-paper-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-tomato text-white rounded-btn shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-tomato uppercase tracking-wider block">
                Guided Cook Mode
              </span>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-ink line-clamp-1">
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Cook Mode"
            className="p-2.5 rounded-full text-ink-muted hover:text-ink hover:bg-paper-muted border border-paper-border transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl mx-auto my-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-paper-muted rounded-full overflow-hidden border border-paper-border">
            <motion.div
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-tomato rounded-full"
            />
          </div>
        </div>

        {/* Step Card Content */}
        <div className="w-full max-w-3xl mx-auto my-auto py-8 text-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-tomato/10 text-tomato font-heading font-black text-2xl border border-tomato/20 shadow-sm mx-auto">
                {currentStep + 1}
              </div>

              <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-ink font-bold leading-relaxed max-w-2xl mx-auto">
                {currentStepText}
              </p>

              {/* Detected Duration Inline Timer Trigger */}
              {detectedMinutes && (
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onStartTimer && onStartTimer(detectedMinutes)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-btn bg-butter/25 hover:bg-butter/40 border border-butter text-ink font-bold text-sm shadow-sm transition-all cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-tomato animate-pulse" />
                    <span>Start {detectedMinutes} min timer</span>
                  </motion.button>
                </div>
              )}

              {/* Final Step Cheer */}
              {isCompleted && (
                <div className="pt-4 flex flex-col items-center gap-2">
                  <ChefMascot mood="cheer" size={80} />
                  <span className="text-sm font-bold text-basil flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> That's the final step! Bon appétit!
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between pt-4 border-t border-paper-border">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-btn bg-paper border border-paper-border text-ink font-semibold text-sm hover:bg-paper-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-ink-muted hidden sm:inline">
            Use ← / → arrow keys to navigate
          </span>

          {isCompleted ? (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 rounded-btn bg-basil hover:bg-basil-hover text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>Finish Cooking</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-btn bg-tomato hover:bg-tomato-hover text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
