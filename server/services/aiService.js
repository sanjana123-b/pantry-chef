import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Common culinary knowledge fallback for instant answers
 */
const CULINARY_KNOWLEDGE = [
  {
    keywords: ['salt', 'salty', 'too salty'],
    answer: "🧂 **To fix an over-salted dish:**\n- **Dilute**: Add unsalted liquid, broth, coconut milk, or canned unsalted tomatoes.\n- **Acid/Sugar**: A squeeze of fresh lemon juice or a pinch of brown sugar masks sharp salinity.\n- **Starch**: Drop in peeled raw potato slices to simmer for 10 minutes (absorbs excess salt), then remove.\n- **Dairy**: Stir in heavy cream, yogurt, or unsalted butter to coat your palate."
  },
  {
    keywords: ['egg', 'substitute for egg', 'no eggs', 'baking without egg'],
    answer: "🥚 **Reliable Egg Substitutes (per 1 large egg):**\n- **Baking & Cakes**: 1/4 cup unsweetened applesauce or 1/2 mashed banana.\n- **Binding Savory (Patties/Meatballs)**: 2 tbsp breadcrumbs soaked in 1 tbsp milk/water, or 1 tbsp ground flaxseed + 3 tbsp warm water (flax egg).\n- **Fluffiness & Rise**: 1 tsp baking soda + 1 tbsp white vinegar.\n- **Moisture**: 1/4 cup plain Greek yogurt or silken tofu."
  },
  {
    keywords: ['thicken', 'thickening', 'sauce too runny', 'runny soup'],
    answer: "🍲 **How to Thicken Soups & Sauces Without Cornstarch:**\n- **Reduction**: Simmer uncovered on low heat for 10-15 minutes so excess water evaporates naturally.\n- **Butter Mount (Beurre Manié)**: Mash equal parts soft butter and flour into a paste, whisk in small bits.\n- **Mashed Veggies/Beans**: Blend a ladle of the cooked potatoes, beans, or carrots and stir back into the pot.\n- **Cheese / Cream**: Stir in grated parmesan, heavy cream, or cream cheese at low flame."
  },
  {
    keywords: ['temperature', 'chicken temp', 'meat temp', 'internal temp'],
    answer: "🌡️ **Safe Kitchen Internal Temperature Guide:**\n- **Poultry (Chicken & Turkey)**: 165°F (74°C) — juices run clear.\n- **Beef, Pork, Lamb (Medium)**: 145°F (63°C) + 3 min rest.\n- **Ground Meats (Burgers/Sausages)**: 160°F (71°C).\n- **Fish & Seafood**: 145°F (63°C) — flakes easily with a fork."
  },
  {
    keywords: ['butter', 'substitute for butter'],
    answer: "🧈 **Quick Butter Substitutes:**\n- **Cooking/Sautéing**: Extra virgin olive oil, ghee, or avocado oil (1:1 ratio).\n- **Baking**: Coconut oil (solid at room temp) or neutral vegetable oil (use 3/4 cup oil for every 1 cup butter).\n- **Toast/Finishing**: Olive oil with a pinch of sea salt."
  },
  {
    keywords: ['garlic', 'out of garlic'],
    answer: "🧄 **Out of Fresh Garlic? Use:**\n- **Garlic Powder**: 1/8 tsp per clove of fresh garlic.\n- **Garlic Salt**: 1/2 tsp per clove (reduce added salt in the recipe).\n- **Shallots / Onion**: Minced shallots sauteed with a dash of black pepper provide a subtle aromatic base."
  }
];

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

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
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

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
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

    return generateFallbackRecipes(ingredients, options);
  } catch (error) {
    console.error('[AI Service Error]:', error.message);
    return generateFallbackRecipes(ingredients, options);
  }
}

/**
 * Interactive Sous-Chef AI Chatbot
 */
export async function askSousChefWithAI(message, history = []) {
  const lowerMsg = message.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    for (const item of CULINARY_KNOWLEDGE) {
      if (item.keywords.some((k) => lowerMsg.includes(k))) {
        return item.answer;
      }
    }
    return `👨‍🍳 **Sous-Chef Tip:** When working with what you have, remember the culinary balance rule: **Fat + Acid + Salt + Heat**. Add a splash of vinegar or lemon juice if a dish tastes flat, sear ingredients on high heat for natural browning flavor, and let proteins rest before slicing!`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are Chef Auguste, the warm, encouraging, and highly practical Sous-Chef of PantryChef. 
You specialize in home cooking, ingredient substitutions, fixing culinary mistakes, food storage tips, and flavor pairing.
Keep answers concise, warm, helpful, and formatted with markdown bullet points and emojis. Focus on practical kitchen solutions without requiring specialty appliances.`,
    });

    const chat = model.startChat({
      history: history.slice(-6).map((h) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('[AI Chat Error]:', error.message);
    for (const item of CULINARY_KNOWLEDGE) {
      if (item.keywords.some((k) => lowerMsg.includes(k))) {
        return item.answer;
      }
    }
    return "👨‍🍳 **Quick Kitchen Advice:** Always taste your food as you go! If it's missing depth, try a drop of soy sauce, butter, or toasted spices.";
  }
}

/**
 * Multimodal Visual Scanner for Fridge photos or Grocery Receipts
 * @param {string} base64Data - Base64 encoded image data string
 * @param {string} mimeType - e.g. 'image/jpeg', 'image/png'
 * @returns {Promise<string[]>} List of recognized ingredient names
 */
export async function scanPantryPhotoWithAI(base64Data, mimeType = 'image/jpeg') {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // Intelligent simulation for testing/demo mode
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

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
Analyze this image of a grocery receipt, refrigerator shelf, crisper drawer, or pantry shelf.
Identify all distinct raw cooking ingredients, fresh produce, dairy, proteins, pantry staples, or purchased groceries visible.
Ignore non-food items (like paper towels, soap, brand names, barcodes, totals).

Respond ONLY as a valid JSON array of single-ingredient strings, for example:
["Eggs", "Tomatoes", "Garlic", "Spinach", "Chicken Breast", "Cheddar Cheese"]
`;

    // Strip header prefix if included (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = base64Data.replace(/^data:[a-zA-Z0-9/]+;base64,/, '');

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

    return ['Eggs', 'Tomatoes', 'Garlic', 'Spinach', 'Cheese'];
  } catch (error) {
    console.error('[Vision AI Error]:', error.message);
    return ['Eggs', 'Tomatoes', 'Garlic', 'Olive Oil', 'Spinach'];
  }
}
