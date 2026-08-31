import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X, BellRing, Flame } from 'lucide-react';

const PRESETS = [
  { label: '3 min (Eggs)', seconds: 180 },
  { label: '5 min (Simmer)', seconds: 300 },
  { label: '8 min (Pasta)', seconds: 480 },
  { label: '12 min (Skillet)', seconds: 720 },
  { label: '20 min (Bake)', seconds: 1200 },
  { label: '30 min (Roast)', seconds: 1800 },
];

// Web Audio API beep
function playChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.log('Audio chime error:', e);
  }
}

export default function KitchenTimerModal({ isOpen, onClose }) {
  const [timeLeft, setTimeLeft] = useState(300); // default 5m
  const [initialTime, setInitialTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('5 min (Simmer)');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playChime();
      alert('⏰ Ding! Your kitchen timer has finished!');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const selectPreset = (preset) => {
    setIsRunning(false);
    setTimeLeft(preset.seconds);
    setInitialTime(preset.seconds);
    setTimerLabel(preset.label);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-2xl p-6 shadow-card-elevated relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E4D7BF]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-tomato/15 text-tomato border border-tomato/30">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Kitchen Stovetop Timer
              </h3>
              <span className="text-xs font-mono text-charcoal-muted">
                {timerLabel}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-tomato hover:bg-tomato/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Display Clock */}
        <div className="bg-[#F3EBDB] border-2 border-[#D5C4A2] rounded-2xl p-6 text-center shadow-inner relative overflow-hidden mb-6">
          <div
            className="absolute bottom-0 left-0 top-0 bg-sage/20 transition-all duration-1000 -z-0"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="relative z-10">
            <span className="font-mono text-5xl font-extrabold text-charcoal tracking-widest">
              {formatTime(timeLeft)}
            </span>
            <p className="font-handwritten text-lg text-tomato font-bold mt-1">
              {isRunning ? '🔥 Simmering away...' : timeLeft === 0 ? '✨ Done!' : 'Ready to cook'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-xl font-serif font-bold text-white shadow-md flex items-center gap-2 ${
              isRunning ? 'bg-mustard hover:bg-mustard-hover' : 'bg-tomato hover:bg-tomato-hover'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Start Timer
              </>
            )}
          </motion.button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-[#EFE4CF] text-charcoal hover:bg-[#E5D7BE] border border-[#D5C4A2] transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold block mb-2">
            ★ Culinary Presets:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`text-xs font-mono p-2 rounded-lg border text-center transition-all ${
                  timerLabel === preset.label
                    ? 'bg-sage/20 border-sage text-sage-hover font-bold'
                    : 'bg-[#FAF6EE] border-[#DDD2BE] text-charcoal-muted hover:text-charcoal hover:border-charcoal/40'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
