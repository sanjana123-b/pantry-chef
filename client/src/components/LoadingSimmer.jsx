import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChefMascot from './ChefMascot';

const CULINARY_MESSAGES = [
  "Auguste is checking your pantry...",
  "Pairing complementary flavors & seasonings...",
  "Balancing cook times and ingredient textures...",
  "Tailoring steps for your kitchen setup...",
  "Finishing appetizing recipe details...",
];

export default function LoadingSimmer() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % CULINARY_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-5">
      {/* Animated Thinking Mascot */}
      <div className="relative flex items-center justify-center">
        <div className="absolute -inset-4 bg-butter/20 rounded-full blur-xl" />
        <ChefMascot mood="thinking" size={130} className="relative z-10" />
      </div>

      {/* Dynamic Status Text */}
      <div className="text-center max-w-sm space-y-1.5">
        <h3 className="font-heading text-xl font-bold text-ink">
          Auguste is checking your pantry...
        </h3>
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm font-medium text-ink-muted"
            >
              {CULINARY_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
