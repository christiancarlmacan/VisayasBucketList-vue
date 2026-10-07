# VisayasBucketList — Architecture & Design Plan

## 1. Project Overview

Project Title: VisayasBucketList

VisayasBucketList is a travel bucket-list web application focused on discovering, saving, and tracking tourist destinations across the Visayas region of the Philippines.

The system will allow users to:
- Discover Visayas destinations
- Search and filter destinations
- View destination details
- Add destinations to a personal bucket list
- Mark destinations as visited
- Save favorite destinations
- Give ratings and reviews
- Track bucket-list progress
- Earn simple achievements based on travel activities

An administrator will manage destinations, users, categories, and reviews.

---

# 2. Technology Stack

## Frontend

- Vue.js 3
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt/bcryptjs for password hashing

## Database

- PostgreSQL
- Neon PostgreSQL for cloud database hosting
- Prisma ORM recommended for database access and migrations

## Images

- Store destination image URLs in Neon PostgreSQL
- No Cloudinary or external image-storage service is required for the initial version
- The `image_url` field stores the URL for each destination image

## Development Tools

- Git
- GitHub
- VS Code
- npm

---

# 3. High-Level Architecture

```text
                    USER
                      |
                      v
             +----------------+
             |   Vue.js 3     |
             |   Frontend     |
             +-------+--------+
                     |
                     | HTTP/HTTPS
                     | REST API / JSON
                     v
             +----------------+
             | Node.js +       |
             | Express.js     |
             | Backend API    |
             +-------+--------+
                     |
          +----------+----------+
          |                     |
          v                     v
+-------------------+   +-------------------+
| Neon PostgreSQL   |   | Image Storage     |
| Database          |   | Cloudinary        |
+-------------------+   +-------------------+
```

Main data flow:

```text
Vue.js
   ↓
Axios
   ↓
Express.js REST API
   ↓
Controllers
   ↓
Services
   ↓
Prisma ORM
   ↓
Neon PostgreSQL
```

---

# 4. Recommended System Architecture

Use a separated frontend/backend architecture.

```text
VisayasBucketList/
│
├── frontend/
│   ├── Vue.js 3
│   ├── Vite
│   ├── Pinia
│   ├── Vue Router
│   └── Tailwind CSS
│
├── backend/
│   ├── Node.js
│   ├── Express.js
│   ├── Prisma
│   └── REST API
│
└── database/
    └── Neon PostgreSQL
```

The frontend must NOT directly connect to PostgreSQL.

The frontend communicates only with the backend API.

The backend is responsible for:
- Authentication
- Authorization
- Validation
- Business logic
- Database queries
- API responses

---

# 5. Frontend Design

## Main Pages

### Public Pages

1. Home
2. Explore Destinations
3. Destination Details
4. Login
5. Register

### Authenticated User Pages

6. My Bucket List
7. Favorites
8. Visited Destinations
9. Profile
10. Achievements

### Admin Pages

11. Admin Dashboard
12. Manage Destinations
13. Add Destination
14. Edit Destination
15. Manage Users
16. Manage Reviews
17. Manage Categories

---

# 6. Vue.js Folder Structure

```text
frontend/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── DestinationCard.vue
│   │   ├── DestinationGrid.vue
│   │   ├── SearchBar.vue
│   │   ├── FilterPanel.vue
│   │   ├── RatingStars.vue
│   │   ├── ReviewCard.vue
│   │   ├── BucketListCard.vue
│   │   ├── ProgressBar.vue
│   │   └── AchievementCard.vue
│   │
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Explore.vue
│   │   ├── DestinationDetails.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── BucketList.vue
│   │   ├── Favorites.vue
│   │   ├── Visited.vue
│   │   ├── Profile.vue
│   │   ├── Achievements.vue
│   │   ├── AdminDashboard.vue
│   │   ├── AdminDestinations.vue
│   │   ├── AdminUsers.vue
│   │   └── AdminReviews.vue
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── stores/
│   │   ├── auth.js
│   │   ├── destination.js
│   │   └── bucketList.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── layouts/
│   │   ├── DefaultLayout.vue
│   │   └── AdminLayout.vue
│   │
│   ├── App.vue
│   └── main.js
│
├── .env
├── package.json
└── vite.config.js
```

