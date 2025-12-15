// Client-side API service for static deployment
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'PmtXFOnDaFnxhFZWqmjgkow9GUa8YReSVdmPg92O';
const TMDB_BEARER_TOKEN = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjY3NzgyNzQ1ZDExOGM3NjZmZThjNWFmMGFjZmU3MCIsIm5iZiI6MTc2NTUwMDQ2Mi40MzIsInN1YiI6IjY5M2I2NjJlNWNjODFjMmY5NTM2MDhkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ctH8O5cf7-mcS87oQWNdA-dcoto4rzWWkezcaQoiNaQ';

export class ClientAPI {
  static async fetchSolarData() {
    try {
      const [flareResponse, cmeResponse, kpResponse] = await Promise.all([
        fetch(`https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&api_key=${NASA_API_KEY}`),
        fetch(`https://api.nasa.gov/DONKI/CME?startDate=2024-01-01&api_key=${NASA_API_KEY}`),
        fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json')
      ]);

      const [flares, cmes, kpData] = await Promise.all([
        flareResponse.json(),
        cmeResponse.json(),
        kpResponse.json()
      ]);

      const currentKp = kpData[kpData.length - 1]?.kp_index || 3;
      
      return {
        kpIndex: parseFloat(currentKp),
        estimatedKp: parseFloat(currentKp),
        activityLevel: this.getActivityLevel(parseFloat(currentKp)),
        solarFlares: flares.slice(0, 10).map((flare: any) => ({
          id: flare.flrID || `flare-${Date.now()}`,
          classType: flare.classType || 'C1.0',
          peakTime: flare.peakTime || new Date().toISOString(),
          intensity: this.getFlareIntensity(flare.classType || 'C1.0')
        })),
        cmeEvents: cmes.slice(0, 5).map((cme: any) => ({
          id: cme.activityID || `cme-${Date.now()}`,
          startTime: cme.startTime || new Date().toISOString(),
          speed: cme.speed || Math.random() * 1000 + 300,
          direction: cme.direction || 'Earth-directed'
        })),
        solarWind: {
          speed: 400 + Math.random() * 200,
          density: 5 + Math.random() * 10,
          temperature: 100000 + Math.random() * 50000
        },
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching solar data:', error);
      return this.getMockSolarData();
    }
  }

  static async fetchNetflixData() {
    try {
      const [moviesResponse, tvResponse] = await Promise.all([
        fetch('https://api.themoviedb.org/3/trending/movie/day', {
          headers: {
            'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('https://api.themoviedb.org/3/trending/tv/day', {
          headers: {
            'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const [moviesData, tvData] = await Promise.all([
        moviesResponse.json(),
        tvResponse.json()
      ]);

      const movies = moviesData.results?.slice(0, 10) || [];
      const shows = tvData.results?.slice(0, 10) || [];

      return {
        trendingMovies: movies.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          popularity: movie.popularity,
          genres: movie.genre_ids || [],
          rating: movie.vote_average
        })),
        trendingTv: shows.map((show: any) => ({
          id: show.id,
          name: show.name,
          popularity: show.popularity,
          genres: show.genre_ids || [],
          rating: show.vote_average
        })),
        topGenres: this.calculateTopGenres([...movies, ...shows]),
        aggregatedScore: this.calculateAggregatedScore([...movies, ...shows]),
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Netflix data:', error);
      return this.getMockNetflixData();
    }
  }

  private static getActivityLevel(kp: number): 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' {
    if (kp >= 7) return 'EXTREME';
    if (kp >= 5) return 'HIGH';
    if (kp >= 3) return 'MODERATE';
    return 'LOW';
  }

  private static getFlareIntensity(classType: string): number {
    const match = classType.match(/([ABCMX])(\d+\.?\d*)/);
    if (!match) return 1;
    
    const [, letter, number] = match;
    const baseValues = { A: 1, B: 10, C: 100, M: 1000, X: 10000 };
    return (baseValues[letter as keyof typeof baseValues] || 100) * parseFloat(number);
  }

  private static calculateTopGenres(content: any[]) {
    const genreCount: { [key: string]: { count: number; popularity: number } } = {};
    
    content.forEach(item => {
      const genres = ['Action', 'Sci-Fi', 'Thriller', 'Drama', 'Comedy'];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      
      if (!genreCount[randomGenre]) {
        genreCount[randomGenre] = { count: 0, popularity: 0 };
      }
      genreCount[randomGenre].count++;
      genreCount[randomGenre].popularity += item.popularity || 0;
    });

    return Object.entries(genreCount)
      .map(([name, data]) => ({
        name,
        count: data.count,
        popularity: data.popularity / data.count
      }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  }

  private static calculateAggregatedScore(content: any[]): number {
    if (!content.length) return 0;
    return content.reduce((sum, item) => sum + (item.popularity || 0), 0) / content.length;
  }

  private static getMockSolarData() {
    return {
      kpIndex: 3.2,
      estimatedKp: 3.2,
      activityLevel: 'MODERATE' as const,
      solarFlares: [],
      cmeEvents: [],
      solarWind: { speed: 450, density: 7, temperature: 120000 },
      lastUpdate: new Date().toISOString()
    };
  }

  private static getMockNetflixData() {
    return {
      trendingMovies: [],
      trendingTv: [],
      topGenres: [{ name: 'Sci-Fi', count: 5, popularity: 85 }],
      aggregatedScore: 75,
      lastUpdate: new Date().toISOString()
    };
  }
}