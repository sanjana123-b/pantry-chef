import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Sparkles,
  Layers,
  BookMarked,
  Timer,
  Scale,
  MessageSquareText,
  CheckCircle2,
  ArrowRight,
  UtensilsCrossed,
  Clock,
  Flame,
  Lightbulb,
} from 'lucide-react';
import ChefMascot from '../components/ChefMascot';

const CHEF_TIPS = [
  "Got limp carrots or celery? Soak them in ice water for 20 minutes to restore snap!",
  "Save Parmesan rinds in your freezer to drop into simmering soups and stews for umami.",
  "Pasta water is liquid gold—reserve 1/2 cup before draining to make your sauce silky.",
  "Over-salted a soup? A splash of cream or raw potato slices simmered for 10 min will balance it.",
  "Freeze leftover chopped herbs in olive oil inside an ice cube tray for quick sauté flavor.",
];

export default function Landing({ onNavigateHome, onNavigateAuth, user }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CHEF_TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-full space-y-16 sm:space-y-24 py-6 sm:py-12">
      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tomato/10 text-tomato text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Home Cooking Assistant</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.12]">
              Cook with what you have. <br className="hidden sm:inline" />
              <span className="text-tomato">Waste nothing.</span>
            </h1>

            <p className="text-ink-muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Skip the takeout and grocery store runs. Enter whatever ingredients are sitting in your fridge or cupboards, and let our culinary assistant suggest simple, delicious meals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-7 py-3.5 bg-tomato hover:bg-tomato-hover text-white font-semibold text-base rounded-btn shadow-card-soft transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-butter" />
                <span>Open Pantry</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {!user || user.isGuest ? (
                <button
                  type="button"
                  onClick={onNavigateAuth}
                  className="w-full sm:w-auto px-6 py-3.5 bg-paper hover:bg-paper-muted text-ink font-semibold text-sm rounded-btn border border-paper-border transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <ChefHat className="w-4 h-4 text-basil" />
                  <span>Sign In / Register</span>
                </button>
              ) : (
                <div className="text-xs text-ink-muted bg-basil/10 border border-basil/20 px-4 py-3 rounded-btn">
                  Welcome back, <strong className="text-ink">{user.name}</strong>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-basil" /> No signup required
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-basil" /> Reduce food waste
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-basil" /> Personalized for your diet
              </span>
            </div>
          </motion.div>

          {/* Right Column: Big Idle Mascot with Rotating Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 relative flex flex-col items-center justify-center pt-6 lg:pt-0"
          >
            {/* Rotating Speech Bubble */}
            <div className="relative mb-4 w-full max-w-sm">
              <div className="bg-paper-card border border-paper-border rounded-card p-4 shadow-card-soft relative">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-tomato">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Chef Auguste's Kitchen Tip</span>
                </div>
                <div className="h-14 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={tipIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="text-xs sm:text-sm text-ink leading-relaxed"
                    >
                      "{CHEF_TIPS[tipIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
                {/* Speech bubble tail pointing down towards the mascot */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-paper-card border-r border-b border-paper-border rotate-45" />
              </div>
            </div>

            {/* Chef Auguste Mascot */}
            <div className="relative flex justify-center items-center">
              <div className="absolute -inset-4 bg-butter/20 rounded-full blur-2xl opacity-60" />
              <ChefMascot mood="idle" size={200} className="relative z-10" />
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-ink-muted">
                Chef Auguste • Your Kitchen Sous-Chef
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. How It Works (Clean 3-step illustrated section) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-tomato">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink">
            How PantryChef Works
          </h2>
          <p className="text-ink-muted text-sm sm:text-base max-w-lg mx-auto">
            Turn mismatched ingredients into satisfying meals in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="bg-paper-card border border-paper-border rounded-card p-6 shadow-card-soft space-y-3 relative group hover:border-tomato transition-colors">
            <div className="w-12 h-12 rounded-xl bg-tomato/10 text-tomato flex items-center justify-center font-heading text-lg font-bold">
              01
            </div>
            <h3 className="font-heading text-xl font-bold text-ink">
              Add what you have
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Type or photo-scan whatever is in your fridge or pantry. Categorize staples, add quantities, or track expiration dates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-paper-card border border-paper-border rounded-card p-6 shadow-card-soft space-y-3 relative group hover:border-butter transition-colors">
            <div className="w-12 h-12 rounded-xl bg-butter/20 text-butter-hover flex items-center justify-center font-heading text-lg font-bold">
              02
            </div>
            <h3 className="font-heading text-xl font-bold text-ink">
              Get recipes
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Our culinary assistant instantly generates recipes matching your ingredients, dietary constraints, and preferred cook time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-paper-card border border-paper-border rounded-card p-6 shadow-card-soft space-y-3 relative group hover:border-basil transition-colors">
            <div className="w-12 h-12 rounded-xl bg-basil/15 text-basil flex items-center justify-center font-heading text-lg font-bold">
              03
            </div>
            <h3 className="font-heading text-xl font-bold text-ink">
              Cook step by step
            </h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Follow guided cook mode with timers and portion scaling, save your favorites to My Recipes, and share with the community.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Dark Plum Section: Kitchen Utilities (Alternates light and dark for depth) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-plum text-paper rounded-card p-8 sm:p-12 space-y-10 shadow-card-elevated">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-butter">
              Kitchen Utilities
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Everything for the Home Cook
            </h2>
            <p className="text-plum-paper text-sm max-w-lg mx-auto">
              Smart tools built right into your workflow so you never have to leave the page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1 */}
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-card border border-white/10 space-y-2.5">
              <div className="p-2.5 rounded-xl bg-tomato text-white w-fit shadow-sm">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">
                Sous-Chef Chatbot
              </h4>
              <p className="text-xs text-plum-paper leading-relaxed">
                Ask Chef Auguste for substitutions, sauce fixes, cooking temperatures, and flavor pairing advice on the fly.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-card border border-white/10 space-y-2.5">
              <div className="p-2.5 rounded-xl bg-basil text-white w-fit shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">
                Measurement Converter
              </h4>
              <p className="text-xs text-plum-paper leading-relaxed">
                Instant calculations for US Cups to Grams, Oven Fahrenheit to Celsius, and emergency baking substitutions.
              </p>
            </div>

            {/* Tool 3 */}
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-card border border-white/10 space-y-2.5">
              <div className="p-2.5 rounded-xl bg-butter text-ink w-fit shadow-sm">
                <Timer className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">
                Kitchen Timer
              </h4>
              <p className="text-xs text-plum-paper leading-relaxed">
                Built-in countdown timer with presets for boiling eggs, pasta al dente, and pot simmers with audio alerts.
              </p>
            </div>

            {/* Tool 4 */}
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-card border border-white/10 space-y-2.5">
              <div className="p-2.5 rounded-xl bg-paper text-ink w-fit shadow-sm">
                <BookMarked className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">
                My Recipes
              </h4>
              <p className="text-xs text-plum-paper leading-relaxed">
                Save, search, and scale your favorite recipes with interactive step-by-step cooking progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-paper-card border border-paper-border rounded-card p-8 sm:p-12 text-center space-y-5 shadow-card-elevated">
          <div className="w-14 h-14 rounded-2xl bg-tomato/10 text-tomato flex items-center justify-center mx-auto">
            <ChefHat className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink">
              Ready to see what’s cooking?
            </h3>
            <p className="text-sm text-ink-muted">
              Check your kitchen, add your ingredients, and discover your next meal.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onNavigateHome}
            className="px-8 py-3.5 bg-tomato hover:bg-tomato-hover text-white font-semibold text-base rounded-btn shadow-card-soft transition-all inline-flex items-center gap-2.5 cursor-pointer"
          >
            <span>Start Cooking Now</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
