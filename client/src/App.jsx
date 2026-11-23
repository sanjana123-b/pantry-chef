import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Community from './pages/Community';
import Auth from './pages/Auth';
import KitchenTimerModal from './components/KitchenTimerModal';
import ConverterModal from './components/ConverterModal';
import ChatbotDrawer from './components/ChatbotDrawer';
import PhotoScannerModal from './components/PhotoScannerModal';
import AllergenSettingsModal from './components/AllergenSettingsModal';
import GroceryGapModal from './components/GroceryGapModal';
import ToolDock from './components/ToolDock';
import {
  getFavorites,
  saveFavorite,
  getCurrentChef,
  logoutChef,
  publishCommunityRecipe,
} from './api/client';

export default function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [user, setUser] = useState({
    name: 'Guest Cook',
    chefTitle: 'Pantry Explorer',
    isGuest: true,
  });

  // Dark Theme Management (persisted in localStorage + system preference fallback)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pantrychef_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pantrychef_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Allergen & Dietary Safety Profile (persisted)
  const [allergenProfile, setAllergenProfile] = useState(() => {
    const saved = localStorage.getItem('pantrychef_allergens');
    return saved ? JSON.parse(saved) : { allergens: [], diets: [] };
  });

  // Modal & Tool states
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAllergensOpen, setIsAllergensOpen] = useState(false);
  const [isGroceryGapOpen, setIsGroceryGapOpen] = useState(false);
  const [groceryGapRecipe, setGroceryGapRecipe] = useState(null);

  const fetchChefUser = async () => {
    try {
      const chef = await getCurrentChef();
      if (chef) {
        setUser(chef);
      }
    } catch (err) {
      console.warn('Could not fetch current chef session:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      setIsLoadingFavorites(true);
      const data = await getFavorites();
      setFavorites(data || []);
    } catch (err) {
      console.warn('Could not fetch favorites on load:', err);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  useEffect(() => {
    fetchChefUser();
    fetchFavorites();
  }, []);

  const handleUpdateAllergens = (newProfile) => {
    setAllergenProfile(newProfile);
    localStorage.setItem('pantrychef_allergens', JSON.stringify(newProfile));
  };

  const handleLogout = async () => {
    try {
      await logoutChef();
      setUser({
        name: 'Guest Cook',
        chefTitle: 'Pantry Explorer',
        isGuest: true,
      });
      fetchFavorites();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    fetchFavorites();
    setCurrentTab('home');
  };

  const handleSaveToPersonalFavorites = async (recipe) => {
    try {
      await saveFavorite({
        ingredients: recipe.ingredients || [],
        recipeTitle: recipe.recipeTitle || recipe.title,
        recipeDescription: recipe.recipeDescription || recipe.description,
        recipeSteps: recipe.recipeSteps || recipe.steps,
      });
      fetchFavorites();
    } catch (err) {
      console.error('Failed to import community recipe:', err);
    }
  };

  const handlePublishToCommunity = async (recipe) => {
    return await publishCommunityRecipe({
      authorName: user?.name || 'Home Cook',
      authorTitle: user?.chefTitle || 'Pantry Explorer',
      recipeTitle: recipe.title || recipe.recipeTitle,
      recipeDescription: recipe.description || recipe.recipeDescription,
      ingredients: recipe.ingredients || [],
      recipeSteps: recipe.steps || recipe.recipeSteps || [],
    });
  };

  const handleOpenGroceryGap = (recipe) => {
    setGroceryGapRecipe(recipe);
    setIsGroceryGapOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans selection:bg-butter/30 selection:text-ink transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        favoritesCount={favorites.length}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Pages with AnimatePresence page transitions */}
      <main className="flex-1 pb-16 md:pb-6">
        <AnimatePresence mode="wait">
          {currentTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Landing
                user={user}
                onNavigateHome={() => setCurrentTab('home')}
                onNavigateAuth={() => setCurrentTab('auth')}
              />
            </motion.div>
          )}

          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Home
                favorites={favorites}
                onRefreshFavorites={fetchFavorites}
                onOpenTimer={() => setIsTimerOpen(true)}
                onOpenConverter={() => setIsConverterOpen(true)}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
                onOpenScanner={() => setIsScannerOpen(true)}
                onOpenAllergens={() => setIsAllergensOpen(true)}
                onOpenGroceryGap={handleOpenGroceryGap}
                onPublishCommunity={handlePublishToCommunity}
                allergenProfile={allergenProfile}
                isChatOpen={isChatOpen}
              />
            </motion.div>
          )}

          {currentTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Community
                user={user}
                onSaveToPersonalFavorites={handleSaveToPersonalFavorites}
              />
            </motion.div>
          )}

          {currentTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Favorites
                favorites={favorites}
                isLoading={isLoadingFavorites}
                onRefreshFavorites={fetchFavorites}
                onNavigateHome={() => setCurrentTab('home')}
              />
            </motion.div>
          )}

          {currentTab === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Auth
                onAuthSuccess={handleAuthSuccess}
                onContinueAsGuest={() => setCurrentTab('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Tool Dock (Desktop) & Bottom Tab Bar (Mobile) */}
      <ToolDock
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAllergens={() => setIsAllergensOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Interactive Kitchen Modals */}
      <KitchenTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      <ConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />

      <PhotoScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddIngredients={(scannedList) => {
          setCurrentTab('home');
          // Dispatch or handle in Home via direct pass if needed
        }}
      />

      <AllergenSettingsModal
        isOpen={isAllergensOpen}
        onClose={() => setIsAllergensOpen(false)}
        allergenProfile={allergenProfile}
        onUpdateProfile={handleUpdateAllergens}
      />

      <GroceryGapModal
        isOpen={isGroceryGapOpen}
        onClose={() => setIsGroceryGapOpen(false)}
        recipe={groceryGapRecipe}
        pantryIngredients={[]}
      />

      {/* Floating AI Sous-Chef Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />

      {/* Clean modern footer */}
      <footer className="mt-16 border-t border-paper-border bg-paper py-8 text-center text-xs text-ink-muted">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-1.5 font-heading text-sm text-ink font-bold">
            <span>PantryChef</span>
            <span className="text-tomato">•</span>
            <span className="text-xs text-ink-muted font-normal">Cook with what you have</span>
          </div>
          <p className="text-xs text-ink-muted">
            Simple home cooking, less grocery waste, better everyday meals.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-ink-muted">
            <button onClick={() => setCurrentTab('landing')} className="hover:text-tomato transition-colors cursor-pointer">
              Home
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('home')} className="hover:text-tomato transition-colors cursor-pointer">
              Pantry
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('community')} className="hover:text-tomato transition-colors cursor-pointer">
              Community
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('favorites')} className="hover:text-tomato transition-colors cursor-pointer">
              My Recipes ({favorites.length})
            </button>
            <span>•</span>
            <button onClick={() => setIsScannerOpen(true)} className="hover:text-tomato transition-colors cursor-pointer">
              Photo Scanner
            </button>
            <span>•</span>
            <button onClick={() => setIsAllergensOpen(true)} className="hover:text-tomato transition-colors cursor-pointer">
              Dietary Profile
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
