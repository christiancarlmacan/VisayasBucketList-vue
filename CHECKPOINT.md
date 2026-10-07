# 📌 PROJECT CHECKPOINT & CONVERSATION STATE

- **Project**: VisayasBucketList (Visayas Region Travel Destination & Bucket-List Tracker)
- **Last Updated**: 2026-10-07
- **Current Progress**: **100% Completed** (Phases 1 - 10 Complete)
- **Database Status**: Neon PostgreSQL Connected & Synced (`prisma db push` + `prisma db seed` complete)
- **Build Status**: Frontend Vite Build Passing (Zero errors) & Backend API Passing

---

## 🚀 How to Run the Project

### 1. Start the Backend API Server
```powershell
cd "C:\Users\Angela Faith Macan\Desktop\bucketlist\backend"
npm run dev
# Running on http://localhost:5000 (Health Check: http://localhost:5000/api/health)
```

### 2. Start the Frontend Client
```powershell
cd "C:\Users\Angela Faith Macan\Desktop\bucketlist\frontend"
npm run dev
# Running on http://localhost:5173
```

---

## 🔑 Accounts & Authentication Setup

- **Administrator**:
  - Securely configured via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD` in `backend/.env`).
  - Completely excluded from Git tracking to avoid accidental leaks to GitHub.
  - Role: `ADMIN` (Access to `/admin` dashboard, CRUD destinations, categories, reviews, users).
- **Demo Traveler**:
  - **Email**: `traveler@visayasbucketlist.ph`
  - **Password**: `User@123456`
  - **Role**: `USER`

---

## 📂 Complete File Map (100% Core System)

### Backend (`backend/src/`)
- `server.js` (Express app, CORS, central error handler, route mounts)
- `config/database.js` (Prisma Client singleton)
- `prisma/schema.prisma` (8 Models: User, Category, Destination, BucketList, Favorite, Review, Achievement, UserAchievement)
- `prisma/seed.js` (Initial Visayas destinations, categories, admin user, test traveler, achievements)
- `routes/`:
  - `authRoutes.js` (Register, Login, Logout, Me)
  - `destinationRoutes.js` (Public list/details, reviews sub-routes, Admin CRUD)
  - `categoryRoutes.js` (Public list, Admin CRUD)
  - `bucketListRoutes.js` (Add, Update status, Delete, List)
  - `favoriteRoutes.js` (Add, Delete, List)
  - `reviewRoutes.js` (Edit, Delete, Admin list all)
  - `achievementRoutes.js` (List all, User progress & unlocked badges)
  - `userRoutes.js` (User profile, Admin user list, promote/demote, delete)
  - `adminRoutes.js` (System telemetry & stats)
- `controllers/`:
  - `authController.js`, `destinationController.js`, `categoryController.js`, `bucketListController.js`, `favoriteController.js`, `reviewController.js`, `achievementController.js`, `userController.js`, `adminController.js`
- `services/`:
  - `authService.js`, `destinationService.js`, `categoryService.js`, `bucketListService.js`, `favoriteService.js`, `reviewService.js`, `achievementService.js`, `userService.js`, `adminService.js`
- `middleware/`:
  - `authMiddleware.js`, `adminMiddleware.js`, `optionalAuthMiddleware.js`, `errorHandler.js`
- `validators/`:
  - `authValidator.js`, `reviewValidator.js`
- `utils/helpers.js` (`sendSuccess`, `sendError`, `slugify`)

### Frontend (`frontend/src/`)
- `App.vue` (Dynamic layouts: DefaultLayout / AdminLayout + ToastContainer)
- `main.js`, `main.css`, `tailwind.config.js`
- `router/index.js` (Guards for auth, guest, and admin roles)
- `stores/`:
  - `auth.js` (Pinia auth state, token persistence)
  - `destination.js` (Destinations fetch, categories, filters, pagination)
  - `bucketList.js` (Bucket list items, favorites, stats, visited filters)
  - `toast.js` (Notification popups)
- `services/api.js` (Axios interceptor attaching JWT Bearer token)
- `layouts/`:
  - `DefaultLayout.vue` (Public & traveler layout)
  - `AdminLayout.vue` (Admin control panel layout with dark theme)
- `components/`:
  - `Navbar.vue` (Responsive header with badges & admin switcher)
  - `Footer.vue`
  - `DestinationCard.vue`
  - `DestinationGrid.vue`
  - `BucketListCard.vue`
  - `ProgressBar.vue`
  - `RatingStars.vue`
  - `ReviewCard.vue`
  - `AchievementCard.vue`
  - `SearchBar.vue`
  - `FilterPanel.vue`
  - `ToastContainer.vue`
- `views/`:
  - `Home.vue` (Hero, regional discovery, popular spots, CTAs)
  - `Explore.vue` (Filters by region/category, search, pagination)
  - `DestinationDetails.vue` (Full details, bucket list toggle, 1-5 star review form, review list)
  - `BucketList.vue` (Progress tracking, Want to Visit / Visited tabs)
  - `Favorites.vue` (Saved heart destinations)
  - `Visited.vue` (Travel memory log & conquered spots)
  - `Achievements.vue` (Traveler passport, unlocked badges, progress bars)
  - `Profile.vue` (User account, avatar, travel statistics)
  - `Login.vue` & `Register.vue`
  - `AdminDashboard.vue` (Overview stats, recent spots, latest reviews)
  - `AdminDestinations.vue` (CRUD modal for destinations)
  - `AdminCategories.vue` (CRUD modal for categories)
  - `AdminReviews.vue` (Review moderation table)
  - `AdminUsers.vue` (User accounts & role toggling)
