# 🍲 PantryChef — AI-Powered Kitchen Recipe Ledger

**🔗 Live Demo:** https://pantrychef-br0t.onrender.com  
**💻 Source:** https://github.com/sanjana123-b/pantry-chef

An AI-powered **"Cook with What You Have"** web application that helps users discover recipes using ingredients already available in their kitchen.

PantryChef combines AI-powered recipe generation with a warm, interactive kitchen notebook experience. Instead of a conventional AI-wrapper interface, it features a tactile cookbook-inspired design with animated recipe cards, ingredient tags, and a personal Recipe Box.

---

## 🎨 Distinctive Design Motifs

- **Tactile Color Palette:** Warm cream (`#F7F2E9`), charcoal ink (`#2B2320`), burnt tomato (`#C1502E`), sage green (`#6B8F71`), aged paper (`#FBF7EE`), and mustard highlights (`#D9A441`).
- **Typography:** Fraunces / DM Serif Display for headings, Work Sans / Inter for readable content, and Caveat for handwritten-style notes.
- **Jar Token Labels:** Ingredients entered by users appear as individual removable tags inspired by pantry jar labels.
- **Fanned Index Card Stack:** Generated recipes appear as slightly rotated index cards with soft shadows and interactive hover effects.
- **Ink-Stamp Save Animation:** Saving a recipe triggers a circular red ledger stamp animation using Framer Motion.
- **Simmering Pot Loader:** A custom animated cooking pot with rising steam replaces conventional loading spinners.
- **Personal Recipe Box:** A dedicated page for searching, saving, viewing, and deleting favorite recipes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Integration | Google Gemini API |
| Session Management | UUID-based HTTP-only cookies |
| API Communication | Fetch API, REST, JSON |

---

## 📁 Project Structure

```text
pantryChef/
├── client/                              # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js                # Fetch wrapper with credentials: 'include'
│   │   ├── components/
│   │   │   ├── IngredientInput.jsx      # Tag-chip jar labels & quick staple buttons
│   │   │   ├── LoadingSimmer.jsx        # Animated simmering pot with rising steam
│   │   │   ├── Navbar.jsx               # Header & tab navigation
│   │   │   ├── RecipeCard.jsx           # Index card with interactive check-offs
│   │   │   ├── RecipeStack.jsx          # Fanned card stack & grid toggle
│   │   │   └── SaveStamp.jsx            # Framer Motion ink-stamp animation
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Recipe generator workspace
│   │   │   └── Favorites.jsx            # Saved Recipe Box with search & deletion
│   │   ├── styles/
│   │   │   └── theme.css                # Custom palette, textures & fonts
│   │   ├── App.jsx                      # Client-side routing
│   │   └── main.jsx                     # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                              # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                        # MongoDB connection & in-memory fallback
│   ├── middleware/
│   │   └── sessionUser.js               # HTTP-only UUID session cookie
│   ├── models/
│   │   └── Favorite.js                  # Saved recipe Mongoose schema
│   ├── routes/
│   │   ├── favorites.js                 # GET, POST, DELETE /api/favorites
│   │   └── recipes.js                   # POST /api/generate-recipes
│   ├── services/
│   │   └── aiService.js                 # Gemini API integration & mock fallback
│   ├── server.js                        # Express server entry point
│   ├── package.json
│   └── .env.example                     # Environment configuration template
│
├── package.json                         # Root scripts for concurrent execution
└── README.md                            # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites

- Node.js v18 or newer
- npm v9 or newer
- Google Gemini API key (optional if using the fallback generator)
- MongoDB Atlas or a local MongoDB instance (optional if using the configured in-memory fallback)

### 2. Clone the Repository

```bash
git clone https://github.com/sanjana123-b/pantry-chef.git
cd pantry-chef
```

### 3. Configure Environment Variables

Navigate to the server directory and create an environment file:

```bash
cd server
cp .env.example .env
```

Configure the following variables in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pantrychef
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Note:** If the Gemini API key or MongoDB connection is unavailable, PantryChef can use its configured mock recipe generator and in-memory storage fallback for demonstration purposes.

### 4. Install Dependencies

From the root project directory:

```bash
npm install
```

Install dependencies for both client and server if they are not automatically handled by the root scripts:

```bash
cd client && npm install
cd ../server && npm install
```

### 5. Run the Application

Start both services concurrently from the root directory:

```bash
npm run dev
```

Alternatively, run them separately in two terminals.

**Backend:**

```bash
npm run dev:server
```

**Frontend:**

```bash
npm run dev:client
```

### 6. Open the Application

Visit:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate-recipes` | Accepts ingredients and generates 2–3 recipes |
| GET | `/api/favorites` | Retrieves recipes saved by the current session |
| POST | `/api/favorites` | Saves a recipe to the Recipe Box |
| DELETE | `/api/favorites/:id` | Deletes a saved recipe |
| GET | `/api/health` | Checks server health and session diagnostics |

---

## 🍳 AI Prompt Design

The AI service is isolated in `server/services/aiService.js`.

It uses the Google Gemini API to generate recipe suggestions based on the ingredients provided by the user.

The prompt follows a structured format:

```text
You are a creative but practical recipe assistant.

Given ONLY these ingredients: {ingredients}

Basic staples such as salt, oil, pepper, and water
may be assumed available.

Suggest 2–3 simple recipes using primarily these items.

Respond ONLY as valid JSON in this exact shape:

[
  {
    "title": "string",
    "description": "one sentence, appetizing but honest",
    "steps": [
      "step 1",
      "step 2",
      "step 3"
    ]
  }
]
```

The backend processes the generated response and provides structured recipe data to the frontend. A mock recipe fallback is available when the AI service cannot be used.

---

## 🔐 Session Management

PantryChef uses lightweight cookie-based session identification.

- Each browser session is associated with a unique UUID.
- The UUID is stored in an HTTP-only cookie named `pantrychef_uid`.
- The backend uses this identifier to associate saved recipes with the current session.
- No traditional registration or login is required.

This provides session-level separation of saved recipes without implementing a complete user authentication system.

---

## 💾 Database & Fallback Strategy

MongoDB is used to persist saved recipes, with Mongoose managing the schema and database operations.

The application also supports an in-memory fallback mechanism when the database is unavailable or not configured.

This improves demonstration reliability, although in-memory records are temporary and are not retained after the server process restarts.

---

## ✨ Key Features

1. AI-powered recipe generation using available ingredients.
2. Interactive ingredient entry with removable tags.
3. Custom animated loading experience.
4. Cookbook-inspired recipe cards and responsive layouts.
5. Interactive cooking-step check-offs.
6. Save and delete favorite recipes.
7. Searchable personal Recipe Box.
8. Cookie-based session identification.
9. Gemini API integration with mock fallback.
10. MongoDB persistence with in-memory fallback support.

---

## 🔮 Future Enhancements

- User registration and secure login.
- Recipe filtering based on dietary preferences.
- Preparation-time and difficulty filters.
- Nutritional information and calorie estimation.
- Recipe-sharing functionality.
- Shopping-list generation for missing ingredients.

---

## 👩‍💻 Project Overview

PantryChef demonstrates the integration of modern frontend development, backend API design, database management, session handling, and generative AI.

The project focuses on combining practical everyday utility with an engaging user experience, making cooking more accessible through the ingredients people already have.

**PantryChef — Less food waste. More creativity. Better cooking.**
