import React from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  Flame,
  Sparkles,
  Layers,
  BookMarked,
  Timer,
  Scale,
  MessageSquareText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  UtensilsCrossed,
} from 'lucide-react';

export default function Landing({ onNavigateHome, onNavigateAuth, user }) {
  return (
    <div className="w-full space-y-16 sm:space-y-24 py-8 sm:py-14">
      {/* 1. Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Story & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tomato/10 border border-tomato/30 text-tomato text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> A Tactile Kitchen Recipe Ledger
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.15]">
              Cook with what you have. <br className="hidden sm:inline" />
              <span className="text-tomato italic">Waste nothing.</span>
            </h1>

            <p className="text-charcoal-muted text-base sm:text-lg leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
              Skip the expensive takeout and grocery store dash. Log whatever lonely ingredients are sitting in your cupboards, and let our culinary AI ledger craft simple, honest, home-cooked recipes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-8 py-4 bg-tomato hover:bg-tomato-hover text-white font-serif font-bold text-lg rounded-2xl shadow-card-elevated transition-all flex items-center justify-center gap-2.5 border-2 border-[#A83E1E]"
              >
                <Flame className="w-5 h-5 text-mustard" />
                <span>Open Kitchen Notebook</span>
              </motion.button>

              {!user || user.isGuest ? (
                <button
                  type="button"
                  onClick={onNavigateAuth}
                  className="w-full sm:w-auto px-6 py-4 bg-[#FAF5E8] hover:bg-[#EFE4CF] text-charcoal font-mono font-bold text-sm rounded-2xl border-2 border-[#D5C4A2] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ChefHat className="w-4 h-4 text-sage" />
                  <span>Chef Login / Register</span>
                </button>
              ) : (
                <div className="text-xs font-mono text-charcoal-muted bg-sage/15 border border-sage/30 px-4 py-3 rounded-xl">
                  Logged in as <strong className="text-charcoal">Chef {user.name}</strong>
                </div>
              )}
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-mono text-charcoal-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sage" /> No Login Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sage" /> Zero Grocery Waste
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sage" /> 100% Free Ledger
              </span>
            </div>
          </motion.div>

          {/* Right Column: Tactile Interactive Visual Card Pile */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            {/* Background Index Card */}
            <div className="w-full max-w-sm bg-[#FAF4E6] border border-[#DDD0B7] rounded-2xl p-6 shadow-card-soft rotate-[-3deg] absolute top-2">
              <div className="h-1 bg-mustard/50 rounded mb-2" />
              <div className="h-4 bg-[#EADDC2] rounded w-2/3 mb-2" />
              <div className="h-3 bg-[#EADDC2] rounded w-full mb-1" />
              <div className="h-3 bg-[#EADDC2] rounded w-4/5" />
            </div>

            {/* Foreground Main Index Card Showcase */}
            <div className="w-full max-w-sm bg-[#FBF7EE] border-2 border-[#E4D7BF] rounded-2xl p-6 shadow-card-elevated relative z-10 rotate-[2deg] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EFE5D1] pb-2">
                <span className="font-mono text-[11px] uppercase tracking-wider font-bold bg-[#F4ECDB] text-charcoal px-2 py-0.5 rounded border border-[#DECFA4]">
                  SAMPLE LEDGER CARD
                </span>
                <span className="font-handwritten text-tomato font-bold text-sm">
                  ★ Chef Approved
                </span>
              </div>

              <div>
                <h4 className="font-serif text-xl font-bold text-charcoal">
                  Rustic Skillet Tomatoes & Eggs
                </h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  A fragrant stovetop reduction marrying fresh cracked eggs with blistered cherry tomatoes and garlic oil.
                </p>
              </div>

              {/* Sample Jar Chips */}
              <div className="flex flex-wrap gap-1.5 py-1">
                {['Eggs', 'Garlic', 'Tomatoes', 'Olive Oil'].map((ing) => (
                  <span
                    key={ing}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF5E8] border border-[#D5C6A6] text-charcoal font-semibold"
                  >
                    🫙 {ing}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-[#EFE5D1] flex items-center justify-between">
                <span className="text-[11px] font-mono text-sage-hover font-bold">
                  ✓ 15-Minute Prep
                </span>
                <div className="border border-tomato/60 text-tomato text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold -rotate-3 bg-tomato/10">
                  ★ STAMPED ★
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Torn Divider */}
      <div className="torn-divider w-full opacity-60" />

      {/* 2. How It Works: 3-Step Recipe Ledger */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="font-handwritten text-2xl text-tomato font-bold">
            The Three-Step Kitchen Flow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal">
            How PantryChef Works
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base max-w-lg mx-auto font-sans">
            A tactile notebook workflow designed to get dinner on the table without stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="bg-[#FAF5E8] border-2 border-[#E3D7BE] rounded-2xl p-6 shadow-card-soft space-y-3 relative group hover:border-tomato/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-tomato/15 text-tomato flex items-center justify-center font-serif text-xl font-bold border border-tomato/30">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Log Your Pantry Jars
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              Type what you have in your cupboards or crisper drawer. Each ingredient snaps into a tactile jar token label.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FAF5E8] border-2 border-[#E3D7BE] rounded-2xl p-6 shadow-card-soft space-y-3 relative group hover:border-mustard/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-mustard/20 text-mustard-hover flex items-center justify-center font-serif text-xl font-bold border border-mustard/40">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Simmer with AI
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              Our Gemini-powered culinary engine crafts 2–3 bespoke recipes respecting dietary preferences and flavor profiles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FAF5E8] border-2 border-[#E3D7BE] rounded-2xl p-6 shadow-card-soft space-y-3 relative group hover:border-sage/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sage/20 text-sage-hover flex items-center justify-center font-serif text-xl font-bold border border-sage/40">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Stamp into Recipe Box
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              Stamp your favorite index cards with animated ink seals and keep them safely stored in your personal recipe box.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Kitchen Tool Station Features */}
      <section className="bg-[#F3EBDD] border-y-2 border-[#E3D7BE] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-charcoal-muted font-bold">
              ★ COOKING UTILITIES ★
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal">
              Everything for the Home Cook
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1 */}
            <div className="bg-[#FAF5E8] p-5 rounded-2xl border border-[#DECFA4] shadow-sm space-y-2.5">
              <div className="p-2.5 rounded-xl bg-tomato/15 text-tomato w-fit border border-tomato/20">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-charcoal text-base">
                AI Sous-Chef Chatbot
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Ask Chef Auguste for substitutions, sauce fixes, cooking temperatures, and flavor pairing advice on the fly.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="bg-[#FAF5E8] p-5 rounded-2xl border border-[#DECFA4] shadow-sm space-y-2.5">
              <div className="p-2.5 rounded-xl bg-sage/20 text-sage-hover w-fit border border-sage/30">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-charcoal text-base">
                Ledger Converter
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Instant calculations for US Cups to Grams, Oven Fahrenheit to Celsius, and emergency baking substitutions.
              </p>
            </div>

            {/* Tool 3 */}
            <div className="bg-[#FAF5E8] p-5 rounded-2xl border border-[#DECFA4] shadow-sm space-y-2.5">
              <div className="p-2.5 rounded-xl bg-mustard/20 text-mustard-hover w-fit border border-mustard/30">
                <Timer className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-charcoal text-base">
                Stovetop Timer
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Built-in countdown timer with culinary presets for boiling eggs, pasta al dente, and pot simmers with audio chime.
              </p>
            </div>

            {/* Tool 4 */}
            <div className="bg-[#FAF5E8] p-5 rounded-2xl border border-[#DECFA4] shadow-sm space-y-2.5">
              <div className="p-2.5 rounded-xl bg-charcoal/10 text-charcoal w-fit border border-charcoal/20">
                <BookMarked className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-charcoal text-base">
                Personal Recipe Box
              </h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Organize, search, and flip through saved recipe cards with interactive step-by-step cooking check-offs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Community Reviews / Stamped Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="font-handwritten text-2xl text-sage font-bold">
            From Home Kitchens Everywhere
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-charcoal">
            Ledger Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="index-card rounded-2xl p-6 bg-[#FAF7EE] border border-[#E4D7BF] space-y-3">
            <span className="text-tomato font-serif text-xl">★★★★★</span>
            <p className="text-xs sm:text-sm text-charcoal italic font-sans leading-relaxed">
              "Saved me from ordering takeout three nights this week. I had only leftover spinach, eggs, and feta, and it gave me a stunning Mediterranean frittata!"
            </p>
            <div className="pt-2 border-t border-[#EFE5D1] flex items-center justify-between text-xs font-mono text-charcoal-muted">
              <span>Chef Clara M.</span>
              <span className="text-sage font-bold">Verified Cook</span>
            </div>
          </div>

          <div className="index-card rounded-2xl p-6 bg-[#FAF7EE] border border-[#E4D7BF] space-y-3">
            <span className="text-tomato font-serif text-xl">★★★★★</span>
            <p className="text-xs sm:text-sm text-charcoal italic font-sans leading-relaxed">
              "The ink-stamp feel and the pocket sous-chef chatbot are delightful. It feels like an authentic cookbook rather than a cold SaaS tool."
            </p>
            <div className="pt-2 border-t border-[#EFE5D1] flex items-center justify-between text-xs font-mono text-charcoal-muted">
              <span>Chef David R.</span>
              <span className="text-sage font-bold">Home Enthusiast</span>
            </div>
          </div>

          <div className="index-card rounded-2xl p-6 bg-[#FAF7EE] border border-[#E4D7BF] space-y-3">
            <span className="text-tomato font-serif text-xl">★★★★★</span>
            <p className="text-xs sm:text-sm text-charcoal italic font-sans leading-relaxed">
              "The built-in timer and measurement converter make cooking right from my phone so enjoyable. I love the fanned recipe cards."
            </p>
            <div className="pt-2 border-t border-[#EFE5D1] flex items-center justify-between text-xs font-mono text-charcoal-muted">
              <span>Chef Maya T.</span>
              <span className="text-sage font-bold">Pantry Explorer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF5E8] border-2 border-[#E3D7BE] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-card-elevated relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-tomato text-white flex items-center justify-center mx-auto shadow-md">
            <ChefHat className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal">
              Ready to see what’s cooking?
            </h3>
            <p className="text-xs sm:text-base text-charcoal-muted font-sans">
              Open your fridge, count your ingredients, and let the kitchen ledger ink your next favorite dinner.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onNavigateHome}
            className="px-8 py-4 bg-tomato hover:bg-tomato-hover text-white font-serif font-bold text-lg rounded-2xl shadow-card-elevated transition-all inline-flex items-center gap-3 border-2 border-[#A83E1E]"
          >
            <span>Start Cooking Now</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
