import React from 'react';
import {
  ChefHat,
  BookMarked,
  UtensilsCrossed,
  Sparkles,
  Globe,
  User,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar({
  currentTab,
  onSelectTab,
  favoritesCount = 0,
  user,
  onLogout,
  theme,
  onToggleTheme,
}) {
  return (
    <header className="w-full bg-paper/95 border-b border-paper-border sticky top-0 z-40 backdrop-blur-md shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Wordmark */}
        <button
          onClick={() => onSelectTab('landing')}
          aria-label="PantryChef Home"
          className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none flex-shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-tomato flex items-center justify-center text-white shadow-sm border border-tomato-hover group-hover:rotate-6 transition-transform">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="font-heading text-xl sm:text-2xl font-black text-ink tracking-tight">
              Pantry<span className="text-tomato">Chef</span>
            </span>
            <p className="text-[11px] text-ink-muted tracking-tight -mt-0.5 hidden sm:block">
              Cook with what you have
            </p>
          </div>
        </button>

        {/* Four Main Navigation Tabs */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1"
        >
          <button
            type="button"
            onClick={() => onSelectTab('landing')}
            aria-label="Go to Home"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'landing'
                ? 'bg-paper-muted text-ink shadow-sm border border-paper-border'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-butter" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('home')}
            aria-label="Go to Pantry"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-paper-muted text-ink shadow-sm border border-paper-border'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-tomato" />
            <span>Pantry</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('favorites')}
            aria-label={`Go to My Recipes, ${favoritesCount} recipes saved`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
              currentTab === 'favorites'
                ? 'bg-paper-muted text-ink shadow-sm border border-paper-border'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-basil" />
            <span>My Recipes</span>
            {favoritesCount > 0 && (
              <span className="bg-tomato text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('community')}
            aria-label="Go to Community"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'community'
                ? 'bg-paper-muted text-ink shadow-sm border border-paper-border'
                : 'text-ink-muted hover:text-ink hover:bg-paper-muted'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-butter" />
            <span>Community</span>
          </button>
        </nav>

        {/* Right Station: Dark Mode Toggle & Auth */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-btn text-ink-muted hover:text-ink hover:bg-paper-muted transition-colors cursor-pointer border border-paper-border"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-butter" />
            ) : (
              <Moon className="w-4 h-4 text-plum" />
            )}
          </button>

          {/* User Profile / Auth State */}
          {user && !user.isGuest ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-ink leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-ink-muted leading-tight">
                  {user.chefTitle || 'Home Chef'}
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                aria-label="Sign out"
                className="p-2 rounded-btn bg-paper hover:bg-tomato/10 hover:text-tomato text-ink-muted border border-paper-border transition-colors flex items-center gap-1 text-xs cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelectTab('auth')}
              aria-label="Sign in or register"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-semibold transition-all border cursor-pointer ${
                currentTab === 'auth'
                  ? 'bg-tomato text-white border-tomato'
                  : 'bg-paper-muted text-ink hover:bg-tomato/15 hover:text-tomato border-paper-border'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-tomato" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
