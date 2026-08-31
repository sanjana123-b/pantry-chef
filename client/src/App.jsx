import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#2B2320] font-sans selection:bg-mustard/30 selection:text-charcoal">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        favoritesCount={favorites.length}
        user={user}
        onLogout={handleLogout}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAllergens={() => setIsAllergensOpen(true)}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <Landing
            user={user}
            onNavigateHome={() => setCurrentTab('home')}
            onNavigateAuth={() => setCurrentTab('auth')}
          />
        )}

        {currentTab === 'home' && (
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
        )}

        {currentTab === 'community' && (
          <Community
            user={user}
            onSaveToPersonalFavorites={handleSaveToPersonalFavorites}
          />
        )}

        {currentTab === 'favorites' && (
          <Favorites
            favorites={favorites}
            isLoading={isLoadingFavorites}
            onRefreshFavorites={fetchFavorites}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'auth' && (
          <Auth
            onAuthSuccess={handleAuthSuccess}
            onContinueAsGuest={() => setCurrentTab('home')}
          />
        )}
      </main>

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

      {/* Tactile Kitchen Notebook Footer */}
      <footer className="mt-16 border-t-2 border-[#E3D7BE] bg-[#FAF5E8] py-8 text-center text-xs text-charcoal-muted">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-1 font-serif text-sm text-charcoal font-bold">
            <span>PantryChef</span>
            <span className="text-tomato">•</span>
            <span className="font-handwritten text-base text-sage">A Kitchen Ledger</span>
          </div>
          <p className="font-sans">
            Built with MERN Stack, Gemini Vision AI & Framer Motion. Zero food waste, honest home cooking.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] font-mono text-charcoal-muted/80">
            <button onClick={() => setCurrentTab('landing')} className="hover:text-tomato underline">
              Story
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('home')} className="hover:text-tomato underline">
              Kitchen Notebook
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('community')} className="hover:text-tomato underline">
              Community Exchange
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('favorites')} className="hover:text-tomato underline">
              Recipe Box ({favorites.length})
            </button>
            <span>•</span>
            <button onClick={() => setIsScannerOpen(true)} className="hover:text-tomato underline">
              Photo Scanner
            </button>
            <span>•</span>
            <button onClick={() => setIsAllergensOpen(true)} className="hover:text-tomato underline">
              Allergen Safety
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
