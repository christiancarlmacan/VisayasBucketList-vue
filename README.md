# 🌴 VisayasBucketList

A travel bucket-list web application designed for exploring, saving, and tracking tourist destinations across the Visayas region of the Philippines (Central Visayas, Western Visayas, and Eastern Visayas).

---

## 🚀 Tech Stack

- **Frontend**: Vue.js 3 (Composition API `<script setup>`), Vite, Tailwind CSS, Pinia, Vue Router 4, Axios
- **Backend**: Node.js, Express.js (REST API), Prisma ORM, JSON Web Tokens (JWT), bcryptjs
- **Database**: Neon Cloud PostgreSQL

---

## 📊 Current Implementation Status: **50% Milestone Complete**

### ✅ Completed in this Milestone (Phases 1 – 5):
1. **Phase 1 — Project Architecture & Setup**:
   - Decoupled `frontend/` and `backend/` applications
   - Complete dependencies installed and verified
   - Environment variables setup (`.env.example` and `.env`)
   - Git repository initialized with proper `.gitignore`
   - Strict Anti-hallucination protocols active (`GEMINI.md`, `AGENT.md`, `AGENTS.md`)

2. **Phase 2 — Database Layer**:
   - Complete Prisma ORM schema (`backend/src/prisma/schema.prisma`) featuring all models:
     - `User` (with roles: `USER`, `ADMIN`)
     - `Category`
     - `Destination` (with latitude, longitude, budget, duration, image_url)
     - `BucketList` (with statuses: `WANT_TO_VISIT`, `VISITED`)
     - `Favorite`
     - `Review`
     - `Achievement` & `UserAchievement`
   - Comprehensive seed script (`seed.js`) with authentic Visayas destinations (Cebu, Bohol, Boracay, Leyte, Siquijor, etc.)

3. **Phase 3 — Authentication & Authorization**:
   - User Registration with bcrypt password hashing
   - User Login with JWT generation
   - Current user profile endpoint (`/api/auth/me`)
   - JWT authentication middleware (`authMiddleware.js`)
   - Role-based authorization middleware (`adminMiddleware.js`)
   - Pinia Auth Store (`stores/auth.js`) with persistent login state

4. **Phase 4 — Destinations Discovery & Exploration**:
   - REST API endpoints for destination listing, filtering, search, and details
   - Dynamic search by keyword, province, or location
   - Filter by Visayas Region (Central, Western, Eastern) and Categories
   - Interactive Frontend Views:
     - `Home.vue` (Hero showcase, quick tags, region guides, popular picks)
     - `Explore.vue` (Filter panel, active pills, destination cards grid, pagination)
     - `DestinationDetails.vue` (Full photo banner, overview, budget, duration, coordinates)

5. **Phase 5 — Bucket List & Favorites**:
   - Add/Remove destinations to personal bucket list
   - Toggle status between `WANT_TO_VISIT` and `VISITED`
   - Live travel progress tracking (visual percentage progress bar, visited count, total count)
   - Favorites management (add/remove favorite spots)
   - Views: `BucketList.vue` and `Favorites.vue`

---

## 🔮 Remaining 50% Milestone (Upcoming Phases 6 – 10):
- **Phase 6**: Review & Rating submission and moderation
- **Phase 7**: Automated travel achievement triggers (e.g., "Island Explorer", "Beach Hopper")
- **Phase 8**: Admin Management Dashboard (destination CRUD UI, category CRUD, user management)
- **Phase 9**: UI/UX micro-interactions, toasts, and loading skeletons polish
- **Phase 10**: Production deployment scripts & cloud hosting

---

## 🛠️ How to Run Locally

### 1. Database Setup (Neon PostgreSQL)
In `backend/.env`, paste your Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Push schema and seed the database:
```bash
cd backend
npx prisma db push
npm run prisma:seed
```

### 2. Start the Backend API
```bash
cd backend
npm run dev
```
API will run on: `http://localhost:5000`

### 3. Start the Frontend App
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`
