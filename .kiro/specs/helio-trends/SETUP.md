# HelioTrends Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- TMDB API key (free registration at https://www.themoviedb.org/settings/api)
- NASA API key (optional, DEMO_KEY works with rate limits)

## Quick Start

### 1. Install Dependencies

```bash
cd kiro/specs/helio-trends
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your API keys
nano .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_NASA_API_KEY=DEMO_KEY
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Configure MCP Tools (Optional)

If you want to use MCP for real-time data fetching:

```bash
# Copy MCP configuration to Kiro settings
mkdir -p ~/.kiro/settings
cp mcp-tools.json ~/.kiro/settings/mcp.json

# Install required MCP servers
pip install uv  # If not already installed
# MCP servers will be auto-installed when first used
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## API Keys Setup

### TMDB API Key (Required)

1. Go to https://www.themoviedb.org/
2. Create a free account
3. Navigate to Settings > API
4. Request an API key (choose "Developer" option)
5. Copy the API key to your `.env.local` file

### NASA API Key (Optional)

1. Go to https://api.nasa.gov/
2. Generate an API key (free, no registration required)
3. Replace `DEMO_KEY` in your `.env.local` file
4. Note: DEMO_KEY has rate limits but works for development

## MCP Configuration

The project includes MCP server configurations for:

- **NASA Solar Weather**: Real-time solar flare and geomagnetic data
- **TMDB Trending**: Movie and TV show trending data
- **NOAA Space Weather**: Kp-index and planetary data
- **Data Processor**: SQLite-based data caching and correlation analysis

### Installing MCP Servers

```bash
# Install UV (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# MCP servers will auto-install when first used
# No manual installation required
```

## Development Features

### Mock Data Mode

If APIs are unavailable, the app automatically falls back to realistic mock data:

- Solar activity simulation with realistic Kp-index values
- Mock Netflix trending data with proper genre distributions
- Simulated correlation patterns based on expected relationships

### Real-time Updates

- Auto-refresh every 30 minutes (configurable)
- Manual refresh button
- WebSocket support for live updates (future enhancement)

### Responsive Design

- Desktop: Full 4x3 dashboard grid
- Tablet: 2x6 responsive layout
- Mobile: Single column with accordion sections

## Deployment Options

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop the 'out' folder)
```

### Docker

```bash
# Build Docker image
docker build -t helio-trends .

# Run container
docker run -p 3000:3000 helio-trends
```

## Troubleshooting

### Common Issues

1. **TMDB API Rate Limits**
   - Free tier: 1,000 requests per day
   - Solution: Implement caching or upgrade to paid tier

2. **NASA API Rate Limits**
   - DEMO_KEY: 30 requests per hour
   - Solution: Get a free API key for 1,000 requests per hour

3. **CORS Issues**
   - All API calls are made server-side to avoid CORS
   - If issues persist, check Next.js API routes

4. **MCP Connection Issues**
   - Ensure UV is installed: `uv --version`
   - Check MCP server logs in Kiro
   - Verify API keys in MCP configuration

### Performance Optimization

1. **Enable Caching**
   ```bash
   # Redis for production caching
   npm install redis
   ```

2. **Database Setup**
   ```bash
   # SQLite for data persistence
   npm install sqlite3
   ```

3. **CDN Configuration**
   - Use Vercel Edge Functions
   - Enable image optimization
   - Configure proper cache headers

## Data Sources

### Primary APIs

- **NASA DONKI**: Solar flares, CMEs, geomagnetic storms
- **NOAA Space Weather**: Real-time Kp-index data
- **TMDB**: Movie and TV trending data (Netflix proxy)

### Data Update Frequency

- Solar data: Every 30 minutes
- Netflix trends: Every 2 hours
- Correlations: Every 4 hours
- Dashboard: Real-time updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub
4. Contact the development team

## License

MIT License - see LICENSE file for details.
