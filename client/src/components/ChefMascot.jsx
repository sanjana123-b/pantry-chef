import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated Chef Auguste Mascot Component
 * @param {'idle' | 'thinking' | 'cheer'} mood - Mascot mood
 * @param {number | 'sm' | 'md' | 'lg' | 'xl'} size - Size in px or preset
 * @param {string} className - Optional container styling
 */
export default function ChefMascot({ mood = 'idle', size = 'md', className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 140,
    xl: 220,
  };

  const width = typeof size === 'number' ? size : sizeMap[size] || 100;
  const height = Math.round(width * (200 / 160));

  // Base container animation based on mood
  const bodyVariants = {
    idle: {
      y: shouldReduceMotion ? 0 : [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    thinking: {
      rotate: shouldReduceMotion ? 0 : [0, -5, 0],
      y: shouldReduceMotion ? 0 : [0, -2, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    cheer: {
      y: shouldReduceMotion ? 0 : [0, -14, 0],
      scale: shouldReduceMotion ? 1 : [1, 1.06, 1],
      transition: {
        duration: 0.65,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Eye blinking animation
  const eyeBlinkVariants = {
    idle: {
      scaleY: shouldReduceMotion ? 1 : [1, 1, 0.1, 1, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        times: [0, 0.85, 0.9, 0.95, 1],
      },
    },
    thinking: {
      scaleY: 1,
    },
    cheer: {
      scaleY: 1,
    },
  };

  // Left Arm Animation
  const leftArmVariants = {
    idle: {
      rotate: shouldReduceMotion ? 0 : [0, -4, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      rotate: shouldReduceMotion ? -25 : [-20, -35, -20],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
    },
    cheer: {
      rotate: shouldReduceMotion ? -65 : [-55, -75, -55],
      transition: { duration: 0.65, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  // Right Arm Animation
  const rightArmVariants = {
    idle: {
      rotate: shouldReduceMotion ? 0 : [0, 4, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      // Stirring motion
      rotate: shouldReduceMotion ? 25 : [15, 35, 15],
      y: shouldReduceMotion ? 0 : [0, -4, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    cheer: {
      rotate: shouldReduceMotion ? 65 : [55, 75, 55],
      transition: { duration: 0.65, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      variants={bodyVariants}
      animate={mood}
      className={`inline-block select-none ${className}`}
      style={{ width, height }}
      aria-label={`Chef Auguste Mascot (${mood})`}
      role="img"
    >
      <svg
        viewBox="0 0 160 200"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* --- CHEF HAT (3 circles + 1 rect band) --- */}
        <g id="chef-hat" filter="url(#soft-shadow)">
          {/* Left puff */}
          <circle cx="56" cy="46" r="24" fill="#FFFFFF" stroke="#E3D7BE" strokeWidth="2" />
          {/* Right puff */}
          <circle cx="104" cy="46" r="24" fill="#FFFFFF" stroke="#E3D7BE" strokeWidth="2" />
          {/* Top center puff */}
          <circle cx="80" cy="34" r="28" fill="#FFFFFF" stroke="#E3D7BE" strokeWidth="2" />
          {/* Fill center cover to hide overlapping internal borders */}
          <circle cx="80" cy="45" r="22" fill="#FFFFFF" />
          {/* Hat band rectangle */}
          <rect
            x="48"
            y="56"
            width="64"
            height="18"
            rx="5"
            fill="#FFFFFF"
            stroke="#E3D7BE"
            strokeWidth="2"
          />
          {/* Cute red accent ribbon on hat band */}
          <line x1="50" y1="70" x2="110" y2="70" stroke="#E8452C" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* --- BODY / COAT --- */}
        <g id="chef-coat" filter="url(#soft-shadow)">
          {/* White coat body */}
          <path
            d="M 52 128 L 40 188 C 40 192 44 195 48 195 L 112 195 C 116 195 120 192 120 188 L 108 128 Z"
            fill="#FFFFFF"
            stroke="#E3D7BE"
            strokeWidth="2"
          />
          {/* Two Tomato-red coat buttons */}
          <circle cx="80" cy="154" r="4.5" fill="#E8452C" />
          <circle cx="80" cy="174" r="4.5" fill="#E8452C" />
          {/* Red neckerchief accent */}
          <path d="M 66 128 L 80 142 L 94 128 Z" fill="#E8452C" />
        </g>

        {/* --- ARMS --- */}
        {/* Left Arm (viewer's left) */}
        <motion.g
          id="left-arm"
          variants={leftArmVariants}
          animate={mood}
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'top center',
          }}
        >
          <rect
            x="30"
            y="132"
            width="16"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke="#E3D7BE"
            strokeWidth="2"
          />
          {/* Little skin hand */}
          <circle cx="38" cy="178" r="7" fill="#FCD5B5" stroke="#E3D7BE" strokeWidth="1.5" />
        </motion.g>

        {/* Right Arm (viewer's right) */}
        <motion.g
          id="right-arm"
          variants={rightArmVariants}
          animate={mood}
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'top center',
          }}
        >
          <rect
            x="114"
            y="132"
            width="16"
            height="44"
            rx="8"
            fill="#FFFFFF"
            stroke="#E3D7BE"
            strokeWidth="2"
          />
          {/* Little skin hand */}
          <circle cx="122" cy="178" r="7" fill="#FCD5B5" stroke="#E3D7BE" strokeWidth="1.5" />
          {/* Wooden spoon when thinking/cooking */}
          {mood === 'thinking' && (
            <g id="wooden-spoon">
              <line x1="122" y1="178" x2="136" y2="198" stroke="#B8860B" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="138" cy="200" rx="6" ry="4" fill="#CD853F" />
            </g>
          )}
        </motion.g>

        {/* --- HEAD & FACE --- */}
        <g id="chef-head">
          {/* Skin-tone face circle */}
          <circle
            cx="80"
            cy="98"
            r="32"
            fill="#FCD5B5"
            stroke="#E3D7BE"
            strokeWidth="1.5"
          />

          {/* Rosy blush cheeks */}
          <circle cx="62" cy="106" r="5" fill="#FCA5A5" opacity="0.6" />
          <circle cx="98" cy="106" r="5" fill="#FCA5A5" opacity="0.6" />

          {/* Cute little button nose */}
          <circle cx="80" cy="98" r="2.5" fill="#F8B195" />

          {/* French Moustache */}
          <path
            d="M 68 104 C 74 100 78 105 80 102 C 82 105 86 100 92 104 C 86 108 81 106 80 105 C 79 106 74 108 68 104 Z"
            fill="#734F35"
          />

          {/* Blinking Eyes */}
          <motion.g
            id="eyes"
            variants={eyeBlinkVariants}
            animate={mood}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center center',
            }}
          >
            {mood === 'cheer' ? (
              // Joyful closed curved eyes (smiling ^_^)
              <>
                <path
                  d="M 62 90 Q 67 84 72 90"
                  stroke="#1F1B16"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 88 90 Q 93 84 98 90"
                  stroke="#1F1B16"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            ) : mood === 'thinking' ? (
              // Curious glancing eyes
              <>
                <circle cx="67" cy="88" r="3.5" fill="#1F1B16" />
                <circle cx="68" cy="86" r="1.2" fill="#FFFFFF" />
                <circle cx="93" cy="88" r="3.5" fill="#1F1B16" />
                <circle cx="94" cy="86" r="1.2" fill="#FFFFFF" />
                {/* Thinking raised eyebrow */}
                <path
                  d="M 63 81 Q 68 78 73 82"
                  stroke="#734F35"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 87 83 Q 92 78 97 80"
                  stroke="#734F35"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Normal friendly sparkling eyes
              <>
                <circle cx="67" cy="89" r="3.5" fill="#1F1B16" />
                <circle cx="68.5" cy="87.5" r="1.2" fill="#FFFFFF" />
                <circle cx="93" cy="89" r="3.5" fill="#1F1B16" />
                <circle cx="94.5" cy="87.5" r="1.2" fill="#FFFFFF" />
              </>
            )}
          </motion.g>

          {/* Mouth that changes with mood */}
          <g id="mouth">
            {mood === 'cheer' ? (
              // Big open happy smile
              <path
                d="M 72 110 Q 80 124 88 110 Z"
                fill="#E8452C"
                stroke="#1F1B16"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            ) : mood === 'thinking' ? (
              // Curious pursed mouth
              <circle cx="80" cy="111" r="2.5" fill="#1F1B16" />
            ) : (
              // Gentle warm smile
              <path
                d="M 72 109 Q 80 116 88 109"
                stroke="#1F1B16"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
