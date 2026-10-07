# AGENT.md — Agent System Rules & Hallucination Prevention Guide

## Project Context
- **Project**: VisayasBucketList (Visayas Region Travel Destination & Bucket-List Tracker)
- **Primary Architecture Guide**: [`VisayasBucketList_Architecture_Design_Plan (1).md`](./VisayasBucketList_Architecture_Design_Plan%20(1).md)
- **Rule Set**: See also [`GEMINI.md`](./GEMINI.md)
- **Session Checkpoint**: See [`CHECKPOINT.md`](./CHECKPOINT.md). Trigger keyword `macanresume` resumes development from the current milestone.

---

## 🧭 Core Directives to Prevent AI Hallucination

### 1. Ground Truth First (Verify Before Generating)
- **Inspect, Don't Guess**: Never guess file paths, module names, or package exports. Always view or list files prior to modifying or referencing them.
- **Dependency Awareness**: Inspect `package.json` in `frontend/` or `backend/` before importing any npm package. If a dependency is missing, instruct or install it rather than pretending it exists.
- **Database Schema as Contract**: Never hallucinate database column names or relation fields. Always consult `backend/src/prisma/schema.prisma`.

### 2. Strict Technology Boundaries
- **Frontend Stack**: Vue 3 (Composition API with `<script setup>`), Vite, Tailwind CSS, Pinia, Vue Router 4, Axios.
- **Backend Stack**: Node.js, Express.js (REST API), Prisma ORM, PostgreSQL (Neon Cloud), JWT, bcryptjs.
- **Image Handling**: Destination images use URLs saved in the database (`image_url`). Do not add unauthorized third-party cloud SDKs unless requested.
- **Disallowed**: No React, no MongoDB/Mongoose, no TypeORM/Sequelize, no GraphQL, no Redux.

### 3. Architecture & Separation of Concerns
- **Frontend / Backend Decoupling**: 
  - Frontend (`frontend/`) and Backend (`backend/`) are separate applications.
  - The frontend MUST NOT communicate directly with Neon PostgreSQL or run Prisma commands.
  - Communication happens strictly via HTTP/HTTPS REST API calls handled by Axios in `frontend/src/services/api.js`.
- **Backend Layering**:
  - `routes/` -> defines endpoints and binds validation & middleware.
  - `controllers/` -> handles HTTP request/response parsing.
  - `services/` -> handles business logic and Prisma database operations.
  - `middleware/` -> JWT authentication (`authMiddleware`) and role-based checks (`adminMiddleware`).

### 4. Code Standards & Anti-Stub Policy
- **No Incomplete Stubs**: Always provide working, concrete implementations. Avoid `// TODO: implement later` or empty handler blocks.
- **Preserve Existing Code**: Do not unintentionally delete existing functions, styling, or documentation when making incremental updates.
- **Error Handling**: Use consistent HTTP response formats:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Operation successful"
  }
  ```
  And for errors:
  ```json
  {
    "success": false,
    "error": "Descriptive error message"
  }
  ```

### 5. Environment & Security Protocols
- Secret variables belong strictly in `backend/.env` (e.g., `DATABASE_URL`, `JWT_SECRET`, `PORT`).
- Public Vite variables in `frontend/.env` must be prefixed with `VITE_` (e.g., `VITE_API_BASE_URL`).
- Never expose database credentials, secrets, or administrative keys to the frontend bundle.

---

## 🛠️ Verification Checklist for Agents

Before completing any task, verify:
- [ ] Are all referenced files actually present in the workspace?
- [ ] Do imports match the actual file paths and exported names?
- [ ] Does the implementation strictly adhere to `VisayasBucketList_Architecture_Design_Plan (1).md`?
- [ ] Are there any syntax errors or broken references?
- [ ] Did you confirm that no unauthorized libraries were introduced?
