
# Data Pipeline Documentation

## Overview

The HelioTrends data pipeline combines real-time solar weather data with entertainment trending data to identify correlations and patterns.

## Data Sources

### 1. NASA DONKI API
- **Solar Flares (FLR)**: X-ray intensity, duration, location
- **Coronal Mass Ejections (CME)**: Speed, direction, impact predictions
- **Geomagnetic Storms (GST)**: Kp-index values, storm intensity

### 2. TMDB API (Netflix Proxy)
- **Daily Trending Movies**: Popularity scores, genres, ratings
- **Daily Trending TV Shows**: Viewership patterns, genre distribution
- **Genre Mapping**: ID to name conversion for analysis

### 3. NOAA Space Weather
- **Planetary K-index**: Real-time geomagnetic activity
- **Solar Wind Data**: Speed, density, magnetic field
- **Space Weather Alerts**: Current conditions

## Data Processing Pipeline

### Stage 1: Data Collection (MCP Tools)
```javascript
// Solar data collection
const solarData = await mcpFetch('nasa-solar-weather', 'fetch_solar_flares', {
  startDate: today,
  endDate: today
});

// Entertainment data collection
const trendingData = await mcpFetch('tmdb-trending', 'fetch_trending_movies', {
  timeWindow: 'day'
});

// Geomagnetic data collection
const kpData = await mcpFetch('noaa-space-weather', 'fetch_kp_index', {
  format: 'json'
});
```

### Stage 2: Data Normalization
- **Time Synchronization**: Align all data to UTC timestamps
- **Score Normalization**: Convert different scales to 0-100 range
- **Genre Standardization**: Map TMDB genre IDs to readable names
- **Solar Activity Scoring**: Convert flare classes (A, B, C, M, X) to numeric scale

### Stage 3: Data Correlation
- **Temporal Alignment**: Match solar events with trending data by date
- **Statistical Analysis**: Calculate correlation coefficients
- **Pattern Detection**: Identify anomalies and trends
- **Genre Impact Analysis**: Measure genre-specific effects

### Stage 4: Data Storage (SQLite via MCP)
```sql
-- Solar events table
CREATE TABLE solar_events (
  id INTEGER PRIMARY KEY,
  event_time DATETIME,
  event_type TEXT,
  intensity_score REAL,
  kp_index REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trending content table
CREATE TABLE trending_content (
  id INTEGER PRIMARY KEY,
  content_id INTEGER,
  title TEXT,
  content_type TEXT,
  popularity_score REAL,
  genres TEXT,
  trending_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Correlation analysis table
CREATE TABLE correlations (
  id INTEGER PRIMARY KEY,
  date DATE,
  solar_score REAL,
  trending_score REAL,
  genre_distribution TEXT,
  correlation_coefficient REAL,
  anomaly_detected BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Real-Time Updates

### Refresh Schedule
- **Solar Data**: Every 30 minutes
- **Trending Data**: Every 2 hours
- **Correlation Analysis**: Every 4 hours
- **Dashboard Updates**: Real-time via WebSocket

### Caching Strategy
- **API Response Cache**: 15 minutes for solar data, 1 hour for trending
- **Processed Data Cache**: 30 minutes for correlations
- **Dashboard Cache**: 5 minutes for visualization data

## Data Quality Measures

### Validation Rules
- Solar flare intensity must be within expected ranges (A1.0 to X28+)
- Kp-index values between 0-9
- Popularity scores > 0
- Valid date ranges (not future dates)

### Error Handling
- API timeout handling (30 second limit)
- Rate limit respect (NASA: 1000/hour, TMDB: 40/10sec)
- Data completeness checks
- Fallback to cached data on API failures

## Performance Optimization

### Data Processing
- Batch API calls where possible
- Parallel processing for independent data sources
- Incremental updates (only fetch new data)
- Efficient SQL queries with proper indexing

### Memory Management
- Stream processing for large datasets
- Garbage collection for temporary objects
- Connection pooling for database access
- Lazy loading for dashboard components

## Monitoring & Alerts

### Health Checks
- API endpoint availability
- Data freshness validation
- Correlation calculation success
- Dashboard rendering performance

### Alert Conditions
- API failures > 3 consecutive attempts
- Data gaps > 2 hours
- Correlation coefficient changes > 0.3
- Unusual solar activity (X-class flares)

## Data Export

### Available Formats
- JSON: Real-time API access
- CSV: Historical data analysis
- SQLite: Complete database dump
- Charts: PNG/SVG visualization exports

### API Endpoints
```
GET /api/solar-data?date=YYYY-MM-DD
GET /api/trending-data?date=YYYY-MM-DD
GET /api/correlations?start=YYYY-MM-DD&end=YYYY-MM-DD
GET /api/insights/summary
```
