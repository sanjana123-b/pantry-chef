/**
 * API client for PantryChef backend communications
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function generateRecipes(ingredients, options = {}) {
  const response = await fetch(`${BASE_URL}/api/generate-recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      ingredients,
      dietary: options.dietary || [],
      cuisine: options.cuisine || '',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate recipes');
  }

  return data.recipes;
}

export async function getFavorites() {
  const response = await fetch(`${BASE_URL}/api/favorites`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch saved recipes');
  }

  return data.favorites;
}

export async function saveFavorite(recipeData) {
  const response = await fetch(`${BASE_URL}/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(recipeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save recipe');
  }

  return data;
}

export async function deleteFavorite(id) {
  const response = await fetch(`${BASE_URL}/api/favorites/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete saved recipe');
  }

  return data;
}

// Authentication Endpoints
export async function registerChef(userData) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
}

export async function loginChef(credentials) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function getCurrentChef() {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to check auth status');
  }

  return data.user;
}

export async function logoutChef() {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();
  return data;
}

// AI Sous-Chef Chatbot
export async function askSousChef(message, history = []) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Sous-Chef is currently busy at the stove');
  }

  return data.reply;
}

// Multimodal Visual Photo Scanner
export async function scanPantryPhoto(base64Image, mimeType = 'image/jpeg') {
  const response = await fetch(`${BASE_URL}/api/scan-pantry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ image: base64Image, mimeType }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to scan image');
  }

  return data.ingredients;
}

// Community Recipe Exchange
export async function getCommunityRecipes() {
  const response = await fetch(`${BASE_URL}/api/community`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to retrieve community recipes');
  }

  return data.recipes;
}

export async function publishCommunityRecipe(recipeData) {
  const response = await fetch(`${BASE_URL}/api/community`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(recipeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to publish recipe to community');
  }

  return data.recipe;
}

export async function stampCommunityRecipe(id) {
  const response = await fetch(`${BASE_URL}/api/community/${id}/stamp`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to stamp community recipe');
  }

  return data.recipe;
}
