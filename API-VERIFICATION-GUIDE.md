# 🔍 API Verification Guide - HelioTrends 2.0

## Quick Verification Steps

### 1. **Check Environment Variables**
```bash
# Verify your .env.local file has these keys:
cat .env.local | grep -E "(TMDB|NASA)"
```

**Expected Output:**
```
NEXT_PUBLIC_TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9...
TMDB_API_KEY=0267782745d118c766fe8c5af0acfe70
NEXT_PUBLIC_NASA_API_KEY=PmtXFOnDaFnxhFZWqmjgkow9GUa8YReSVdmPg92O
NASA_API_KEY=PmtXFOnDaFnxhFZWqmjgkow9GUa8YReSVdmPg92O
```

### 2. **Run API Verification Script**
```bash
npm run verify-apis
```

This will test all your API connections and show detailed results.

### 3. **Test in Browser**
```bash
npm run dev
# Visit: http://localhost:3000/test
```

---

## 📺 TMDB API Testing

### Method 1: Bearer Token (Recommended)
```javascript
const BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const response = await fetch('https://api.themoviedb.org/3/trending/tv/day', {
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'User-Agent': 'HelioTrends/2.0'
  }
});

const data = await response.json();
console.log('✅ Trending TV Shows:', data.results.length);
```

### Method 2: API Key
```javascript
const API_KEY = process.env.TMDB_API_KEY;

const response = await fetch(
  `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`
);

const data = await response.json();
console.log('✅ Trending TV Shows:', data.results.length);
```

### Test All TMDB Endpoints
```bash
# Test TMDB connection
curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  "https://api.themoviedb.org/3/trending/tv/day"

# Test trending movies
curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  "https://api.themoviedb.org/3/trending/movie/day"

# Test TV genres
curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  "https://api.themoviedb.org/3/genre/tv/list"
```

---

## 🌞 NASA API Testing

### Solar Flares
```javascript
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const response = await fetch(
  `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`
);

const data = await response.json();
console.log('✅ Solar Flares:', data.length);
```

### Test NASA Endpoints
```bash
# Test solar flares (last 7 days)
curl "https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&endDate=2024-01-07&api_key=DEMO_KEY"

# Test CME events
curl "https://api.nasa.gov/DONKI/CME?startDate=2024-01-01&endDate=2024-01-07&api_key=DEMO_KEY"

# Test geomagnetic storms
curl "https://api.nasa.gov/DONKI/GST?startDate=2024-01-01&endDate=2024-01-07&api_key=DEMO_KEY"
```

---

## 🌍 NOAA API Testing (No API Key Required)

### Kp-Index (Real-time)
```javascript
const response = await fetch(
  'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
);

const data = await response.json();
const latest = data[data.length - 1];
console.log('✅ Current Kp-index:', latest.kp_index);
```

### Solar Wind Data
```javascript
const response = await fetch(
  'https://services.swpc.noaa.gov/json/solar-wind/solar-wind-speed-1-day.json'
);

const data = await response.json();
const latest = data[data.length - 1];
console.log('✅ Solar Wind Speed:', latest.speed, 'km/s');
```

### Test NOAA Endpoints
```bash
# Test Kp-index
curl "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"

# Test solar wind
curl "https://services.swpc.noaa.gov/json/solar-wind/solar-wind-speed-1-day.json"
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. **TMDB API 401 Unauthorized**
```
❌ Error: HTTP 401 - Invalid API key
```
**Solution:**
- Check your Bearer Token format: `eyJhbGciOiJIUzI1NiJ9...`
- Verify API key: `0267782745d118c766fe8c5af0acfe70`
- Make sure both are in `.env.local`

#### 2. **NASA API 429 Rate Limited**
```
❌ Error: HTTP 429 - Over rate limit
```
**Solution:**
- DEMO_KEY allows 30 requests/hour
- Get a free NASA API key for 1,000 requests/hour
- Wait for rate limit to reset

#### 3. **CORS Errors**
```
❌ Error: CORS policy blocked
```
**Solution:**
- All API calls should be server-side (in `/api/` routes)
- Never call external APIs directly from client components
- Use our API routes: `/api/solar-data`, `/api/netflix-data`

#### 4. **Environment Variables Not Loading**
```
❌ Error: API key is undefined
```
**Solution:**
- Restart your dev server: `npm run dev`
- Check `.env.local` file exists and has correct format
- Use `NEXT_PUBLIC_` prefix for client-side variables

---

## ✅ Expected Test Results

### Successful TMDB Response
```json
{
  "page": 1,
  "results": [
    {
      "id": 94605,
      "name": "Arcane",
      "popularity": 2847.253,
      "vote_average": 8.7,
      "genre_ids": [16, 10765, 10759]
    }
  ],
  "total_pages": 1000,
  "total_results": 20000
}
```

### Successful NASA Response
```json
[
  {
    "flrID": "2024-01-15T12:34:00-FLR-001",
    "beginTime": "2024-01-15T12:30:00Z",
    "peakTime": "2024-01-15T12:34:00Z",
    "endTime": "2024-01-15T12:38:00Z",
    "classType": "M2.1",
    "sourceLocation": "S15W30"
  }
]
```

### Successful NOAA Response
```json
[
  {
    "time_tag": "2024-01-15T12:34:00",
    "kp_index": 3,
    "estimated_kp": 2.67,
    "kp": "3M"
  }
]
```

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Verify APIs
npm run verify-apis

# 3. Start development server
npm run dev

# 4. Test in browser
open http://localhost:3000/test
```

---

## 📊 API Status Dashboard

Visit `http://localhost:3000/test` to see:

- ✅ Environment variables status
- ✅ Real-time API connection tests
- ✅ Sample data from each endpoint
- ✅ Performance metrics
- ✅ Error diagnostics

---

## 🎯 Success Criteria

Your APIs are working correctly when you see:

1. **TMDB API**: ✅ 20 trending TV shows fetched
2. **NASA API**: ✅ Solar flare data (or rate limit warning)
3. **NOAA API**: ✅ Current Kp-index value
4. **Dashboard**: ✅ Real data displayed (not mock data)
5. **Correlations**: ✅ Statistical analysis running

**🎉 Ready to launch HelioTrends 2.0!**