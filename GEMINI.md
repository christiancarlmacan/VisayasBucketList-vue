# GEMINI.md — Project Guidelines & Anti-Hallucination Protocols

## Project Overview
**VisayasBucketList** is a travel bucket-list web application designed for exploring, saving, and tracking tourist destinations across the Visayas region in the Philippines.
- **Reference Specification**: Refer strictly to [`VisayasBucketList_Architecture_Design_Plan (1).md`](./VisayasBucketList_Architecture_Design_Plan%20(1).md).
- **Session Checkpoint**: See [`CHECKPOINT.md`](./CHECKPOINT.md). If the user mentions `macanresume`, resume directly from the checkpoint state.

---

## 🛑 Strict Anti-Hallucination Directives

To maintain codebase integrity and eliminate hallucinations, the AI agent **MUST** follow these protocols on every task:

1. **Verify Before Action (Grounding)**:
   - Always inspect the filesystem using directory listing or file inspection tools before creating, moving, or importing files.
   - Do **NOT** assume a package, file, component, or utility exists without verifying `package.json` or directory contents.
   - Never generate duplicate files with slight naming variations (e.g., `userController.js` vs `usersController.js`).

2. **Technology Stack Whitelist (No Unauthorized Libraries)**:
   - **Frontend**: Vue.js 3 (`<script setup>`), Vite, Vue Router 4, Pinia, Tailwind CSS, Axios, Lucide Icons (or heroicons).
   - **Backend**: Node.js, Express.js (REST API), Prisma ORM, JSON Web Tokens (`jsonwebtoken`), `bcrypt`/`bcryptjs`, `cors`, `dotenv`.
   - **Database**: Neon PostgreSQL (via Prisma).
   - **Images**: Store destination image URLs directly in the database (`image_url`). No external Cloudinary SDK unless requested.
   - 🚫 **Forbidden**: Do NOT introduce alternate frameworks/libraries (e.g., React, Next.js, Nuxt, Mongo/Mongoose, Sequelize, Redux, TypeORM) unless explicitly instructed by the user.

3. **No Phantom APIs or Disconnected Contracts**:
   - Every frontend API call in `frontend/src/services/` must match an actual route defined in `backend/src/routes/`.
   - HTTP response structure must be consistent: `{ success: true/false, data, message, error }`.
   - Do not invent non-standard status codes or payload shapes.

4. **Database & Schema Accuracy**:
   - Check `backend/src/prisma/schema.prisma` before writing any database queries or mutations.
   - Only use models and field names that actually exist in the schema.
   - The frontend **MUST NEVER** access PostgreSQL directly. All database operations happen via Express + Prisma on the backend.

5. **Code Completeness & Quality**:
   - Provide complete, working, production-ready code.
   - Avoid leaving placeholder comments like `// TODO: implement later` or omitting critical logic unless explicitly instructed.
   - Preserve existing comments, docstrings, and structure when updating files.

6. **Environment & Secrets**:
   - Store all sensitive configuration (e.g., `DATABASE_URL`, `JWT_SECRET`, `PORT`) in `backend/.env`.
   - Never commit `.env` or hardcode credentials into source code.
   - Never expose backend secrets to Vite (`VITE_*`) variables.

---

## 📁 Repository Structure Convention

The repository is organized into distinct frontend and backend directories:

```text
bucketlist/
├── frontend/                     # Vue 3 + Vite + Tailwind Client
│   ├── src/
│   │   ├── assets/               # Static styles, images, icons
│   │   ├── components/           # Reusable Vue components
│   │   ├── views/                # Routed views / pages
│   │   ├── layouts/              # DefaultLayout.vue, AdminLayout.vue
│   │   ├── router/index.js       # Vue Router configuration
│   │   ├── stores/               # Pinia state stores (auth, destination, bucketList)
│   │   ├── services/api.js       # Axios base instance & API endpoints
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/database.js    # Prisma client instance
│   │   ├── controllers/          # Request handling & HTTP responses
│   │   ├── services/             # Business logic & Prisma queries
│   │   ├── routes/               # Express router modules
│   │   ├── middleware/           # authMiddleware, adminMiddleware, errorHandler
│   │   ├── validators/           # Input validation logic
│   │   ├── utils/helpers.js      # Utility functions
│   │   ├── prisma/schema.prisma  # Prisma models & migrations
│   │   └── server.js             # Express app entrypoint
│   ├── .env
│   └── package.json
│
├── GEMINI.md                     # Antigravity / Gemini instruction & anti-hallucination rules
├── AGENT.md                      # General agent rules & guidelines
└── VisayasBucketList_Architecture_Design_Plan (1).md
```

---

## 🛡️ Role-Based Access & Security Rules

- **Roles**: `USER` and `ADMIN`.
- **Public endpoints**: Destination discovery, view destination details, categories, login, register.
- **Protected user endpoints**: Bucket list management, favorites, reviews submission, personal profile, achievements.
- **Admin endpoints**: Destination CRUD, manage categories, moderate reviews, manage users.
- Use `authMiddleware.js` for JWT verification and `adminMiddleware.js` for role verification (`role === 'ADMIN'`).

---

## 💡 Communication & Development Workflow

- When uncertain about user requirements not defined in the plan, ask for clarification instead of guessing.
- Always output clean, formatted code with precise paths.
