# HelioTrends: When the Sun Gets Angry, Netflix Gets Busy 🌞📺

A real-time dashboard analyzing the correlation between Solar Storm Activity and Netflix Daily Trending Shows using MCP and external APIs.

## Project Overview

HelioTrends combines two seemingly unrelated datasets:
- **NASA Solar Weather API**: Solar flare intensity, Kp-index, CME data, storm alerts
- **TMDB/Netflix Trending API**: Daily trending shows, genres, popularity scores

## Key Insights We're Exploring

- Do solar storms affect streaming habits?
- Does high solar activity lead to more Sci-Fi/Disaster genre views?
- Are there patterns between Kp-index and trending scores?

## Architecture

- **Frontend**: React with Recharts for visualizations
- **Backend**: MCP-powered API fetchers (serverless approach)
- **APIs**: NASA Solar Weather + TMDB
- **Real-time**: Auto-refresh every 30 minutes

## Quick Start

```bash
# Install dependencies
npm install

# Configure MCP tools
cp mcp-tools.json ~/.kiro/settings/mcp.json

# Start development server
npm run dev
```

## Dashboard Features

- Real-time solar activity charts
- Netflix trending visualization
- Correlation analysis graphs
- Genre pattern heatmaps
- Anomaly detection alerts

## File Structure

```
helio-trends/
├── mcp-tools.json          # MCP server configurations
├── solar-api-spec.json     # NASA API specifications
├── netflix-api-spec.json   # TMDB API specifications
├── data-pipeline.md        # Data processing documentation
├── dashboard-spec.md       # Dashboard requirements
├── correlations.md         # Analysis methodology
├── src/                    # React application
├── public/                 # Static assets
└── package.json           # Dependencies
```

## Data Sources

- **NASA Space Weather API**: Real-time solar activity data
- **TMDB API**: Movie/TV trending data (Netflix proxy)
- **NOAA Space Weather**: Kp-index and geomagnetic data

## Visualizations

1. **Line Chart**: Solar K-index vs Netflix Trend Score
2. **Heatmap**: Solar Storm Intensity vs Genre Popularity
3. **Pie Chart**: Genre distribution (storm vs normal days)
4. **Correlation Graph**: Statistical relationships
5. **Anomaly Detection**: Pattern recognition

## Expected Insights

> "On days when Solar K-index > 7, Netflix sees a 23% rise in Sci-Fi and Disaster movies."

Built for Kiro Heroes Week 3 Challenge - "The Data Weaver" 🏆