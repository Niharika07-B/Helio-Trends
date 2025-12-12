# 🌞 HelioTrends Dashboard

> **Exploring the fascinating correlation between solar activity and streaming trends**

A cutting-edge real-time dashboard that analyzes the relationship between solar weather events and Netflix trending content, featuring advanced AI insights, predictions, and interactive visualizations.

![HelioTrends Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

### 🔥 **Core Functionality**
- **Real-time Solar Data** - Live solar weather from NASA & NOAA APIs
- **Netflix Trends Analysis** - Trending content via TMDB API
- **Advanced Correlation Engine** - Statistical analysis of solar-streaming relationships
- **Zero Hydration Errors** - Perfect server-client consistency

### 🚀 **Advanced Features**
- **7-Day Prediction Panel** - ML-powered forecasting with confidence levels
- **Interactive Simulation** - Real-time sliders for cause & effect analysis
- **Solar Event Alerts** - Priority-based alerts with severity colors
- **AI Insights with Emotion** - Emotionally intelligent analysis
- **"Explain Like I'm 10"** - Kid-friendly explanations of complex correlations

### 🎨 **UI/UX Excellence**
- **Glassmorphism Design** - Modern, beautiful interface
- **Theme Switching** - Solar/Netflix/Auto modes
- **Framer Motion Animations** - Smooth, professional animations
- **Responsive Design** - Perfect on all devices
- **Custom Kiro-style Favicon** - Unique branding

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **APIs**: NASA DONKI, NOAA, TMDB

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Niharika07-B/Helio-Trends.git
   cd Helio-Trends
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   NASA_API_KEY=your_nasa_api_key_here
   TMDB_API_KEY=your_tmdb_api_key_here
   TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### NASA API Key (Free)
1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Sign up for a free API key
3. Add to `.env.local` as `NASA_API_KEY`

### TMDB API Key (Free)
1. Visit [TMDB API](https://www.themoviedb.org/settings/api)
2. Create an account and request API access
3. Get both API Key and Bearer Token
4. Add to `.env.local`

## 📊 Data Sources

- **Solar Data**: NASA DONKI (Space Weather Database)
- **Geomagnetic Data**: NOAA Space Weather Prediction Center
- **Streaming Data**: TMDB (The Movie Database) API
- **Correlation Analysis**: Custom statistical algorithms

## 🎯 Key Components

### Dashboard Views
- **Main Dashboard** - Overview with real-time metrics
- **Solar View** - Detailed solar activity analysis
- **Netflix View** - Trending content breakdown
- **Insights View** - AI-powered correlation insights
- **Settings View** - Configuration and preferences

### Advanced Features
- **Prediction Panel** - 7-day forecasting
- **Simulation Panel** - Interactive parameter testing
- **Alerts Panel** - Real-time event notifications
- **AI Insights** - Emotional tone analysis

## 🚀 Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Niharika07-B/Helio-Trends&env=NASA_API_KEY,TMDB_API_KEY,TMDB_BEARER_TOKEN)

### Manual Deployment
1. Fork this repository
2. Sign up at [vercel.com](https://vercel.com)
3. Connect your GitHub account
4. Import the `Helio-Trends` repository
5. Add environment variables:
   - `NASA_API_KEY`
   - `TMDB_API_KEY` 
   - `TMDB_BEARER_TOKEN`
6. Deploy!

### Environment Variables for Vercel
```bash
NASA_API_KEY=your_nasa_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
```

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Verify APIs
```bash
npm run verify-apis
```

### Lint Code
```bash
npm run lint
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Zero Hydration Errors**: Perfect SSR/CSR consistency
- **Optimized Bundle**: Tree-shaking and code splitting
- **Fast Loading**: Efficient data fetching and caching

## 🌟 Highlights

- **Real-time Correlation**: Live analysis of solar-streaming relationships
- **Production Ready**: Zero errors, optimized build
- **Scalable Architecture**: Modular component design
- **Accessibility**: WCAG compliant interface
- **Mobile Responsive**: Perfect on all screen sizes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👩‍💻 Created By

**Niharika Bandaru**
- 🔮 **Creator & Developer**
- 💼 [LinkedIn](https://linkedin.com/in/niharika-bandaru)
- 🐱 [GitHub](https://github.com/niharikabandaru)
- 📸 [Instagram](https://instagram.com/niharikabandaru)

---

⚡ **Stay Connected** - Follow for more innovative projects!

© 2025 — All Rights Reserved