# 🎬 MovieMania

<div align="center">

![MovieMania Banner](https://img.shields.io/badge/MovieMania-Personal%20Movie%20Tracker-6366f1?style=for-the-badge&logo=film&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A production-grade MERN stack application for tracking and showcasing your watched movies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference)

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

### 📋 Intelligent Watchlist System
- **🔥 Priority Levels** - High/Medium/Low with fire, star, and thought bubble icons
- **📝 Notes & Source Tracking** - Remember why you added each movie
- **🎯 Target Watch Dates** - Set when you plan to watch
- **✅ Move to Watched** - Convert watchlist items with rating and review

### 🎥 YouTube Trailer Integration
- **▶️ Embedded Trailers** - Watch trailers directly on movie detail pages
- **🖼️ Thumbnail Preview** - Click-to-play with video thumbnails
- **🎭 Theater Mode** - Expand to fullscreen viewing

### 📊 Advanced Statistics Dashboard
- **📈 Genre Pie Chart** - Visual breakdown of your genre preferences
- **📉 Rating Distribution** - Color-coded bar chart from red to green
- **📅 Activity Heatmap** - GitHub-style calendar showing daily viewing
- **🔥 Watching Streaks** - Current and longest streak tracking
- **🎬 Decade Breakdown** - Movies grouped by release decade
- **👥 Top Directors & Actors** - Your most-watched credits

### 📁 Smart Movie Collections
- **🎨 Custom Collections** - Create themed lists with emoji and colors
- **📌 Pin Favorites** - Pin important collections to the top
- **🏷️ Collection Templates** - Quick-start with Favorites, Top Rated, Sci-Fi, etc.
- **🖼️ Auto Cover Images** - Collections show poster grid preview

### 🌍 Streaming Availability ("Where to Watch")
- **📺 Multi-Region Support** - 8 countries (IN, US, GB, CA, AU, DE, FR, JP)
- **🎬 Provider Categories** - Stream, Rent, Buy, Free with Ads
- **🏷️ Provider Logos** - Visual logos with hover tooltips
- **🔗 JustWatch Integration** - Link to full availability info

### 🎨 UI/UX Features
- **🌓 Dark Mode** - Elegant dark theme with system preference detection
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **✨ Smooth Animations** - Framer Motion powered transitions
- **⚡ Lazy Loading** - Code-split pages for faster initial load
- **🛡️ Error Boundaries** - Graceful error handling with retry

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
| **Recharts** | Data visualization |
| **Lucide React** | Icons |

### External APIs
| Service | Purpose |
|---------|---------|
| **TMDB API** | Movie data, posters, metadata, trailers, streaming providers |

---

## 📁 Project Structure

```
MovieMania/
├── 📦 package.json          # Root package with concurrently
├── 📂 server/               # Backend API
│   ├── src/
│   │   ├── config/          # Database & environment config
│   │   ├── models/          # Mongoose schemas (Movie, User, WatchlistMovie, Collection)
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
    │   ├── components/
    │   │   ├── common/      # Button, Modal, ErrorBoundary, EmptyState
    │   │   ├── layout/      # Navbar, Footer, Layout
    │   │   ├── auth/        # Login, Register forms
    │   │   ├── movies/      # MovieCard, TrailerPlayer, WhereToWatch
    │   │   ├── watchlist/   # WatchlistCard, AddToWatchlistModal
    │   │   ├── collections/ # CollectionCard, CreateCollectionModal
    │   │   ├── stats/       # Charts (Pie, Bar, Heatmap, Timeline)
    │   │   └── filters/     # FilterBar, SearchBar
    │   ├── pages/           # Route pages
    │   ├── hooks/           # Custom React hooks
    │   ├── context/         # Auth & Theme contexts
    │   ├── services/        # API services
    │   └── utils/           # Helpers & constants
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
4. **Manage your watchlist** - Add movies you want to watch later
5. **Create collections** - Organize movies into themed lists
6. **View statistics** - Explore your watching patterns with charts
7. **Check streaming** - See where movies are available to watch

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

### Movies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/movies` | List all movies (with filters) | ❌ |
| `GET` | `/movies/:id` | Get single movie | ❌ |
| `POST` | `/movies` | Add new movie | ✅ |
| `PUT` | `/movies/:id` | Update movie | ✅ |
| `DELETE` | `/movies/:id` | Delete movie | ✅ |

### Watchlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/watchlist` | Get user's watchlist | ✅ |
| `POST` | `/watchlist` | Add to watchlist | ✅ |
| `PUT` | `/watchlist/:id` | Update watchlist item | ✅ |
| `DELETE` | `/watchlist/:id` | Remove from watchlist | ✅ |
| `POST` | `/watchlist/:id/watched` | Move to watched | ✅ |

### Collections

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/collections` | Get user's collections | ✅ |
| `POST` | `/collections` | Create collection | ✅ |
| `GET` | `/collections/:id` | Get collection details | ✅ |
| `PUT` | `/collections/:id` | Update collection | ✅ |
| `DELETE` | `/collections/:id` | Delete collection | ✅ |
| `POST` | `/collections/:id/movies` | Add movie to collection | ✅ |
| `DELETE` | `/collections/:id/movies/:movieId` | Remove movie | ✅ |

### TMDB Proxy

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tmdb/search?query=...` | Search TMDB movies | ✅ |
| `GET` | `/tmdb/movie/:tmdbId` | Get movie details | ✅ |
| `GET` | `/tmdb/movie/:tmdbId/videos` | Get trailers | ❌ |
| `GET` | `/tmdb/movie/:tmdbId/providers` | Get streaming providers | ❌ |
| `GET` | `/tmdb/trending` | Get trending movies | ❌ |
| `GET` | `/tmdb/popular` | Get popular movies | ❌ |

### Statistics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/stats` | Overall statistics | ❌ |
| `GET` | `/stats/by-rating` | Rating distribution | ❌ |
| `GET` | `/stats/by-genre` | Genre breakdown | ❌ |
| `GET` | `/stats/by-decade` | Movies by decade | ❌ |
| `GET` | `/stats/heatmap` | Activity heatmap | ❌ |
| `GET` | `/stats/streaks` | Watching streaks | ❌ |
| `GET` | `/stats/credits` | Top directors/actors | ❌ |

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
| `TMDB_API_KEY` | ✅ | Your TMDB API key |

### Frontend (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | API base URL (default: /api) |

---

## 🗺️ Roadmap

- [x] ~~Watchlist feature~~
- [x] ~~YouTube trailer integration~~
- [x] ~~Advanced statistics dashboard~~
- [x] ~~Smart collections~~
- [x] ~~Streaming availability~~
- [x] ~~Export movies to CSV/JSON~~
- [x] ~~Import from Letterboxd/IMDb~~
- [x] ~~Social sharing~~
- [ ] Movie recommendations
- [ ] TV shows support
- [ ] Mobile app (React Native)

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
- [JustWatch](https://www.justwatch.com/) for streaming availability data
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for beautiful charts
- [Lucide](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for animations

---

<div align="center">

**Made with ❤️ for movie lovers**

[⬆ Back to top](#-moviemania)

</div>
