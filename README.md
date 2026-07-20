# 🌍 OpenPlaces — REST API

Backend API for [OpenPlaces](https://openplaces.netlify.app) — a collaborative map for discovering eco-friendly, accessible businesses.

**🔗 Live API:** [openplaces-api.vercel.app](https://openplaces-api.vercel.app)

**🎨 Frontend repository:** [OpenPlaces Frontend](https://github.com/FabioDeiana/Frontend)

## ✨ Features

- **RESTful API** with role-based access control (user / owner / admin)
- **JWT authentication** — short-lived access tokens + httpOnly refresh token cookies
- **Community moderation workflow** — user-submitted places require admin approval (pending/approved/rejected)
- **Reviews system** — multi-criteria ratings with one-review-per-user constraint and edit support
- **Advanced filtering** — query places by category, city, dietary tags, accessibility features and food bases
- **Restaurant menus** — menu items with allergen and dietary tags
- **Newsletter** — subscription for both anonymous visitors and registered users
- **AI chat endpoint** — place recommendations powered by OpenRouter, aware of user preferences and the live database
- **Serverless-ready** — cached MongoDB connection pattern for Vercel deployment
- **Security** — Helmet, CORS, rate limiting, bcrypt password hashing

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT** (jsonwebtoken) + **bcryptjs**
- **OpenRouter API** — AI chatbot
- Deployed as **serverless functions on Vercel** (Dockerfile also included for container-based hosting)

## 📚 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | — |
| POST | `/api/auth/login` | Login | — |
| POST | `/api/auth/refresh` | Refresh access token | cookie |
| GET/PUT | `/api/auth/me` | Get / update profile | ✅ |
| GET | `/api/auth/me/reviews` | Current user's reviews | ✅ |
| GET | `/api/activities` | List approved places (with filters) | — |
| POST | `/api/activities` | Suggest a place (pending for non-admin) | ✅ |
| GET | `/api/activities/pending` | List pending proposals | admin |
| PUT | `/api/activities/:id/moderate` | Approve / reject proposal | admin |
| GET/POST | `/api/activities/:id/reviews` | Reviews of a place | GET — / POST ✅ |
| GET | `/api/activities/:id/menu` | Menu items (restaurants) | — |
| POST | `/api/chat` | AI assistant | — |
| GET/PUT/DELETE | `/api/admin/users[/:id]` | User management | admin |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/FabioDeiana/Backend.git
cd Backend

# Install dependencies
npm install

# Create .env file with:
# MONGODB_URI=your-mongodb-connection-string
# JWT_SECRET=your-secret
# JWT_REFRESH_SECRET=your-refresh-secret
# JWT_EXPIRATION=15m
# JWT_REFRESH_EXPIRATION=7d
# OPENROUTER_API_KEY=your-key
# CLIENT_URL=http://localhost:5173

# Start dev server
npm run dev
```

## 👤 Author

**Fabio Deiana** — Full Stack Developer

[LinkedIn](https://www.linkedin.com/in/fabiodeiana/) · [GitHub](https://github.com/FabioDeiana)