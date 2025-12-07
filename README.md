# 🎬 MovieMania

<div align="center">

![MovieMania Banner](https://img.shields.io/badge/MovieMania-Personal%20Movie%20Tracker-6366f1?style=for-the-badge&logo=film&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A production-grade MERN stack application for tracking and showcasing your watched movies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🎯 Core Features
- **🔐 Secure Authentication** - JWT-based auth with access/refresh token pattern
- **🎬 TMDB Integration** - Search and import movies from The Movie Database
- **⭐ Personal Ratings** - Rate movies from 0-5 with half-star precision
- **📝 Reviews & Notes** - Write reviews and private notes for each movie
- **🏷️ Custom Tags** - Organize movies with your own tags
- **❤️ Favorites** - Mark your all-time favorite movies
- **📊 Statistics** - Beautiful analytics and insights about your watching habits

### 🎨 UI/UX Features
- **🌓 Dark Mode** - Elegant dark theme with system preference detection
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **✨ Smooth Animations** - Framer Motion powered transitions
- **⚡ Fast & Optimized** - Vite + React Query for blazing performance
- **🔍 Advanced Filtering** - Search, filter by rating, year, tags, and more

### 🔒 Security Features
- HTTP-only cookies for refresh tokens
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet security headers

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | Runtime environment |
| **Express.js 4** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **express-validator** | Input validation |
| **Helmet** | Security headers |
| **express-rate-limit** | Rate limiting |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool |
| **Tailwind CSS 3** | Styling |
| **React Router 6** | Routing |
| **TanStack Query** | Server state management |
| **React Hook Form + Zod** | Form handling & validation |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |

### External APIs
| Service | Purpose |
|---------|---------|
| **TMDB API** | Movie data, posters, metadata |

---

## 📁 Project Structure

```
MovieMania/
├── 📦 package.json          # Root package with concurrently
├── 📂 server/               # Backend API
│   ├── src/
│   │   ├── config/          # Database & environment config
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── services/        # TMDB API, token management
│   │   ├── utils/           # Helpers & error classes
│   │   ├── app.js           # Express configuration
│   │   └── server.js        # Entry point
│   ├── .env.example         # Environment template
│   └── package.json
│
└── 📂 client/               # Frontend React App
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   ├── common/      # Button, Input, Modal, etc.
    │   │   ├── layout/      # Navbar, Footer, Layout
    │   │   ├── auth/        # Login, Register forms
    │   │   ├── movies/      # MovieCard, MovieGrid, MovieForm
    │   │   ├── filters/     # FilterBar, SearchBar
    │   │   └── tmdb/        # TMDB search components
    │   ├── pages/           # Route pages
    │   ├── hooks/           # Custom React hooks
    │   ├── context/         # Auth & Theme contexts
    │   ├── services/        # API services
    │   └── utils/           # Helpers & constants
    ├── .env.example         # Environment template
    ├── tailwind.config.js   # Tailwind customization
    └── package.json
```

---

## 🚀 Installation

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **TMDB API Key** - [Get free API key](https://www.themoviedb.org/settings/api)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moviemania.git
   cd moviemania
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   Or install separately:
   ```bash
   npm install              # Root dependencies
   npm install --prefix server   # Backend
   npm install --prefix client   # Frontend
   ```

3. **Configure environment variables**
   
   Create `server/.env` from the example:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Update with your values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/moviemania
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   REFRESH_TOKEN_SECRET=another_super_secret_key
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This runs both servers concurrently:
   - 🖥️ **Backend**: http://localhost:5000
   - 🌐 **Frontend**: http://localhost:5173

---

## 📖 Usage

### Getting Started

1. **Register an account** at http://localhost:5173/register
2. **Login** with your credentials
3. **Add your first movie**:
   - Click "Add Movie" in the navbar
   - Search for a movie by title
   - Select it and add your rating, review, and tags
4. **Browse your collection** on the home page
5. **View statistics** to see your watching patterns

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both servers in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend server |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the backend in production mode |

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create new account | ❌ |
| `POST` | `/auth/login` | Login & get tokens | ❌ |
| `POST` | `/auth/refresh` | Refresh access token | ❌ |
| `POST` | `/auth/logout` | Logout user | ✅ |
| `GET` | `/auth/me` | Get current user | ✅ |
| `PATCH` | `/auth/me` | Update profile | ✅ |

### Movies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/movies` | List all movies (with filters) | ❌ |
| `GET` | `/movies/:id` | Get single movie | ❌ |
| `POST` | `/movies` | Add new movie | ✅ |
| `PUT` | `/movies/:id` | Update movie | ✅ |
| `DELETE` | `/movies/:id` | Delete movie | ✅ |
| `GET` | `/movies/tags` | Get all unique tags | ❌ |

### Query Parameters for GET /movies

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `sort` | string | Sort field (watchedDate, myRating, title, year) |
| `order` | string | Sort order (asc, desc) |
| `search` | string | Search in title/review |
| `minRating` | number | Minimum rating filter |
| `maxRating` | number | Maximum rating filter |
| `yearMin` | number | Minimum release year |
| `yearMax` | number | Maximum release year |
| `tags` | string | Comma-separated tags |
| `isFavorite` | boolean | Filter favorites only |

### TMDB Proxy

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tmdb/search?query=...` | Search TMDB movies | ✅ |
| `GET` | `/tmdb/movie/:tmdbId` | Get movie details | ✅ |
| `GET` | `/tmdb/trending` | Get trending movies | ❌ |
| `GET` | `/tmdb/popular` | Get popular movies | ❌ |

### Statistics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/stats` | Overall statistics | ❌ |
| `GET` | `/stats/by-rating` | Rating distribution | ❌ |
| `GET` | `/stats/by-genre` | Genre breakdown | ❌ |
| `GET` | `/stats/by-year` | Movies by year | ❌ |
| `GET` | `/stats/timeline` | Watching timeline | ❌ |
| `GET` | `/stats/tags` | Top tags | ❌ |

---

## 🔐 Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Environment (development/production) |
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for access tokens (32+ chars) |
| `REFRESH_TOKEN_SECRET` | ✅ | Secret for refresh tokens |
| `JWT_EXPIRES_IN` | No | Access token expiry (default: 15m) |
| `REFRESH_TOKEN_EXPIRES_IN` | No | Refresh token expiry (default: 7d) |
| `TMDB_API_KEY` | ✅ | Your TMDB API key |
| `ALLOWED_ORIGINS` | No | CORS origins (comma-separated) |

### Frontend (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | API base URL (default: /api) |

---

## 📸 Screenshots

### Home Page
*Browse your movie collection with filtering and search*

### Movie Detail
*View detailed information about each movie*

### Add Movie
*Search TMDB and add movies with your rating and review*

### Statistics
*Visual insights into your watching habits*

### Dark Mode
*Beautiful dark theme for comfortable viewing*

---

## 🗺️ Roadmap

- [ ] Export movies to CSV/JSON
- [ ] Import from Letterboxd/IMDb
- [ ] Watchlist feature
- [ ] Social sharing
- [ ] Movie recommendations
- [ ] TV shows support
- [ ] Mobile app (React Native)
- [ ] Browser extension

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie data API
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [Lucide](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

<div align="center">

**Made with ❤️ for movie lovers**

[⬆ Back to top](#-moviemania)

</div>
