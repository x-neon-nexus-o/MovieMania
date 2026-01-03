<div align="center">

# 🎬 MovieMania

<img src="https://img.shields.io/badge/MovieMania-Your%20Personal%20Cinema-6366f1?style=for-the-badge&logo=film&logoColor=white" alt="MovieMania" />

### **Track what you watch. Discover what's next. Own your entertainment journey.**

<br />

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TMDB](https://img.shields.io/badge/TMDB-Powered-01D277?style=flat-square&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[🚀 Quick Start](#-quick-start) • [✨ Features](#-feature-highlights) • [📺 TV Shows](#-tv-shows-tracking) • [📖 Documentation](#-documentation) • [🛠️ Tech Stack](#️-tech-stack)

---

</div>

## 🎯 What is MovieMania?

MovieMania is a **full-featured entertainment tracking platform** built with the MERN stack. Track both **movies and TV shows** with personal ratings, reviews, watch progress, and get personalized recommendations. It's designed for entertainment enthusiasts who want more than just a list — they want **insights, organization, and discovery**.

<table>
<tr>
<td width="50%">

### 🎬 For Movie Lovers
- Log every movie you watch with personal ratings & reviews
- Create themed collections for any occasion
- See exactly where movies are streaming
- Get AI-powered recommendations based on your taste

</td>
<td width="50%">

### 📺 For TV Enthusiasts
- Track TV series with season & episode progress
- Visual progress bars showing completion percentage
- Status tracking: Watching, Completed, On Hold, Dropped, Plan to Watch
- TMDB integration for accurate show metadata

</td>
</tr>
<tr>
<td width="50%">

### 📊 For Data Enthusiasts
- Beautiful stats dashboard with charts & heatmaps
- Track your watching streaks and patterns
- Discover your favorite genres, directors, actors
- Export your entire collection to CSV or JSON

</td>
<td width="50%">

### 🎨 Premium UI/UX
- Modern glassmorphism design with dark mode
- Smooth animations powered by Framer Motion
- Responsive layout for all devices
- Intuitive dropdown navigation

</td>
</tr>
</table>

---

## 🚀 Quick Start

Get up and running in **under 5 minutes**:

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/moviemania.git && cd moviemania

# 2. Install everything
npm run install:all

# 3. Configure your environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and TMDB API key

# 4. Launch!
npm run dev
```

Open **http://localhost:5173** and start tracking! 🎉

<details>
<summary>📋 <b>What you'll need</b> (click to expand)</summary>

| Requirement | Get it here |
|------------|-------------|
| Node.js 18+ | [nodejs.org](https://nodejs.org/) |
| MongoDB | [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works!) |
| TMDB API Key | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (free) |

</details>

---

## ✨ Feature Highlights

<table>
<tr>
<td align="center" width="20%">
<h3>🎬</h3>
<b>Smart Logging</b><br/>
<sub>TMDB integration • Ratings • Reviews • Tags</sub>
</td>
<td align="center" width="20%">
<h3>📺</h3>
<b>TV Tracking</b><br/>
<sub>Episodes • Progress bars • Watch status • Seasons</sub>
</td>
<td align="center" width="20%">
<h3>📋</h3>
<b>Watchlist</b><br/>
<sub>Priorities • Notes • Target dates • Move to watched</sub>
</td>
<td align="center" width="20%">
<h3>📁</h3>
<b>Collections</b><br/>
<sub>Themed lists • Emoji icons • Auto-posters • Pin favorites</sub>
</td>
<td align="center" width="20%">
<h3>📊</h3>
<b>Statistics</b><br/>
<sub>Charts • Heatmaps • Streaks • Top credits</sub>
</td>
</tr>
<tr>
<td align="center" width="20%">
<h3>🎥</h3>
<b>Trailers</b><br/>
<sub>YouTube embeds • Thumbnails • Theater mode</sub>
</td>
<td align="center" width="20%">
<h3>🌍</h3>
<b>Where to Watch</b><br/>
<sub>8 regions • Stream/Rent/Buy • Provider logos</sub>
</td>
<td align="center" width="20%">
<h3>🤖</h3>
<b>AI Features</b><br/>
<sub>Smart Search • Predictive Ratings • Review Assistant • Insights</sub>
</td>
<td align="center" width="20%">
<h3>🔄</h3>
<b>Import/Export</b><br/>
<sub>Letterboxd • IMDb • CSV • JSON</sub>
</td>
<td align="center" width="20%">
<h3>🎨</h3>
<b>Theme System</b><br/>
<sub>4 modes • 6 accents • Accessibility • Reading mode</sub>
</td>
</tr>
</table>

---

## 📺 TV Shows Tracking

Track your TV series journey with our comprehensive TV show system:

### Watch Status Options
| Status | Description | Visual |
|--------|-------------|--------|
| **Watching** | Currently watching this series | 🔵 Blue badge |
| **Completed** | Finished all episodes | 🟢 Green badge |
| **On Hold** | Paused temporarily | 🟡 Yellow badge |
| **Dropped** | Stopped watching | 🔴 Red badge |
| **Plan to Watch** | In your queue | 🟣 Purple badge |

### Progress Tracking
- **Season & Episode tracking**: Know exactly where you left off
- **Visual progress bar**: See completion percentage at a glance
- **Animated UI elements**: Smooth progress bar animations
- **Total episode counts**: Track progress against total episodes

### TV Shows Page Features
- **Hero Section**: Beautiful gradient header with stats
- **Status Filter Chips**: Quick filtering by watch status
- **Card Grid**: Clean, compact TV show cards with:
  - Poster image with hover effects
  - Gradient status badges
  - Progress bar with percentage
  - Rating stars
  - Season/episode info
  - Tags

### Adding TV Shows
1. Navigate to **Add New → Add TV Show** in the navbar
2. Search for any TV series via TMDB
3. Select the show and fill in:
   - Your rating (1-5 stars)
   - Watch status
   - Current season & episode
   - Start date
   - Personal review & tags
4. Click **Add to Collection**

### 📊 TV Analytics (SeriesPulse)

Get deep insights into any TV show's episode ratings and quality trends:

| Feature | Description |
|---------|-------------|
| **Season Ratings Chart** | Bar chart showing average rating per season |
| **Episode Heatmap** | Color-coded grid of all episodes by rating |
| **Episode Ratings Table** | Collapsible season-by-season episode list with ratings |
| **Analytics Summary** | Total episodes, average rating, best/worst episode, quality trend |
| **AI Insights** | AI-generated analysis of the show's quality patterns |
| **Show Comparison** | Compare up to 5 shows with side-by-side charts |

**Access**: Navigate to any TV show detail page → Click **"Analytics"** link

**Export Options**:
- 📄 **JSON** — Full analytics data
- 📊 **CSV** — Episode spreadsheet
- 🖼️ **Image** — Screenshot of analytics dashboard

---

## 🤖 AI-Powered Features

MovieMania integrates **Google Gemini AI** to supercharge your entertainment experience:

### 🔍 Smart Search (NLP)
Search using natural language instead of filters:

| Query Example | What it does |
|---------------|-------------|
| "Sci-fi movies from 2020" | Finds Science Fiction movies released in 2020 |
| "Comedy with rating above 8" | High-rated comedies |
| "Movies like Inception but scarier" | AI suggests similar but horror-leaning titles |
| "80s action classics" | Action movies from 1980-1989 |

The AI parses your query into structured filters (genre, year, rating) and uses TMDB's discovery API.

### ✍️ AI Review Assistant
Get help writing better reviews:

| Feature | Description |
|---------|-------------|
| **Generate Draft** | AI writes a review based on your rating and the movie's genre |
| **Expand Thoughts** | Turn bullet points into a polished paragraph |
| **Remove Spoilers** | AI rewrites your review without plot spoilers |
| **Suggest Tags** | Get AI-recommended tags for your review |

### 🔮 Predictive Ratings
See how much you'll enjoy a movie **before** watching:

- **Predicted Rating**: AI estimates your rating (0-5 stars) based on your taste profile
- **Taste Match %**: How well a movie matches your preferences (0-100%)
- **Why Badges**: Hover to see factors like "Matches your love for Sci-Fi"

Predictions appear on movie cards in search results and the Add Movie modal.

### 📊 Auto-Insights (Stats Dashboard)
Discover fun facts about your viewing habits:

- **"Nolan Superfan"** — You've watched 5+ Christopher Nolan films
- **"Weekend Warrior"** — You watch more on weekends
- **"Genre Explorer"** — Diverse taste across many genres

Find these on your **Statistics** page after rating 5+ movies.

---

## 🤖 Smart Recommendations

Our recommendation engine doesn't just show popular content — it learns **your taste**:

| Signal | Weight | What it does |
|--------|--------|--------------|
| **Your Genres** | 40% | Content matching your top-rated genres |
| **Similar Titles** | 25% | "Because you loved Inception..." |
| **Directors/Actors** | 15% | More from creators you love |
| **Mood Match** | 10% | Based on your recent watching patterns |
| **Trending** | 10% | Fresh discoveries you might miss |

Navigate to **Library → For You** in the navbar to see your personalized picks with explanations.

---

## 🌍 Where to Watch

Never wonder "where can I stream this?" again:

- **8 Countries Supported**: 🇮🇳 IN • 🇺🇸 US • 🇬🇧 GB • 🇨🇦 CA • 🇦🇺 AU • 🇩🇪 DE • 🇫🇷 FR • 🇯🇵 JP
- **All Options**: Stream, Rent, Buy, Free with Ads
- **Powered by**: JustWatch via TMDB

---

## 📊 Stats Dashboard

Visualize your entertainment journey:

| Feature | What you'll see |
|---------|-----------------|
| **Genre Pie Chart** | Your favorite genres at a glance |
| **Rating Distribution** | Color-coded from 🔴 to 🟢 |
| **Activity Heatmap** | GitHub-style calendar of your watching |
| **Watching Streaks** | Current streak 🔥 and personal best |
| **Decade Breakdown** | Content grouped by release era |
| **Top Directors** | Who you've watched most |

---

## 🧭 Navigation Structure

The app uses a clean dropdown-based navigation:

| Dropdown | Contents |
|----------|----------|
| **Browse** | Movies • TV Shows • Statistics |
| **Library** | Dashboard • For You • Movie Watchlist • TV Watchlist • Collections |
| **Add New** | Add Movie • Add TV Show |

**Mobile**: Responsive bottom sheet menu with organized sections.

---

## 🌙 Enhanced Theme System

Customize your viewing experience with our comprehensive appearance settings:

### Theme Modes
| Mode | Description |
|------|-------------|
| **Light** | Bright and clean for daytime use |
| **Dark** | Easy on the eyes, reduced eye strain |
| **OLED** | Pure black (#000000) backgrounds, saves battery on OLED displays |
| **Auto** | Automatically follows your system preference |

### Custom Accent Colors
Choose from 6 beautiful accent colors to personalize your experience:
- 💜 **Indigo** (default) • 💟 **Purple** • 💙 **Blue** • 🩵 **Teal** • 💗 **Rose** • 🧡 **Amber**

### Accessibility Features
| Mode | Description |
|------|-------------|
| **Protanopia** | Red-blind friendly color palette |
| **Deuteranopia** | Green-blind friendly color palette |
| **Tritanopia** | Blue-blind friendly color palette |

### Reading Mode
Toggle reading mode for better typography when reading reviews and long descriptions:
- Larger font size
- Increased line height
- Constrained width for comfortable reading

**Access**: Click the ⚙️ settings icon in the navbar to customize all appearance options.

---

## 📖 Documentation

<details>
<summary><b>🗂️ Project Structure</b></summary>

```
MovieMania/
├── 📦 package.json          # Root with concurrently scripts
├── 📂 server/               # Express.js Backend
│   ├── src/
│   │   ├── config/          # Database & env config
│   │   ├── controllers/     # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── movieController.js
│   │   │   ├── tvShowController.js      # TV Show CRUD
│   │   │   ├── watchlistController.js
│   │   │   ├── collectionController.js
│   │   │   ├── statsController.js
│   │   │   └── recommendationController.js
│   │   ├── middleware/      # Auth, validation
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Movie.js
│   │   │   ├── TVShow.js                # TV Show model
│   │   │   ├── WatchlistMovie.js
│   │   │   ├── WatchlistTVShow.js       # TV Watchlist
│   │   │   └── Collection.js
│   │   ├── routes/          # API endpoints
│   │   │   ├── tvShowRoutes.js          # TV Show routes
│   │   │   └── ...
│   │   └── services/        # TMDB, recommendations
│   │       └── tmdbService.js           # Includes TV methods
│   └── .env.example
│
└── 📂 client/               # React + Vite Frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/      # Buttons, Inputs, Modals
    │   │   ├── layout/      # Navbar, Footer
    │   │   ├── movies/      # MovieCard, MovieGrid, MovieForm
    │   │   └── tv/          # TVShowCard, TVShowGrid, TVShowForm
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── TVShowsPage.jsx          # TV list page
    │   │   ├── TVShowDetailPage.jsx     # TV detail page
    │   │   ├── AddTVShowPage.jsx        # Add TV show
    │   │   ├── EditTVShowPage.jsx       # Edit TV show
    │   │   └── ...
    │   ├── hooks/
    │   │   ├── useMovies.js
    │   │   └── useTVShows.js            # TV Show hooks
    │   ├── context/         # Auth & Theme
    │   └── services/
    │       ├── movieService.js
    │       └── tvShowService.js         # TV API service
    └── tailwind.config.js
```
</details>

<details>
<summary><b>📡 API Reference</b></summary>

**Base URL**: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login & get tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate tokens |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | Get all movies (paginated, filterable) |
| GET | `/movies/:id` | Get single movie |
| POST | `/movies` | Add movie to collection |
| PUT | `/movies/:id` | Update movie |
| DELETE | `/movies/:id` | Delete movie |

### TV Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tvshows` | Get all TV shows (paginated, filterable) |
| GET | `/tvshows/:id` | Get single TV show |
| POST | `/tvshows` | Add TV show to collection |
| PUT | `/tvshows/:id` | Update TV show |
| DELETE | `/tvshows/:id` | Delete TV show |

### TMDB Proxy
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tmdb/search?query=...` | Search movies |
| GET | `/tmdb/movie/:id` | Get movie details |
| GET | `/tmdb/tv/search?query=...` | Search TV shows |
| GET | `/tmdb/tv/:id` | Get TV show details |
| GET | `/tmdb/tv/trending` | Trending TV shows |
| GET | `/tmdb/tv/popular` | Popular TV shows |

### Episodes (TV Analytics)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/episodes/:tmdbShowId` | Get all episodes (grouped by season) |
| GET | `/episodes/:tmdbShowId/analytics` | Get show analytics data |
| POST | `/episodes/:tmdbShowId/rate` | Rate an episode (auth required) |
| POST | `/episodes/:tmdbShowId/sync` | Sync episodes from TMDB (auth required) |

### Other Endpoints
| Endpoint | Description |
|----------|-------------|
| `/watchlist/*` | Manage your to-watch list |
| `/collections/*` | Create & manage themed lists |
| `/stats/*` | Aggregated viewing statistics |
| `/recommendations/*` | Personalized suggestions |
| `/ai/search` | Smart NLP-powered search |
| `/ai/review/*` | AI review assistant endpoints |
| `/ai/predict/*` | Rating predictions & taste match |
| `/ai/insights/*` | Auto-generated user insights |
| `/export/*` | Download your data (CSV/JSON) |
| `/import/*` | Upload from Letterboxd/IMDb |

</details>

<details>
<summary><b>🔐 Environment Variables</b></summary>

Create `server/.env`:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/moviemania
JWT_SECRET=your_secret_at_least_32_characters_long
REFRESH_TOKEN_SECRET=another_secret_key_also_32_chars
TMDB_API_KEY=your_tmdb_api_key

# AI Features (Optional but recommended)
GEMINI_API_KEY=your_google_gemini_api_key

# Optional
NODE_ENV=development
PORT=5000
```

</details>

<details>
<summary><b>📜 Available Scripts</b></summary>

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start both servers (recommended) |
| `npm run server` | Backend only |
| `npm run client` | Frontend only |
| `npm run build` | Production build |
| `npm run install:all` | Install all dependencies |

### Verification Scripts
| Script | Description |
|--------|-------------|
| `node server/verify-ai.js` | Test Generative AI integration & API key |
| `node server/verify-api.js` | Check API health & Server connectivity |
| `node server/verify-ai-auth.js` | Verify authenticated API calls (requires local DB) |

</details>

<details>
<summary><b>🎨 UI Components</b></summary>

### Common Components
- **Button** - Primary, Secondary, Ghost, Danger variants
- **Input** - With icons, validation states
- **Modal** - Animated modals with backdrop
- **LoadingSpinner** - Page and inline loaders
- **StarRating** - Interactive 5-star rating
- **ShareButton** - Social sharing

### Movie Components
- **MovieCard** - Poster, rating, date, tags
- **MovieGrid** - Responsive grid layout
- **MovieForm** - Add/edit movie form
- **MovieSearchModal** - TMDB search

### TV Show Components
- **TVShowCard** - Progress bar, status badge, season/episode
- **TVShowGrid** - Responsive TV card grid
- **TVShowForm** - Add/edit TV show form
- **TVSearchModal** - TMDB TV search

### Layout Components
- **Navbar** - Dropdown navigation with user menu
- **Footer** - Links and TMDB attribution

</details>

---

## 🛠️ Tech Stack

<table>
<tr>
<th>Backend</th>
<th>Frontend</th>
<th>External</th>
</tr>
<tr>
<td>

- Node.js 18+
- Express.js 4
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Helmet Security
- Rate Limiting
- CORS

</td>
<td>

- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- TanStack Query
- Framer Motion
- Recharts
- Lucide Icons
- React Hook Form
- Zod Validation

</td>
<td>

- TMDB API
- Google Gemini AI
- JustWatch (via TMDB)
- YouTube Embeds

</td>
</tr>
</table>

---

## 🗺️ Roadmap

| Status | Feature |
|--------|---------|
| ✅ | Movie tracking with ratings & reviews |
| ✅ | Watchlist with priorities |
| ✅ | YouTube trailer integration |
| ✅ | Advanced statistics dashboard |
| ✅ | Smart collections |
| ✅ | Streaming availability |
| ✅ | Export to CSV/JSON |
| ✅ | Import from Letterboxd/IMDb |
| ✅ | Social sharing |
| ✅ | AI-powered recommendations |
| ✅ | **TV shows support** |
| ✅ | Premium dropdown navigation |
| ✅ | **AI Smart Search (NLP)** |
| ✅ | **AI Review Assistant** |
| ✅ | **Predictive Ratings & Taste Match** |
| ✅ | **Auto-Insights Dashboard** |
| ✅ | TV show watchlist |
| ✅ | Episode-level tracking |
| ✅ | **TV Analytics (SeriesPulse)** |
| ✅ | **Show Comparison** |
| ✅ | **Episode Ratings Export** |
| 🔜 | Mobile app (React Native) |

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) — Movie & TV data
- [JustWatch](https://www.justwatch.com/) — Streaming availability
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Recharts](https://recharts.org/) — Beautiful charts
- [Lucide](https://lucide.dev/) — Icons
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI features

---

<div align="center">

**Made with ❤️ for entertainment lovers**

<sub>This product uses the TMDB API but is not endorsed or certified by TMDB.</sub>

[![TMDB](https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg)](https://www.themoviedb.org/)

[⬆ Back to top](#-moviemania)

</div>