---

# 7. Backend Folder Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── destinationController.js
│   │   ├── bucketListController.js
│   │   ├── favoriteController.js
│   │   ├── reviewController.js
│   │   ├── categoryController.js
│   │   └── achievementController.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── destinationService.js
│   │   ├── bucketListService.js
│   │   ├── reviewService.js
│   │   └── achievementService.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── bucketListRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── achievementRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── destinationValidator.js
│   │   └── reviewValidator.js
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── server.js
│
├── .env
├── package.json
└── prisma.config.js
```

---

# 8. Neon PostgreSQL Database

Use Neon as the hosted PostgreSQL database.

Recommended environment variable:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Never put the Neon connection string inside frontend code.

Only the backend should access DATABASE_URL.

Recommended ORM:

```text
Prisma ORM
      ↓
Neon PostgreSQL
```

---

# 9. Database Entity Relationship Design

Main entities:

```text
User
  |
  +------< BucketList >------ Destination
  |
  +------< Favorite >-------- Destination
  |
  +------< Review >---------- Destination
  |
  +------< UserAchievement >- Achievement

Destination
  |
  +------ Category
  |
  +------ Province/Region information
```

---

# 10. PostgreSQL Database Tables

## users

```text
users
-----------------------------
id              UUID PK
name            VARCHAR
email           VARCHAR UNIQUE
password_hash   VARCHAR
profile_image   TEXT NULL
role            ENUM
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

Roles:

```text
USER
ADMIN
```

---

## destinations

```text
destinations
--------------------------------
id                  UUID PK
name                VARCHAR
slug                VARCHAR UNIQUE
description         TEXT
province            VARCHAR
region              VARCHAR
location            VARCHAR
latitude            DECIMAL NULL
longitude           DECIMAL NULL
estimated_budget    DECIMAL NULL
recommended_days   INTEGER NULL
image_url           TEXT NULL
category_id         UUID FK
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

## categories

```text
categories
-------------------------
id              UUID PK
name            VARCHAR UNIQUE
description     TEXT NULL
created_at      TIMESTAMP
```

Example categories:

```text
Beach
Mountain
Waterfall
Nature
Adventure
Historical
Cultural
Food
Island
Festival
```

---

## bucket_lists

```text
bucket_lists
--------------------------------
id              UUID PK
user_id         UUID FK
destination_id  UUID FK
status          ENUM
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

Status:

```text
WANT_TO_VISIT
VISITED
```

Constraint:

```text
A user cannot add the same destination twice.
```

Use a unique constraint on:

```text
(user_id, destination_id)
```

---

## favorites

```text
favorites
-------------------------
id              UUID PK
user_id         UUID FK
destination_id  UUID FK
created_at      TIMESTAMP
```

Unique constraint:

```text
(user_id, destination_id)
```

---

## reviews

```text
reviews
-------------------------
id              UUID PK
user_id         UUID FK
destination_id  UUID FK
rating          INTEGER
comment         TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

Rating must be:

```text
1 to 5
```

A user should only be allowed to have one review per destination.

Unique constraint:

```text
(user_id, destination_id)
```

---

## achievements

```text
achievements
-------------------------
id              UUID PK
name            VARCHAR
description     TEXT
icon            VARCHAR NULL
requirement     INTEGER
created_at      TIMESTAMP
```

Examples:

```text
Island Explorer
Visit 5 destinations

Beach Hopper
Visit 10 beaches

Peak Seeker
Visit 3 mountains

