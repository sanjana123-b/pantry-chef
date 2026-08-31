import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CULINARY_MESSAGES = [
  "Rummaging through your pantry staples...",
  "Consulting the vintage recipe ledger...",
  "Pairing complimentary flavors & spices...",
  "Simmering savory ideas on low heat...",
  "Hand-inking the recipe index cards...",
  "Drafting step-by-step cooking steps...",
];

export default function LoadingSimmer() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % CULINARY_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Simmering Pot Illustration */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Steam Lines Rising */}
        <div className="absolute -top-4 flex gap-3">
          <motion.div
            animate={{
              y: [-2, -26, -38],
              opacity: [0, 0.8, 0],
              scaleX: [0.8, 1.2, 1.6],
              x: [-2, 4, -4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
            className="w-1.5 h-10 rounded-full bg-sage/60 blur-[0.5px]"
          />
          <motion.div
            animate={{
              y: [0, -32, -48],
              opacity: [0, 0.9, 0],
              scaleX: [1, 1.3, 1.8],
              x: [0, -6, 6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="w-2 h-12 rounded-full bg-tomato/50 blur-[0.5px]"
          />
          <motion.div
            animate={{
              y: [-2, -28, -42],
              opacity: [0, 0.8, 0],
              scaleX: [0.8, 1.4, 1.5],
              x: [2, 6, -3],
            }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.1,
            }}
            className="w-1.5 h-11 rounded-full bg-mustard/60 blur-[0.5px]"
          />
        </div>

        {/* Cookware SVG */}
        <svg
          viewBox="0 0 120 100"
          className="w-28 h-28 text-charcoal filter drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Pot Lid Handle */}
          <path d="M 52 32 C 52 26, 68 26, 68 32" strokeWidth="4" />
          
          {/* Pot Lid (Slightly tilted up to let steam escape) */}
          <motion.g
            animate={{
              rotate: [-2, 3, -1, 2, -2],
              y: [0, -2, 0, -1, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "20px 38px" }}
          >
            <path
              d="M 22 38 Q 60 28 98 38 L 94 42 Q 60 34 26 42 Z"
              fill="#FAF4E6"
              stroke="#2B2320"
              strokeWidth="3.5"
            />
          </motion.g>

          {/* Pot Body */}
          <path
            d="M 24 44 L 28 82 Q 30 92 60 92 Q 90 92 92 82 L 96 44"
            fill="#FAF4E6"
            stroke="#2B2320"
            strokeWidth="3.5"
          />

          {/* Pot Handles */}
          <path d="M 24 54 C 12 54 12 66 26 66" strokeWidth="3.5" fill="none" />
          <path d="M 96 54 C 108 54 108 66 94 66" strokeWidth="3.5" fill="none" />

          {/* Pot Decorative Band */}
          <path d="M 29 58 L 91 58" stroke="#C1502E" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>

        {/* Simmering Flame / Heat Glow */}
        <motion.div
          animate={{
            scale: [0.95, 1.1, 0.95],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1 w-20 h-4 bg-mustard/40 rounded-full blur-sm -z-10"
        />
      </div>

      {/* Dynamic Status Text */}
      <div className="mt-6 text-center max-w-sm">
        <span className="inline-block font-handwritten text-xl text-tomato font-bold tracking-wide mb-1">
          Simmering on the stove...
        </span>
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="text-sm font-medium text-charcoal/80 italic font-sans"
            >
              "{CULINARY_MESSAGES[messageIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
