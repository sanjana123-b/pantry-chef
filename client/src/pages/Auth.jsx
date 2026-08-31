import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginChef, registerChef } from '../api/client';

export default function Auth({ onAuthSuccess, onContinueAsGuest }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    chefTitle: 'Executive Home Chef',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await loginChef({
          email: formData.email,
          password: formData.password,
        });
        if (onAuthSuccess) {
          onAuthSuccess(res.user);
        }
      } else {
        const res = await registerChef(formData);
        if (onAuthSuccess) {
          onAuthSuccess(res.user);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      {/* Chef's Badge Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-3xl p-6 sm:p-8 shadow-card-elevated relative overflow-hidden"
      >
        {/* Top Decorative Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-tomato via-mustard to-sage" />

        {/* Badge Header */}
        <div className="text-center space-y-2 mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-tomato text-white flex items-center justify-center mx-auto shadow-md border-2 border-[#A83E1E]">
            <ChefHat className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            {isLogin ? 'Chef Ledger Sign In' : 'Register Kitchen Pass'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans">
            {isLogin
              ? 'Access your private recipe box & kitchen notes'
              : 'Create your personalized culinary ledger account'}
          </p>
        </div>

        {/* Form Mode Toggle */}
        <div className="flex bg-[#EFE5CF] p-1 rounded-xl border border-[#DECFA4] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              isLogin
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              !isLogin
                ? 'bg-[#FAF5E8] text-charcoal shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            New Chef Pass
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-tomato/10 border border-tomato/30 text-tomato text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                  Chef Full Name:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Auguste Gusteau"
                    className="w-full bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-sm focus:outline-none focus:border-tomato font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
                  Kitchen Specialty / Title:
                </label>
                <input
                  type="text"
                  value={formData.chefTitle}
                  onChange={(e) => setFormData({ ...formData, chefTitle: e.target.value })}
                  placeholder="e.g. Weekend Pasta Artisan, Home Cook"
                  className="w-full bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-sm focus:outline-none focus:border-tomato font-medium"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="chef@pantrychef.kitchen"
                className="w-full bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-sm focus:outline-none focus:border-tomato font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-muted font-bold mb-1">
              Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-sm focus:outline-none focus:border-tomato font-medium"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-tomato hover:bg-tomato-hover disabled:opacity-50 text-white font-serif font-bold text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-[#A83E1E]"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isLogin ? 'Sign Into Ledger' : 'Create Chef Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DECFA4]" />
          </div>
          <span className="relative bg-[#FAF5E8] px-3 text-xs font-mono uppercase tracking-wider text-charcoal-muted">
            OR
          </span>
        </div>

        {/* Guest Mode Action */}
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="w-full py-2.5 bg-[#FAF7EE] hover:bg-[#EFE4CF] text-charcoal font-sans text-xs font-semibold rounded-xl border border-[#D5C4A2] transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-mustard" />
          <span>Continue Instantly as Guest Cook</span>
        </button>
      </motion.div>
    </div>
  );
}