Visayas Explorer
Visit destinations from all 3 Visayas regions
```

---

## user_achievements

```text
user_achievements
-------------------------
id              UUID PK
user_id         UUID FK
achievement_id  UUID FK
earned_at       TIMESTAMP
```

Unique constraint:

```text
(user_id, achievement_id)
```

---

# 11. API Design

Base URL:

```text
/api
```

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Register request:

```json
{
  "name": "Christian Carl",
  "email": "user@example.com",
  "password": "password"
}
```

---

# 12. Destination API

```http
GET    /api/destinations
GET    /api/destinations/:id
POST   /api/destinations
PUT    /api/destinations/:id
DELETE /api/destinations/:id
```

Search example:

```http
GET /api/destinations?search=cebu
```

Filter example:

```http
GET /api/destinations?region=Central%20Visayas
```

Category filter:

```http
GET /api/destinations?category=Beach
```

Combined:

```http
GET /api/destinations?region=Central%20Visayas&category=Beach
```

Pagination:

```http
GET /api/destinations?page=1&limit=12
```

---

# 13. Bucket List API

```http
GET    /api/bucketlist
POST   /api/bucketlist
PUT    /api/bucketlist/:id
DELETE /api/bucketlist/:id
```

Example:

```json
{
  "destinationId": "destination-uuid"
}
```

To mark as visited:

```http
PUT /api/bucketlist/:id
```

```json
{
  "status": "VISITED"
}
```

---

# 14. Favorite API

```http
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:destinationId
```

---

# 15. Review API

```http
GET    /api/destinations/:id/reviews
POST   /api/destinations/:id/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id
```

Example:

```json
{
  "rating": 5,
  "comment": "Amazing place and beautiful scenery!"
}
```

---

# 16. Category API

```http
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Admin-only modification routes.

---

# 17. User API

```http
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/password
```

---

# 18. Achievement API

```http
GET /api/achievements
GET /api/achievements/my
```

Achievements can be automatically checked by the backend whenever a user marks a destination as VISITED.

---

# 19. Authentication Flow

```text
User
 |
 | Register/Login
 v
Vue.js
 |
 | POST /api/auth/login
 v
Node.js
 |
 | Validate credentials
 v
PostgreSQL
 |
 | User found
 v
Node.js
 |
 | Generate JWT
 v
Vue.js
 |
 | Store authentication state
 v
Authenticated User
```

Protected requests:

```text
Vue.js
   |
   | Authorization: Bearer <JWT>
   v
Express Middleware
   |
   | Verify JWT
   v
Controller
   |
   v
Database
```

Passwords must never be stored as plain text.

Use bcrypt/bcryptjs.

---

# 20. UI/UX Design Direction

The visual identity should feel like a modern Philippine travel platform.

Recommended style:

- Tropical
- Clean
- Modern
- Friendly
- Image-focused
- Mobile responsive

Recommended colors:

```text
Primary:     Deep Ocean Blue
Secondary:   Tropical Green
Accent:      Sunset Orange
Background:  Warm Off-White / Sand
Text:        Dark Navy
```

Do not overcrowd the interface.

Use:
- Rounded cards
- Large destination images
- Clean typography
- Simple icons
- Subtle hover animations
- Clear CTA buttons
- Responsive layouts

---

# 21. Homepage Layout

```text
---------------------------------------------------
NAVBAR

VisayasBucketList
Home | Explore | Bucket List | About | Login
---------------------------------------------------

                HERO SECTION

       DISCOVER THE VISAYAS
       One destination at a time.

   Search your next adventure...

           [ Explore Now ]

---------------------------------------------------

             POPULAR DESTINATIONS

 [Image]       [Image]       [Image]
 Boracay       Cebu          Bohol

---------------------------------------------------

             EXPLORE BY CATEGORY

 Beach | Mountain | Waterfall | Nature | Culture

---------------------------------------------------

              VISAYAS REGIONS

 Western Visayas
 Central Visayas
 Eastern Visayas

---------------------------------------------------

          YOUR TRAVEL PROGRESS

       8 / 50 Destinations

       ████████░░░░░░░

---------------------------------------------------

FOOTER
---------------------------------------------------
```

