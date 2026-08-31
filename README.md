# 🍲 PantryChef — AI-Powered Kitchen Recipe Ledger

> An AI-powered **"cook with what you have"** web application crafted with a warm, tactile **"kitchen notebook & pantry ledger"** aesthetic.

Skip the generic dark-mode AI-wrapper SaaS look. **PantryChef** feels like a cherished handwritten cookbook crossed with a modern interactive culinary assistant.

---

## 🎨 Distinctive Design Motifs

- **Tactile Palette**: Warm cream background (`#F7F2E9`), deep charcoal ink (`#2B2320`), burnt tomato accent (`#C1502E`), sage green (`#6B8F71`), aged paper card surface (`#FBF7EE`), and mustard highlight (`#D9A441`).
- **Typography**: Google Fonts — *Fraunces / DM Serif Display* for headings & recipe names, *Work Sans / Inter* for crisp legibility, and *Caveat* for handwritten notes.
- **Jar Token Labels**: Typed ingredients render as embossed glass jar labels with metallic lids and easy remove tags.
- **Fanned Index Card Stacks**: AI recipe results render as stacked index cards rotated 1–2° with soft realistic shadows that straighten and elevate on hover.
- **Ink-Stamp Save Animation**: Saving a recipe stamps an authentic red circular ledger seal (`★ RECIPE BOX ★`) into the card using Framer Motion.
- **Simmering Pot Loading State**: While the AI crafts recipes, a custom animated simmering pot with bubbling lid and rising steam replaces generic loading spinners.
- **The Recipe Box**: A dedicated personal recipe box route with search, interactive step completion check-offs, and recipe ledger storage.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite), TailwindCSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Cookie-Parser, Mongoose
- **Database**: MongoDB (Atlas or Local, with automatic in-memory fallback)
- **AI Integration**: Google Gemini API (`@google/generative-ai`) isolated backend-only service with intelligent culinary fallback
- **Session Auth**: Zero-friction cookie-based session identification (`pantrychef_uid` httpOnly UUID)

---

## 📁 Project Structure

```text
pantryChef/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Fetch wrappers with credentials
│   │   ├── components/
│   │   │   ├── IngredientInput.jsx  # Tag-chip jar labels & quick staples
│   │   │   ├── LoadingSimmer.jsx    # Custom animated simmering pot & steam
│   │   │   ├── Navbar.jsx           # Wordmark ledger header & tabs
│   │   │   ├── RecipeCard.jsx       # Tactile index card with step check-offs
│   │   │   ├── RecipeStack.jsx      # Fanned index card stack & grid toggle
│   │   │   └── SaveStamp.jsx        # Framer Motion ink-stamp save action
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Main pantry recipe generator flow
│   │   │   └── Favorites.jsx        # Recipe box archive view & search
│   │   ├── styles/
│   │   │   └── theme.css            # Custom palette, torn edges & grain
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection + in-memory fallback
│   ├── middleware/
│   │   └── sessionUser.js      # Cookie-based UUID session tracker
│   ├── models/
│   │   └── Favorite.js         # Mongoose schema for saved recipes
│   ├── routes/
│   │   ├── favorites.js        # GET, POST, DELETE /api/favorites
│   │   └── recipes.js          # POST /api/generate-recipes
│   ├── services/
│   │   └── aiService.js        # Gemini AI prompt & response parser
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── package.json                # Root concurrent runner scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **npm** (v9 or newer)

### 2. Configure Environment Variables
Copy `.env.example` in the `server` directory to `.env`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your Google Gemini API key:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pantrychef
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Note: If no API key or MongoDB is configured, PantryChef automatically boots with an in-memory database and culinary generator for instant zero-friction demoing!)*

### 3. Install Dependencies & Run

From the root directory:

```bash
# Run backend server (Port 5000)
npm run dev:server

# In a second terminal, run frontend client (Port 5173)
npm run dev:client
```

Or run everything concurrently:
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate-recipes` | Accepts `{ ingredients: string[] }` and returns 2–3 AI recipes |
| `GET` | `/api/favorites` | Retrieves all saved recipes for the current user session |
| `POST` | `/api/favorites` | Saves a recipe to the user's Recipe Box ledger |
| `DELETE` | `/api/favorites/:id` | Removes a saved recipe from the Recipe Box |
| `GET` | `/api/health` | Health check & session diagnostics |

---

## 🍳 AI Prompt Design

The AI service in [`server/services/aiService.js`](server/services/aiService.js) enforces strict structured JSON generation:

```text
You are a creative but practical recipe assistant.
Given ONLY these ingredients: {ingredients}
(basic staples like salt, oil, pepper and water may be assumed available),
suggest 2-3 simple recipes using primarily these items.

Respond ONLY as valid JSON in this exact shape:
[
  {
    "title": "string",
    "description": "one sentence, appetizing but honest",
    "steps": ["step 1", "step 2", "step 3"]
  }
]
```
