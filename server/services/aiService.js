import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Smart culinary fallback matching based on question keywords
 */
export function getSmartCulinaryFallback(question) {
  const q = String(question || '').toLowerCase();

  // 1. Substitutions & Replacements
  if (/substitut|replac|instead of|alternative|out of/i.test(q)) {
    if (/egg/i.test(q)) {
      return "🥚 **Egg Substitutes (per 1 large egg):**\n- **In baking/pancakes**: 1/4 cup unsweetened applesauce, 1/2 mashed ripe banana, or 1/4 cup plain Greek yogurt.\n- **For binding savory dishes**: 1 tbsp ground flaxseed + 3 tbsp warm water (rest 5 min), or 2 tbsp breadcrumbs with milk.\n- **For lift/fluffiness**: 1 tsp baking soda + 1 tbsp white vinegar.";
    }
    if (/butter/i.test(q)) {
      return "🧈 **Butter Substitutes:**\n- **Sautéing/Cooking**: Olive oil, avocado oil, or ghee (1:1 ratio).\n- **Baking**: Coconut oil (solid at room temp) or neutral vegetable oil (use 3/4 cup oil per 1 cup butter).\n- **Spreading**: Mashed avocado or olive oil with a pinch of flaky salt.";
    }
    if (/milk|cream|buttermilk/i.test(q)) {
      return "🥛 **Dairy Substitutes:**\n- **Buttermilk**: 1 cup whole milk + 1 tbsp lemon juice or white vinegar (let sit 5 min).\n- **Heavy Cream**: 3/4 cup whole milk + 1/4 cup melted butter, or full-fat canned coconut milk.\n- **Sour Cream**: Equal parts plain Greek yogurt or blended silken tofu with a squeeze of lemon.";
    }
    return "🔄 **Smart Kitchen Substitutions:**\n- **Eggs**: 1/4 cup applesauce or 1/2 mashed banana per egg in baked goods.\n- **Cornstarch**: 2 tbsp all-purpose flour or 1 tbsp arrowroot per 1 tbsp cornstarch.\n- **Brown Sugar**: 1 cup white granulated sugar + 1 tbsp molasses or maple syrup.\n- **Soy Sauce**: Tamari, Worcestershire sauce + pinch of salt, or coconut aminos.\n- **Garlic Clove**: 1/8 tsp garlic powder or 1/2 tsp minced shallot.";
  }

  // 2. Over-salted / Salty
  if (/salt|salty|over-salt|oversalt/i.test(q)) {
    return "🧂 **How to Fix an Over-Salty Dish:**\n- **Dilute**: Add unsalted stock, canned unsalted tomatoes, milk, cream, or water to increase volume.\n- **Balance with Acid or Sweet**: A squeeze of fresh lemon juice, splash of apple cider vinegar, or a pinch of brown sugar blunts the harsh salt taste.\n- **The Potato Trick**: Simmer thick slices of raw peeled potato in the sauce for 10 minutes (they absorb salted liquid), then remove before serving.\n- **Add Fat/Dairy**: Whisk in unsalted butter, sour cream, or heavy cream to coat tastebuds and mellow the salinity.";
  }

  // 3. Egg-related general inquiries
  if (/\beggs?\b/i.test(q)) {
    return "🥚 **Chef's Egg Guide:**\n- **Boiling times**: 6 min (runny yolk), 8 min (jammy), 10-11 min (firm hard-boiled). Plunge into an ice bath immediately!\n- **Freshness test**: Submerge in water; fresh eggs lay flat at the bottom, older eggs stand upright, bad eggs float.\n- **Substitutes in batter**: 1/4 cup applesauce, 1/2 mashed banana, or 1 tbsp ground flax + 3 tbsp water per egg.";
  }

  // 4. Burnt / scorched
  if (/burnt|scorch|charred|smoked/i.test(q)) {
    return "🔥 **How to Rescue Scorched or Burnt Food:**\n- **Stop & Transfer Immediately**: Lift the pot off the stove right away. Do NOT scrape the bottom! Carefully ladle the good unburnt food into a clean pot.\n- **Neutralize the Smoke**: Stir in a dash of smoked paprika, a spoonful of peanut butter or tahini, or a teaspoon of brown sugar and cider vinegar to disguise the burnt note.\n- **Add Creaminess**: Heavy cream, coconut milk, or cream cheese effectively masks acrid charred undertones in sauces and stews.";
  }

  // 5. Cooking time / boiling / how long
  if (/how long|time|timing|boil|minutes?|duration/i.test(q)) {
    if (/pasta/i.test(q)) {
      return "🍝 **Pasta Boiling Timetable:**\n- Cook in rolling, generously salted boiling water (1 gallon water + 1-2 tbsp salt per pound).\n- **Standard dried pasta**: 8–11 minutes. Start tasting 2 minutes before package directions for perfect *al dente*.\n- **Fresh pasta**: Only 2–3 minutes!\n- **Pro-tip**: Reserve 1/2 cup starchy pasta water before draining to emulsify your sauce.";
    }
    if (/rice/i.test(q)) {
      return "🍚 **Rice Cooking Times (1 cup rice : 2 cups water):**\n- **Long grain / Jasmine**: 15 minutes simmer on lowest heat, then 10 minutes off heat covered.\n- **Basmati**: 12–15 minutes covered + 5 min rest.\n- **Brown rice**: 40–45 minutes covered + 10 min rest.\n- Keep the lid tight—never peek or stir during the simmer!";
    }
    return "⏱️ **General Cooking Timings & Guidelines:**\n- **Dried Pasta**: 8–11 minutes (taste at 8 min for al dente).\n- **Boiled Eggs**: 6 min (soft/jammy), 9 min (medium), 12 min (hard).\n- **White Rice**: 15–18 min simmer on low, covered + 5 min rest off-heat.\n- **Sautéed Chicken Breast**: 6–8 min per side over medium heat until internal temp reaches 165°F (74°C).\n- **Roasting Root Vegetables**: 35–45 min at 400°F (200°C) tossed in oil.";
  }

  // 6. Temperature / thermometer
  if (/temp|temperature|degrees|internal/i.test(q)) {
    return "🌡️ **Safe Kitchen Internal Temperature Guide:**\n- **Poultry (Chicken, Turkey)**: 165°F (74°C) — juices should run clear.\n- **Ground Meats (Beef, Pork, Burgers)**: 160°F (71°C).\n- **Beef, Pork, Lamb Steaks & Chops**: 145°F (63°C) with a mandatory 3-minute rest.\n- **Fish & Seafood**: 145°F (63°C) — flesh becomes opaque and flakes easily.\n- **Reheating Leftovers**: Always reheat to 165°F (74°C).";
  }

  // 7. Storage / freeze / refrigeration / keep
  if (/stor|freeze|frozen|freezer|fridge|refrigerat|spoil|keep|shelf life/i.test(q)) {
    if (/rice/i.test(q)) {
      return "🍚 **Can You Freeze Cooked Rice? Yes, absolutely!**\n- **How**: Cool cooked rice quickly (spread onto a baking sheet) within 1 hour of cooking.\n- **Pack**: Portion into airtight freezer bags or containers, flattening them for quick thawing.\n- **Shelf Life**: Freezes well up to 2 months (or refrigerate up to 4 days).\n- **Reheat**: Microwave with an ice cube or sprinkle of water covered for 2 minutes until piping hot throughout (165°F).";
    }
    return "🧊 **Kitchen Food Storage & Freezing Essentials:**\n- **Cooked Rice & Grains**: Cool within 1 hour; refrigerate up to 4 days or freeze in flat freezer bags up to 2 months.\n- **Soups & Broths**: Cool completely; freeze in jars/bags leaving 1 inch of headspace for up to 3 months.\n- **Fresh Herbs**: Wrap stems in a slightly damp paper towel inside a loose bag in the crisper.\n- **Raw Meats**: Cook within 2 days of refrigeration or freeze up to 6 months.";
  }

  // 8. If nothing matches:
  return "👨‍🍳 **Offline Culinary Notice:** The AI sous-chef service is currently offline or unreachable, and I couldn't find a matching tip for that specific question.\n\nPlease rephrase your inquiry or try asking about:\n- Ingredient substitutions (e.g. egg, butter, buttermilk, flour)\n- Fixing over-salted or burnt food\n- Cooking times (e.g. pasta, rice, boiled eggs)\n- Safe cooking internal temperatures\n- Freezing and storing cooked food";
}