---

# 22. Destination Card

Each destination card should contain:

```text
+-----------------------------+
|                             |
|       DESTINATION IMAGE     |
|                             |
+-----------------------------+
| Kawasan Falls               |
| Badian, Cebu                |
| ⭐ 4.8                      |
| Nature • Adventure           |
|                             |
| [View Details] [♡]          |
+-----------------------------+
```

---

# 23. Destination Details

```text
---------------------------------------------------
Destination Image
---------------------------------------------------

Kawasan Falls
Badian, Cebu

⭐ 4.8 / 5

[ + Add to Bucket List ]
[ ♡ Favorite ]

About
Description of the destination...

---------------------------------------------------

Destination Information

📍 Location
Badian, Cebu

🏷 Category
Nature / Adventure

💰 Estimated Budget
₱1,500 - ₱3,000

🕐 Recommended Duration
1-2 Days

---------------------------------------------------

Reviews

⭐⭐⭐⭐⭐
User Name
Review comment...

[ Write a Review ]

---------------------------------------------------
```

---

# 24. Bucket List Design

```text
MY BUCKET LIST

My Progress

12 / 50 completed

████████████░░░░░░░░ 24%

----------------------------------

Want to Visit

[Image] Kawasan Falls
[Image] Bantayan Island
[Image] Gigantes Islands

----------------------------------

Visited

✓ Chocolate Hills
✓ Osmeña Peak
✓ Boracay
```

---

# 25. Admin Dashboard

Dashboard statistics:

```text
Total Users
Total Destinations
Total Reviews
Total Bucket List Entries
```

Example:

```text
+-------------+ +-------------+
|  250 Users  | | 85 Places   |
+-------------+ +-------------+

+-------------+ +-------------+
| 430 Reviews | | 1,240 Saves |
+-------------+ +-------------+
```

Admin functions:

```text
Destinations
  ├── View
  ├── Add
  ├── Edit
  └── Delete

Users
  ├── View
  ├── Manage
  └── Disable

Reviews
  ├── View
  └── Delete/Moderate

Categories
  ├── Add
  ├── Edit
  └── Delete
```

---

# 26. Image Handling

The initial version does NOT use Cloudinary or another image-hosting service.

Destination images are represented by URLs stored in the PostgreSQL database.

Example:

```json
{
  "name": "Kawasan Falls",
  "province": "Cebu",
  "region": "Central Visayas",
  "image_url": "https://example.com/kawasan-falls.jpg"
}
```

The frontend displays the image using the stored `image_url`. For the initial version, administrators can provide valid image URLs when creating or editing destinations.

If direct image uploads are needed in a future version, an image-storage provider can be added later without changing the main PostgreSQL architecture.

---

# 27. Security Requirements

The backend must implement:

1. Password hashing using bcrypt
2. JWT authentication
3. Role-based authorization
4. Request validation
5. CORS configuration
6. Environment variables
7. SQL injection protection through Prisma ORM
8. Rate limiting for authentication endpoints
9. Secure HTTP headers
10. Proper error handling
11. Never expose DATABASE_URL to the frontend
12. Never return password_hash in API responses

---

# 28. Environment Variables

Backend `.env`:

```env
PORT=5000

DATABASE_URL="YOUR_NEON_DATABASE_URL"

JWT_SECRET="YOUR_JWT_SECRET"

CLIENT_URL="http://localhost:5173"
```

No Cloudinary environment variables are required.

``````

