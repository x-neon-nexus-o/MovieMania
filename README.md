<div align="center">

# 🎬 MovieMania

<img src="https://img.shields.io/badge/MovieMania-Your%20Personal%20Cinema-6366f1?style=for-the-badge&logo=film&logoColor=white" alt="MovieMania" />

### **Track what you watch. Discover what's next. Own your movie journey.**

<br />

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TMDB](https://img.shields.io/badge/TMDB-Powered-01D277?style=flat-square&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[🚀 Quick Start](#-quick-start) • [✨ Features](#-feature-highlights) • [📖 Documentation](#-documentation) • [🛠️ Tech Stack](#️-tech-stack)

---

</div>

## 🎯 What is MovieMania?

MovieMania is a **full-featured movie tracking platform** built with the MERN stack. It's designed for movie enthusiasts who want more than just a list — they want **insights, organization, and discovery**.

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

### 📊 For Data Enthusiasts
- Beautiful stats dashboard with charts & heatmaps
- Track your watching streaks and patterns
- Discover your favorite genres, directors, actors
- Export your entire collection to CSV or JSON

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

Open **http://localhost:5173** and start logging movies! 🎉

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
<td align="center" width="25%">
<h3>🎬</h3>
<b>Smart Logging</b><br/>
<sub>TMDB integration • Ratings • Reviews • Tags</sub>
</td>
<td align="center" width="25%">
<h3>📋</h3>
<b>Watchlist</b><br/>
<sub>Priorities • Notes • Target dates • Move to watched</sub>
</td>
<td align="center" width="25%">
<h3>📁</h3>
<b>Collections</b><br/>
<sub>Themed lists • Emoji icons • Auto-posters • Pin favorites</sub>
</td>
<td align="center" width="25%">
<h3>📊</h3>
<b>Statistics</b><br/>
<sub>Charts • Heatmaps • Streaks • Top credits</sub>
</td>
</tr>
<tr>
<td align="center" width="25%">
<h3>🎥</h3>
<b>Trailers</b><br/>
<sub>YouTube embeds • Thumbnails • Theater mode</sub>
</td>
<td align="center" width="25%">
<h3>🌍</h3>
<b>Where to Watch</b><br/>
<sub>8 regions • Stream/Rent/Buy • Provider logos</sub>
</td>
<td align="center" width="25%">
<h3>🤖</h3>
<b>Recommendations</b><br/>
<sub>5-signal AI • Taste profile • "Why?" explanations</sub>
</td>
<td align="center" width="25%">
<h3>🔄</h3>
<b>Import/Export</b><br/>
<sub>Letterboxd • IMDb • CSV • JSON</sub>
</td>
</tr>
</table>

---

### 🤖 Smart Recommendations

Our recommendation engine doesn't just show popular movies — it learns **your taste**:

| Signal | Weight | What it does |
|--------|--------|--------------|
| **Your Genres** | 40% | Movies matching your top-rated genres |
| **Similar Films** | 25% | "Because you loved Inception..." |
| **Directors/Actors** | 15% | More from creators you love |
| **Mood Match** | 10% | Based on your recent watching patterns |
| **Trending** | 10% | Fresh discoveries you might miss |

Navigate to **"For You"** in the navbar to see your personalized picks with explanations.

---

### 🌍 Where to Watch

Never wonder "where can I stream this?" again:

- **8 Countries Supported**: 🇮🇳 IN • 🇺🇸 US • 🇬🇧 GB • 🇨🇦 CA • 🇦🇺 AU • 🇩🇪 DE • 🇫🇷 FR • 🇯🇵 JP
- **All Options**: Stream, Rent, Buy, Free with Ads
- **Powered by**: JustWatch via TMDB

---

### 📊 Stats Dashboard

Visualize your movie journey:

| Feature | What you'll see |
|---------|-----------------|
| **Genre Pie Chart** | Your favorite genres at a glance |
| **Rating Distribution** | Color-coded from 🔴 to 🟢 |
| **Activity Heatmap** | GitHub-style calendar of your watching |
| **Watching Streaks** | Current streak 🔥 and personal best |
| **Decade Breakdown** | Movies grouped by release era |
| **Top Directors** | Who you've watched most |

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
│   │   ├── middleware/      # Auth, validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   └── services/        # TMDB, recommendations
│   └── .env.example
│
└── 📂 client/               # React + Vite Frontend
    ├── src/
    │   ├── components/      # UI components
    │   ├── pages/           # Route pages
    │   ├── hooks/           # Custom hooks
    │   ├── context/         # Auth & Theme
    │   └── services/        # API layer
    └── tailwind.config.js
```
</details>

<details>
<summary><b>📡 API Reference</b></summary>

**Base URL**: `http://localhost:5000/api`

| Endpoint | Description |
|----------|-------------|
| `/auth/*` | Register, login, refresh, logout |
| `/movies/*` | CRUD for your movie collection |
| `/watchlist/*` | Manage your to-watch list |
| `/collections/*` | Create & manage themed lists |
| `/stats/*` | Aggregated viewing statistics |
| `/recommendations/*` | Personalized suggestions |
| `/export/*` | Download your data (CSV/JSON) |
| `/import/*` | Upload from Letterboxd/IMDb |
| `/tmdb/*` | Proxy to TMDB API |

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

</td>
<td>

- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- TanStack Query
- Framer Motion
- Recharts

</td>
<td>

- TMDB API
- JustWatch (via TMDB)
- YouTube Embeds

</td>
</tr>
</table>

---

## 🗺️ Roadmap

| Status | Feature |
|--------|---------|
| ✅ | Watchlist with priorities |
| ✅ | YouTube trailer integration |
| ✅ | Advanced statistics dashboard |
| ✅ | Smart collections |
| ✅ | Streaming availability |
| ✅ | Export to CSV/JSON |
| ✅ | Import from Letterboxd/IMDb |
| ✅ | Social sharing |
| ✅ | AI-powered recommendations |
| 🔜 | TV shows support |
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

- [TMDB](https://www.themoviedb.org/) — Movie data & metadata
- [JustWatch](https://www.justwatch.com/) — Streaming availability
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Recharts](https://recharts.org/) — Beautiful charts
- [Lucide](https://lucide.dev/) — Icons
- [Framer Motion](https://www.framer.com/motion/) — Animations

---

<div align="center">

**Made with ❤️ for movie lovers**

<sub>This product uses the TMDB API but is not endorsed or certified by TMDB.</sub>

[![TMDB](https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg)](https://www.themoviedb.org/)

[⬆ Back to top](#-moviemania)

</div>
