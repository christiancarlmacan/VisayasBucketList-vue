# 🌴 VisayasBucketList

A travel bucket-list web application designed for exploring, saving, and tracking tourist destinations across the Visayas region of the Philippines (Central Visayas, Western Visayas, and Eastern Visayas).

---

## 🚀 Tech Stack

- **Frontend**: Vue.js 3 (Composition API `<script setup>`), Vite, Tailwind CSS, Pinia, Vue Router 4, Axios
- **Backend**: Node.js, Express.js (REST API), Prisma ORM, JSON Web Tokens (JWT), bcryptjs
- **Database**: Neon Cloud PostgreSQL

---

## 🔑 Seed Accounts & Authentication Setup

### 🛡️ Administrator Account
Admin credentials are kept private and never committed to version control.
To configure an administrator account locally:
1. Copy `backend/.env.example` to `backend/.env` (which is git-ignored and never committed).
2. Configure your administrator credentials in `backend/.env`:
   ```env
   ADMIN_NAME="System Admin"
   ADMIN_EMAIL="admin@yourdomain.ph"
   ADMIN_PASSWORD="your_secure_password"
   ```
3. Run `npm run prisma:seed` in the `backend/` directory to create the admin account.

### 🧳 Demo Traveler Account (Public Test Account)
- **Email**: `traveler@visayasbucketlist.ph`
- **Password**: `User@123456`
- **Role**: `USER`

---

## 📊 Implementation Status: **100% Complete (All Phases 1 – 10)**

1. **Phase 1 — Project Setup**: Vue 3 + Vite frontend, Express backend, Git repository.
2. **Phase 2 — Database Layer**: 8 Prisma models synchronized to Neon PostgreSQL with seed data.
3. **Phase 3 — Authentication & Authorization**: JWT token auth, bcrypt hashing, role guards.
4. **Phase 4 — Destinations Discovery**: Search, region filters (Central, Western, Eastern), category filters.
5. **Phase 5 — Bucket List & Favorites**: Progress tracker, Want to Visit vs Visited status toggles.
6. **Phase 6 — Traveler Reviews & Ratings**: 1-5 star rating picker, user feedback, review moderation.
7. **Phase 7 — Travel Achievements**: Auto-unlock badges (*Island Explorer*, *Beach Hopper*, *Peak Seeker*, *Visayas Master*).
8. **Phase 8 — Admin Control Panel**: Full CRUD for destinations, categories, users, and review moderation.
9. **Phase 9 — UI/UX Polish**: Toast notifications, user profile management, responsive navigation.
10. **Phase 10 — Production Verification**: Vite build tested, API health verified.

---

## 🛠️ How to Run Locally

### 1. Start the Backend API
```powershell
cd backend
npm run dev
```
API runs on: `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)

### 2. Start the Frontend App
```powershell
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`