/**
 * Intelligent fallback generator in case API key is absent or network fails
 */
function generateFallbackRecipes(ingredients, options = {}) {
  const ingList = ingredients.length ? ingredients.join(', ') : 'pantry staples';
  const mainIng = ingredients[0] || 'Hearty Pantry';
  const secondIng = ingredients[1] || 'Fresh Herbs';
  const cuisine = options.cuisine ? `${options.cuisine} Style ` : '';
  const dietaryNote = options.dietary?.length ? ` (${options.dietary.join(', ')})` : '';

  return [
    {
      title: `${cuisine}Rustic Pan-Seared ${mainIng.charAt(0).toUpperCase() + mainIng.slice(1)} Medley${dietaryNote}`,
      description: `A comforting kitchen skillet celebrating ${ingList} with crispy caramelized edges and warm aromatics.`,
      ingredients: ingredients,
      steps: [
        `Prep and slice your ${ingList} into uniform, bite-sized pieces.`,
        `Warm 2 tablespoons of cooking oil in a heavy skillet over medium-high heat until shimmering.`,
        `Add the ${mainIng} first, letting it sear undisturbed for 3-4 minutes to develop a rich golden crust.`,
        `Toss in the remaining ingredients (${ingList}), season generously with salt and fresh cracked pepper.`,
        `Reduce heat to medium, cover, and let simmer for 5-7 minutes until tender and deeply fragrant.`,
        `Finish with a light drizzle of oil or citrus and serve warm straight from the skillet.`
      ]
    },
    {
      title: `${cuisine}Grandma's ${secondIng.charAt(0).toUpperCase() + secondIng.slice(1)} & ${mainIng.charAt(0).toUpperCase() + mainIng.slice(1)} Pot Simmer`,
      description: `A gentle one-pot reduction that melds the natural richness of ${ingList} into a savory sauce.`,
      ingredients: ingredients,
      steps: [
        `Warm a deep sauce pot over medium flame with a splash of oil or butter.`,
        `Add chopped ${ingList} with a pinch of salt to release natural juices.`,
        `Pour in 1/2 cup of water or vegetable broth, bring to a gentle boil, then lower heat to a slow simmer.`,
        `Cover with a lid and let the aromas deepen for 12-15 minutes, stirring occasionally.`,
        `Uncover, let excess liquid reduce to a glossy glaze, and adjust seasoning.`,
        `Ladle onto warm plates and enjoy fresh.`
      ]
    },
    {
      title: `${cuisine}Crispy Herb & ${mainIng.charAt(0).toUpperCase() + mainIng.slice(1)} Skillet Crisp`,
      description: `A quick, golden stovetop dish utilizing ${ingList} for maximum crunch and cozy flavor.`,
      ingredients: ingredients,
      steps: [
        `Toss prepared ${ingList} in a mixing bowl with 1 tablespoon oil, salt, and pepper until evenly coated.`,
        `Spread across a preheated pan in a single layer so the pieces caramelize rather than steam.`,
        `Cook at high heat until the edges are caramelized and slightly blistered (approx. 10-12 minutes).`,
        `Garnish with fresh cracked pepper and serve immediately.`
      ]
    }
  ];
}