Frontend `.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

Do not commit `.env` files to GitHub.

---

# 29. Development Order

Build the project in this order:

### Phase 1 — Project Setup

1. Create Vue.js frontend
2. Create Node.js/Express backend
3. Configure Git
4. Configure environment variables
5. Connect Prisma to Neon PostgreSQL

### Phase 2 — Database

6. Create Prisma schema
7. Create migrations
8. Seed categories
9. Seed initial destinations
10. Test database connection

### Phase 3 — Authentication

11. Register
12. Login
13. JWT authentication
14. Protected routes
15. Admin authorization

### Phase 4 — Destinations

16. Destination CRUD
17. Destination cards
18. Destination details
19. Search
20. Filters
21. Pagination

### Phase 5 — Bucket List

22. Add destination
23. Remove destination
24. Mark as visited
25. Display progress
26. Favorites

### Phase 6 — Reviews

27. Add review
28. Edit review
29. Delete review
30. Rating calculation

### Phase 7 — Achievements

31. Create achievements
32. Track visited destinations
33. Unlock achievements

### Phase 8 — Admin

34. Admin dashboard
35. Destination management
36. User management
37. Review management
38. Category management

### Phase 9 — UI/UX

39. Responsive mobile design
40. Loading states
41. Empty states
42. Error messages
43. Toast notifications
44. Final visual polishing

### Phase 10 — Deployment

45. Deploy Vue frontend
46. Deploy Node.js backend
47. Configure Neon PostgreSQL
48. Configure production environment variables
49. Configure CORS
50. Test production APIs

---

# 29. Important Implementation Rules for CLI

When implementing this project:

1. Use Vue.js 3 with Composition API.
2. Use JavaScript unless TypeScript is specifically requested.
3. Use Node.js + Express.js for the backend.
4. Use PostgreSQL through Neon.
5. Use Prisma ORM.
6. Do not connect Vue.js directly to Neon.
7. Use REST APIs between frontend and backend.
8. Use JWT for authentication.
9. Use bcrypt/bcryptjs for passwords.
10. Keep controllers, services, routes, middleware, and database logic separated.
11. Use reusable Vue components.
12. Keep API calls inside the frontend services layer.
13. Use Pinia for global authentication and bucket-list state.
14. Use Vue Router for navigation.
15. Make the entire UI responsive.
16. Use environment variables for secrets and API URLs.
17. Do not hardcode database credentials.
18. Add proper validation on both frontend and backend.
19. Add loading, success, empty, and error states.
20. Keep the code beginner-friendly and maintainable.
21. Store destination image URLs in PostgreSQL; do not require Cloudinary for the initial version.

---

# 30. Final Architecture

```text
                       VISYASBUCKETLIST
                              |
              +---------------+---------------+
              |                               |
              v                               v
       VUE.JS 3 FRONTEND               NODE.JS BACKEND
       +---------------+                +---------------+
       | Vue Router    |                | Express.js    |
       | Pinia         |                | REST API      |
       | Axios         |                | JWT Auth      |
       | Tailwind CSS  |                | Validation    |
       +-------+-------+                +-------+-------+
               |                                |
               | HTTP/JSON                      |
               +--------------->----------------+
                                                |
                                                v
                                         +-------------+
                                         |   PRISMA    |
                                         |     ORM     |
                                         +------+------+
                                                |
                                                v
                                      +-------------------+
                                      | NEON POSTGRESQL   |
                                      |                   |
                                      | Users             |
                                      | Destinations      |
                                      | Categories        |
                                      | Bucket Lists      |
                                      | Favorites         |
                                      | Reviews           |
                                      | Achievements      |
                                      +-------------------+

                    IMAGE DATA
                         |
                         v
                  image_url in
                Neon PostgreSQL
```

## Project Goal

The final system should provide a simple but complete travel platform where users can discover destinations across the Visayas, build their own travel bucket list, track visited locations, review destinations, and monitor their travel progress.

The core architecture is:

**Vue.js 3 → Node.js/Express.js REST API → Prisma → Neon PostgreSQL**

This architecture should be used as the primary technical specification when generating the project code.
