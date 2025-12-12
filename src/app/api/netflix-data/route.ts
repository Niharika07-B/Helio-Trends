import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Genre mapping for TMDB
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
}

interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids: number[];
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
}

async function fetchWithTimeout(url: string, options: { headers?: Record<string, string> } = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'HelioTrends/2.0',
        ...options.headers
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchTrendingMovies(): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY && !TMDB_BEARER_TOKEN) {
    console.warn('TMDB API credentials not configured, using mock data');
    return getMockMovies();
  }

  try {
    // Try Bearer Token method first (recommended by TMDB)
    let response;
    if (TMDB_BEARER_TOKEN) {
      console.log('🎬 Fetching trending movies with Bearer Token...');
      response = await fetchWithTimeout(`${TMDB_BASE_URL}/trending/movie/day?language=en-US`, {
        headers: {
          'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
          'User-Agent': 'HelioTrends/2.0'
        }
      });
    } else {
      console.log('🎬 Fetching trending movies with API Key...');
      response = await fetchWithTimeout(
        `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`
      );
    }
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} trending movies`);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    return getMockMovies();
  }
}

async function fetchTrendingTV(): Promise<TMDBTVShow[]> {
  if (!TMDB_API_KEY && !TMDB_BEARER_TOKEN) {
    console.warn('TMDB API credentials not configured, using mock data');
    return getMockTVShows();
  }

  try {
    // Try Bearer Token method first (recommended by TMDB)
    let response;
    if (TMDB_BEARER_TOKEN) {
      console.log('📺 Fetching trending TV shows with Bearer Token...');
      response = await fetchWithTimeout(`${TMDB_BASE_URL}/trending/tv/day?language=en-US`, {
        headers: {
          'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
          'User-Agent': 'HelioTrends/2.0'
        }
      });
    } else {
      console.log('📺 Fetching trending TV shows with API Key...');
      response = await fetchWithTimeout(
        `${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}&language=en-US`
      );
    }
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} trending TV shows`);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch trending TV shows:', error);
    return getMockTVShows();
  }
}

function getMockMovies(): TMDBMovie[] {
  return [
    {
      id: 1,
      title: 'Solar Storm',
      overview: 'A thrilling sci-fi movie about solar storms affecting Earth and the heroes who must save humanity.',
      popularity: 2847.253,
      vote_average: 8.7,
      vote_count: 4234,
      release_date: '2024-01-15',
      genre_ids: [878, 53, 28], // Sci-Fi, Thriller, Action
      adult: false,
      backdrop_path: '/mock-backdrop.jpg',
      poster_path: '/mock-poster.jpg'
    },
    {
      id: 2,
      title: 'Geomagnetic',
      overview: 'Documentary exploring the relationship between space weather and human behavior patterns.',
      popularity: 1456.789,
      vote_average: 8.2,
      vote_count: 8765,
      release_date: '2024-02-01',
      genre_ids: [99, 878], // Documentary, Sci-Fi
      adult: false,
      backdrop_path: '/mock-backdrop2.jpg',
      poster_path: '/mock-poster2.jpg'
    },
    {
      id: 3,
      title: 'The Aurora Effect',
      overview: 'When a massive solar flare hits Earth, a small town discovers they have gained extraordinary abilities.',
      popularity: 1234.567,
      vote_average: 7.9,
      vote_count: 3456,
      release_date: '2024-03-10',
      genre_ids: [878, 14, 18], // Sci-Fi, Fantasy, Drama
      adult: false,
      backdrop_path: '/mock-backdrop3.jpg',
      poster_path: '/mock-poster3.jpg'
    }
  ];
}

function getMockTVShows(): TMDBTVShow[] {
  return [
    {
      id: 101,
      name: 'Space Weather Alert',
      overview: 'TV series following scientists and meteorologists as they track dangerous solar activity and its effects on Earth.',
      popularity: 3156.891,
      vote_average: 8.5,
      vote_count: 2341,
      first_air_date: '2024-01-10',
      genre_ids: [99, 878, 18], // Documentary, Sci-Fi, Drama
      adult: false,
      backdrop_path: '/mock-tv-backdrop.jpg',
      poster_path: '/mock-tv-poster.jpg'
    },
    {
      id: 102,
      name: 'Solar Flare Chronicles',
      overview: 'In a world where solar storms have changed everything, survivors must adapt to a new reality.',
      popularity: 2789.456,
      vote_average: 8.1,
      vote_count: 5678,
      first_air_date: '2024-02-15',
      genre_ids: [878, 18, 10765], // Sci-Fi, Drama, Sci-Fi & Fantasy
      adult: false,
      backdrop_path: '/mock-tv-backdrop2.jpg',
      poster_path: '/mock-tv-poster2.jpg'
    },
    {
      id: 103,
      name: 'Streaming in the Storm',
      overview: 'A comedy about a Netflix data analyst who discovers patterns between space weather and viewing habits.',
      popularity: 1987.234,
      vote_average: 7.6,
      vote_count: 1234,
      first_air_date: '2024-03-01',
      genre_ids: [35, 878], // Comedy, Sci-Fi
      adult: false,
      backdrop_path: '/mock-tv-backdrop3.jpg',
      poster_path: '/mock-tv-poster3.jpg'
    }
  ];
}

function processContent(movies: TMDBMovie[], tvShows: TMDBTVShow[]) {
  // Process movies
  const processedMovies = movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    popularity: movie.popularity,
    genres: movie.genre_ids.map(id => GENRE_MAP[id] || 'Unknown').filter(Boolean),
    rating: movie.vote_average
  }));

  // Process TV shows
  const processedTV = tvShows.map(show => ({
    id: show.id,
    name: show.name,
    popularity: show.popularity,
    genres: show.genre_ids.map(id => GENRE_MAP[id] || 'Unknown').filter(Boolean),
    rating: show.vote_average
  }));

  // Calculate genre statistics
  const genreStats: Record<string, { count: number; totalPopularity: number }> = {};
  
  [...movies, ...tvShows].forEach(item => {
    item.genre_ids.forEach(genreId => {
      const genreName = GENRE_MAP[genreId];
      if (genreName) {
        if (!genreStats[genreName]) {
          genreStats[genreName] = { count: 0, totalPopularity: 0 };
        }
        genreStats[genreName].count++;
        genreStats[genreName].totalPopularity += item.popularity;
      }
    });
  });

  // Convert to top genres array
  const topGenres = Object.entries(genreStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      popularity: stats.totalPopularity / stats.count // Average popularity
    }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);

  // Calculate aggregated score
  const allContent = [...movies, ...tvShows];
  const aggregatedScore = allContent.length > 0 
    ? allContent.reduce((sum, item) => sum + item.popularity, 0) / allContent.length
    : 0;

  return {
    processedMovies,
    processedTV,
    topGenres,
    aggregatedScore
  };
}

export async function GET(request: NextRequest) {
  try {
    // Fetch trending data in parallel
    const [movies, tvShows] = await Promise.all([
      fetchTrendingMovies(),
      fetchTrendingTV()
    ]);

    // Process the data
    const { processedMovies, processedTV, topGenres, aggregatedScore } = processContent(movies, tvShows);

    // Build response
    const netflixData = {
      trendingMovies: processedMovies,
      trendingTv: processedTV,
      topGenres,
      aggregatedScore,
      lastUpdate: new Date().toISOString()
    };

    return NextResponse.json(netflixData, {
      headers: {
        'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Netflix data API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Netflix data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}