/**
 * Clean and extract JSON array from model output
 */
function extractJSON(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket >= firstBracket) {
    cleaned = cleaned.slice(firstBracket, lastBracket + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Generate recipes with Gemini AI incorporating dietary & cuisine preferences
 */
export async function generateRecipesWithAI(ingredients, options = {}) {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error('Please provide at least one ingredient.');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_key_here') {
    console.warn('[AI Service] No valid GEMINI_API_KEY found. Using demo culinary generator.');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateFallbackRecipes(ingredients, options);
  }

  let extraGuidelines = '';
  if (options.dietary && options.dietary.length > 0) {
    extraGuidelines += `\nDietary constraints to strictly respect: ${options.dietary.join(', ')}.`;
  }
  if (options.cuisine && options.cuisine !== 'Any Style') {
    extraGuidelines += `\nCuisine inspiration / flavor profile: ${options.cuisine}.`;
  }

  const prompt = `
You are a creative but practical recipe assistant.
Given ONLY these ingredients: ${ingredients.join(', ')}
(basic staples like salt, oil, pepper and water may be assumed available),
suggest 2-3 simple recipes using primarily these items.
${extraGuidelines}

Respond ONLY as valid JSON in this exact shape:
[
  {
    "title": "string",
    "description": "one sentence, appetizing but honest",
    "steps": ["step 1", "step 2", "step 3"]
  }
]
`;

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [configuredModel, 'gemini-3.5-flash', 'gemini-3.1-flash-lite'].filter((m, i, arr) => arr.indexOf(m) === i);
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = extractJSON(responseText);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((r) => ({
          title: String(r.title || 'Untitled Recipe').trim(),
          description: String(r.description || 'A delicious dish crafted from your ingredients.').trim(),
          ingredients: ingredients,
          steps: Array.isArray(r.steps) ? r.steps.map((s) => String(s).trim()).filter(Boolean) : [String(r.steps || '')],
        }));
      }
    } catch (error) {
      console.error(`[AI Recipe Gen Error with ${modelName}]:`, error.message, error.status ? `(status: ${error.status})` : '');
    }
  }

  console.warn('[AI Service] Recipe generation with Gemini failed. Using fallback recipes.');
  return generateFallbackRecipes(ingredients, options);
}

