import { NetflixData } from '@/hooks/useDataFetcher';

class NetflixDataService {
  private readonly TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
  private readonly TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  
  // Genre ID to name mapping
  private readonly GENRE_MAP: Record<number, string> = {
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

  async getTrendingData(): Promise<NetflixData> {
    try {
      // Fetch trending movies and TV shows in parallel
      const [moviesData, tvData] = await Promise.all([
        this.fetchTrendingMovies(),
        this.fetchTrendingTV()
      ]);

      const allContent = [...moviesData.results, ...tvData.results];
      
      return {
        trendingMovies: moviesData.results,
        trendingTv: tvData.results,
        aggregatedScore: this.calculateAggregatedScore(allContent),
        topGenre: this.getTopGenre(allContent),
        genreDistribution: this.calculateGenreDistribution(allContent),
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error fetching Netflix data:', error);
      // Return mock data for development
      return this.getMockNetflixData();
    }
  }

  private async fetchTrendingMovies(): Promise<any> {
    if (!this.TMDB_BEARER_TOKEN) {
      throw new Error('TMDB Bearer Token not configured');
    }

    const response = await fetch(
      `${this.TMDB_BASE_URL}/trending/movie/day?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${this.TMDB_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
    }
    
    return response.json();
  }

  private async fetchTrendingTV(): Promise<any> {
    if (!this.TMDB_BEARER_TOKEN) {
      throw new Error('TMDB Bearer Token not configured');
    }

    const response = await fetch(
      `${this.TMDB_BASE_URL}/trending/tv/day?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${this.TMDB_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending TV shows: ${response.statusText}`);
    }
    
    return response.json();
  }

  private calculateAggregatedScore(content: any[]): number {
    if (!content || content.length === 0) return 0;
    
    const totalPopularity = content.reduce((sum, item) => sum + (item.popularity || 0), 0);
    return totalPopularity / content.length;
  }

  private getTopGenre(content: any[]): string {
    const genreCounts: Record<string, number> = {};
    
    content.forEach(item => {
      if (item.genre_ids && Array.isArray(item.genre_ids)) {
        item.genre_ids.forEach((genreId: number) => {
          const genreName = this.GENRE_MAP[genreId] || 'Unknown';
          genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
  }

  private calculateGenreDistribution(content: any[]): Record<string, number> {
    const genreScores: Record<string, number[]> = {};
    
    content.forEach(item => {
      if (item.genre_ids && Array.isArray(item.genre_ids)) {
        item.genre_ids.forEach((genreId: number) => {
          const genreName = this.GENRE_MAP[genreId] || 'Unknown';
          if (!genreScores[genreName]) {
            genreScores[genreName] = [];
          }
          genreScores[genreName].push(item.popularity || 0);
        });
      }
    });

    // Calculate average popularity for each genre
    const distribution: Record<string, number> = {};
    Object.entries(genreScores).forEach(([genre, scores]) => {
      distribution[genre] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return distribution;
  }

  private getMockNetflixData(): NetflixData {
    // Mock data for development/demo purposes
    const mockMovies = [
      {
        id: 1,
        title: 'Solar Storm',
        overview: 'A thrilling sci-fi movie about solar storms affecting Earth.',
        popularity: 85.2,
        vote_average: 7.8,
        vote_count: 1234,
        release_date: '2024-01-15',
        genre_ids: [878, 53], // Sci-Fi, Thriller
        adult: false,
        backdrop_path: '/mock-backdrop.jpg',
        poster_path: '/mock-poster.jpg'
      },
      {
        id: 2,
        title: 'Geomagnetic',
        overview: 'Documentary about space weather and its effects.',
        popularity: 72.1,
        vote_average: 8.2,
        vote_count: 856,
        release_date: '2024-02-01',
        genre_ids: [99, 878], // Documentary, Sci-Fi
        adult: false,
        backdrop_path: '/mock-backdrop2.jpg',
        poster_path: '/mock-poster2.jpg'
      }
    ];

    const mockTv = [
      {
        id: 101,
        name: 'Space Weather Alert',
        overview: 'TV series following scientists tracking solar activity.',
        popularity: 91.5,
        vote_average: 8.5,
        vote_count: 2341,
        first_air_date: '2024-01-10',
        genre_ids: [99, 878], // Documentary, Sci-Fi
        adult: false,
        backdrop_path: '/mock-tv-backdrop.jpg',
        poster_path: '/mock-tv-poster.jpg'
      }
    ];

    const allContent = [...mockMovies, ...mockTv];

    return {
      trendingMovies: mockMovies,
      trendingTv: mockTv,
      aggregatedScore: this.calculateAggregatedScore(allContent),
      topGenre: this.getTopGenre(allContent),
      genreDistribution: this.calculateGenreDistribution(allContent),
      lastUpdate: new Date()
    };
  }

  // Utility method to get genre name from ID
  getGenreName(genreId: number): string {
    return this.GENRE_MAP[genreId] || 'Unknown';
  }

  // Calculate genre-specific popularity scores
  calculateGenrePopularity(content: any[], targetGenres: string[]): Record<string, number> {
    const genrePopularity: Record<string, number> = {};
    
    targetGenres.forEach(genre => {
      const genreId = Object.entries(this.GENRE_MAP)
        .find(([, name]) => name === genre)?.[0];
      
      if (genreId) {
        const relevantContent = content.filter(item => 
          item.genre_ids && item.genre_ids.includes(parseInt(genreId))
        );
        
        genrePopularity[genre] = relevantContent.length > 0
          ? relevantContent.reduce((sum, item) => sum + item.popularity, 0) / relevantContent.length
          : 0;
      }
    });

    return genrePopularity;
  }

  // Get sci-fi and disaster related content specifically
  getSpaceWeatherRelatedContent(data: NetflixData): any[] {
    const allContent = [...data.trendingMovies, ...data.trendingTv];
    const relevantGenres = [878, 53, 99, 27]; // Sci-Fi, Thriller, Documentary, Horror
    
    return allContent.filter(item => 
      item.genre_ids && 
      item.genre_ids.some((id: number) => relevantGenres.includes(id))
    );
  }
}

export const netflixDataService = new NetflixDataService();
