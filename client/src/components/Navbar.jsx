import React from 'react';
import {
  ChefHat,
  BookMarked,
  UtensilsCrossed,
  Sparkles,
  Timer,
  Scale,
  MessageSquareText,
  Camera,
  Globe,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function Navbar({
  currentTab,
  onSelectTab,
  favoritesCount = 0,
  user,
  onLogout,
  onOpenTimer,
  onOpenConverter,
  onToggleChat,
  onOpenScanner,
  onOpenAllergens,
}) {
  return (
    <header className="w-full bg-[#FAF5E8] border-b-2 border-[#E3D7BE] sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-opacity-95">
      {/* Top vintage paper stripe */}
      <div className="h-1 bg-gradient-to-r from-tomato via-mustard to-sage w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Wordmark with ink-stamp feel */}
        <button
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-tomato flex items-center justify-center text-white shadow-sm border border-tomato-hover group-hover:rotate-6 transition-transform">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Pantry<span className="text-tomato">Chef</span>
              </span>
              <span className="hidden md:inline-block border border-tomato/50 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded text-tomato bg-tomato/10 rotate-[-3deg] font-bold">
                LEDGER
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-handwritten text-charcoal-muted tracking-wide -mt-1 hidden sm:block">
              Cook with what you have
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onSelectTab('landing')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'landing'
                ? 'bg-[#EFE4CF] text-charcoal shadow-inner border border-[#D5C4A2]'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-[#F3EBDB]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-mustard" />
            <span className="font-serif hidden sm:inline">Story</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-[#EFE4CF] text-charcoal shadow-inner border border-[#D5C4A2]'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-[#F3EBDB]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-tomato" />
            <span className="font-serif">Notebook</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('community')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'community'
                ? 'bg-[#EFE4CF] text-charcoal shadow-inner border border-[#D5C4A2]'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-[#F3EBDB]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-mustard" />
            <span className="font-serif">Exchange</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
              currentTab === 'favorites'
                ? 'bg-[#EFE4CF] text-charcoal shadow-inner border border-[#D5C4A2]'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-[#F3EBDB]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-sage" />
            <span className="font-serif hidden sm:inline">Recipe Box</span>
            {favoritesCount > 0 && (
              <span className="bg-tomato text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Station: Quick Utility Toolbar Triggers & Auth */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Quick Toolbar Tool Icons */}
          <div className="hidden lg:flex items-center gap-1 border-r border-[#E3D7BE] pr-2">
            <button
              onClick={onOpenScanner}
              className="p-2 rounded-lg text-charcoal-muted hover:text-tomato hover:bg-[#EFE4CF] transition-colors"
              title="Smart Photo Scanner"
            >
              <Camera className="w-4 h-4 text-tomato" />
            </button>
            <button
              onClick={onOpenAllergens}
              className="p-2 rounded-lg text-charcoal-muted hover:text-sage hover:bg-[#EFE4CF] transition-colors"
              title="Allergen Safety Profile"
            >
              <ShieldCheck className="w-4 h-4 text-sage" />
            </button>
            <button
              onClick={onOpenTimer}
              className="p-2 rounded-lg text-charcoal-muted hover:text-mustard hover:bg-[#EFE4CF] transition-colors"
              title="Kitchen Timer"
            >
              <Timer className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenConverter}
              className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-[#EFE4CF] transition-colors"
              title="Measurement Converter"
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleChat}
              className="p-2 rounded-lg text-charcoal-muted hover:text-tomato hover:bg-[#EFE4CF] transition-colors"
              title="Sous-Chef AI"
            >
              <MessageSquareText className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile / Auth State */}
          {user && !user.isGuest ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-serif font-bold text-charcoal leading-none">
                  Chef {user.name}
                </span>
                <span className="text-[10px] font-mono text-charcoal-muted leading-tight">
                  {user.chefTitle || 'Executive Home Chef'}
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl bg-[#F3EBDB] hover:bg-tomato/15 hover:text-tomato text-charcoal-muted border border-[#DECFA4] transition-colors flex items-center gap-1 text-xs"
                title="Sign out of Chef Ledger"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelectTab('auth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                currentTab === 'auth'
                  ? 'bg-tomato text-white border-tomato'
                  : 'bg-[#F4ECDB] text-charcoal hover:bg-tomato/15 hover:text-tomato border-[#DECFA4]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-tomato" />
              <span>Chef Pass</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