/**
 * Interactive Sous-Chef AI Chatbot
 * Sends user message + conversation history with system instructions
 * Returns { reply, source: "gemini" | "fallback" }
 */
export async function askSousChefWithAI(message, history = [], context = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_key_here') {
    console.warn('[AI Service] No valid GEMINI_API_KEY found. Using smart culinary fallback.');
    return {
      reply: getSmartCulinaryFallback(message),
      source: 'fallback',
    };
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [configuredModel, 'gemini-3.5-flash', 'gemini-3.1-flash-lite'].filter((m, i, arr) => arr.indexOf(m) === i);

  let systemInstruction = "You are Chef Auguste, a warm, concise sous-chef. Answer the user's specific question about cooking, substitutions, techniques, timings and food safety. Use the pantry ingredients and allergen settings when provided. Keep answers under 150 words unless asked for more.";

  if (context.ingredients && Array.isArray(context.ingredients) && context.ingredients.length > 0) {
    systemInstruction += `\nCurrent pantry ingredients on hand: ${context.ingredients.join(', ')}.`;
  }
  if (context.allergens && Array.isArray(context.allergens) && context.allergens.length > 0) {
    systemInstruction += `\nStrict allergen constraints: ${context.allergens.join(', ')}.`;
  }

  // Sanitize history: roles "user" and "model", parts: [{ text }]
  const formattedHistory = [];
  if (Array.isArray(history)) {
    for (const h of history.slice(-8)) {
      const text = String(h.text || h.message || '').trim();
      if (!text) continue;
      const role = (h.sender === 'user' || h.role === 'user') ? 'user' : 'model';

      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
        formattedHistory[formattedHistory.length - 1].parts[0].text += `\n${text}`;
      } else {
        formattedHistory.push({ role, parts: [{ text }] });
      }
    }
  }

  // Gemini requires history to start with 'user'
  while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
    formattedHistory.shift();
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const replyText = result.response.text();

      if (replyText && replyText.trim()) {
        return {
          reply: replyText.trim(),
          source: 'gemini',
        };
      }
    } catch (error) {
      console.error(`[AI Chat Error with ${modelName}]:`, error.message, error.status ? `(status: ${error.status})` : '');
    }
  }

  // Never fail silently; return smart fallback with source 'fallback'
  console.warn('[AI Service] Gemini chat failed. Providing smart keyword-matched fallback.');
  return {
    reply: getSmartCulinaryFallback(message),
    source: 'fallback',
  };
}

/**
 * Multimodal Visual Scanner for Fridge photos or Grocery Receipts
 * @param {string} base64Data - Base64 encoded image data string
 * @param {string} mimeType - e.g. 'image/jpeg', 'image/png'
 * @returns {Promise<string[]>} List of recognized ingredient names
 */
export async function scanPantryPhotoWithAI(base64Data, mimeType = 'image/jpeg') {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_key_here') {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return [
      'Eggs',
      'Baby Spinach',
      'Cherry Tomatoes',
      'Cheddar Cheese',
      'Whole Garlic',
      'Bell Pepper',
      'Olive Oil',
    ];
  }

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const modelsToTry = [configuredModel, 'gemini-3.5-flash', 'gemini-3.1-flash-lite'].filter((m, i, arr) => arr.indexOf(m) === i);

  const prompt = `
Analyze this image of a grocery receipt, refrigerator shelf, crisper drawer, or pantry shelf.
Identify all distinct raw cooking ingredients, fresh produce, dairy, proteins, pantry staples, or purchased groceries visible.
Ignore non-food items (like paper towels, soap, brand names, barcodes, totals).

Respond ONLY as a valid JSON array of single-ingredient strings, for example:
["Eggs", "Tomatoes", "Garlic", "Spinach", "Chicken Breast", "Cheddar Cheese"]
`;

  const cleanBase64 = base64Data.replace(/^data:[a-zA-Z0-9/]+;base64,/, '');
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'image/jpeg',
          },
        },
      ]);

      const responseText = result.response.text();
      const parsed = extractJSON(responseText);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 1);
      }
    } catch (error) {
      console.error(`[Vision AI Error with ${modelName}]:`, error.message, error.status ? `(status: ${error.status})` : '');
    }
  }

  return ['Eggs', 'Tomatoes', 'Garlic', 'Olive Oil', 'Spinach'];
}
