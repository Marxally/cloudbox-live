// src/api/gameApi.js - Updated for production deployment

// Determine API URL based on environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // In browser: use relative path for production, localhost for development
    const isProduction = window.location.hostname !== 'localhost';
    return isProduction ? '/api' : 'http://localhost:5000/api';
  }
  // For server-side rendering (if needed)
  return process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Fetches games from the CloudBox backend API
 */
export async function fetchGames(refresh = false, limit = null) {
    try {
        let url = `${API_BASE_URL}/games`;
        const params = [];
        
        if (refresh) params.push('refresh=true');
        if (limit) params.push(`limit=${limit}`);
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        
        console.log(`Fetching games from: ${url}`);
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            // Handle both formats: new format has 'games' property, old format is array
            const games = data.games || data;
            console.log(`✅ Fetched ${games.length} games from API`);
            return games;
        } else {
            console.warn(`API returned ${response.status}, using fallback data`);
            return getFallbackGames();
        }
    } catch (error) {
        console.warn('Network error:', error.message);
        console.warn('Using fallback games data');
        return getFallbackGames();
    }
}

/**
 * Force refresh games from scraper
 */
export async function refreshGames() {
    try {
        const response = await fetch(`${API_BASE_URL}/refresh`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Refresh failed:', error);
    }
    return null;
}

/**
 * Get statistics
 */
export async function getStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Failed to get stats:', error);
    }
    return null;
}

/**
 * Get services info
 */
export async function getServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Failed to get services:', error);
    }
    return null;
}

/**
 * Search games
 */
export async function searchGames(query, service = null) {
    try {
        let url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`;
        if (service) {
            url += `&service=${service}`;
        }
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Search failed:', error);
    }
    return { games: [], count: 0 };
}

/**
 * Get game by ID
 */
export async function getGameById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/games/${id}`);
        if (response.ok) {
            const data = await response.json();
            return data.game;
        }
    } catch (error) {
        console.error('Failed to get game:', error);
    }
    return null;
}

/**
 * Fallback games data
 */
function getFallbackGames() {
    return [
        {
            id: '1',
            title: 'Cyberpunk 2077',
            service: 'gfn',
            imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4a7y.jpg',
            description: 'An open-world RPG set in Night City',
            publisher: 'CD Projekt Red',
            genre: 'RPG',
            year: 2020,
            score: 8.5,
            url: 'https://www.nvidia.com/en-us/geforce-now/games/',
            color: 'from-green-400 to-green-700'
        },
        {
            id: '2',
            title: 'Halo Infinite',
            service: 'xbox',
            imageUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4rq7.jpg',
            description: 'The next chapter in the Halo saga',
            publisher: 'Xbox Game Studios',
            genre: 'Shooter',
            year: 2021,
            score: 9.0,
            url: 'https://www.xbox.com/en-US/play/games/halo-infinite',
            color: 'from-blue-400 to-blue-700'
        }
    ];
}