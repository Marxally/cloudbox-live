// server.js - CloudBox API using your cached games
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Cache directory
const CACHE_DIR = './cache';
const GAMES_CACHE_FILE = `${CACHE_DIR}/games-cache.json`;

// Load games from cache
let CACHED_GAMES = [];

async function loadGamesFromCache() {
  try {
    if (existsSync(GAMES_CACHE_FILE)) {
      const cacheData = await fs.readFile(GAMES_CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(cacheData);
      CACHED_GAMES = parsed.games || [];
      console.log(`✅ Loaded ${CACHED_GAMES.length} games from cache`);
    } else {
      // Fallback to sample games if no cache
      CACHED_GAMES = [
        {
          id: '1',
          title: 'Cyberpunk 2077',
          service: 'gfn',
          imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
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
          imageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg',
          description: 'The next chapter in the Halo saga',
          publisher: 'Xbox Game Studios',
          genre: 'Shooter',
          year: 2021,
          score: 9.0,
          url: 'https://www.xbox.com/en-US/play/games/halo-infinite',
          color: 'from-blue-400 to-blue-700'
        }
      ];
      console.log('⚠️ Using sample games (cache not found)');
    }
  } catch (error) {
    console.error('Failed to load cache:', error);
  }
}

// Ensure cache directory exists
async function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

// --- API Endpoints ---

// Get games (with optional filtering)
app.get('/api/games', async (req, res) => {
  try {
    const { service, search, limit, offset } = req.query;
    
    let games = [...CACHED_GAMES];
    
    // Filter by service
    if (service && service !== 'all') {
      games = games.filter(game => game.service === service);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      games = games.filter(game => 
        game.title.toLowerCase().includes(searchLower) ||
        game.genre.toLowerCase().includes(searchLower) ||
        game.publisher.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const total = games.length;
    const start = offset ? parseInt(offset) : 0;
    const end = limit ? start + parseInt(limit) : games.length;
    const paginatedGames = games.slice(start, end);
    
    res.json({
      success: true,
      count: total,
      games: paginatedGames,
      pagination: {
        offset: start,
        limit: end - start,
        total: total,
        hasMore: end < total
      },
      timestamp: new Date().toISOString(),
      source: 'cached-games'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games',
      message: error.message
    });
  }
});

// Get specific game by ID
app.get('/api/games/:id', async (req, res) => {
  try {
    const game = CACHED_GAMES.find(g => g.id === req.params.id);
    
    if (game) {
      res.json({
        success: true,
        game: game
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search games
app.get('/api/search', async (req, res) => {
  try {
    const { q, service } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters'
      });
    }
    
    const searchLower = q.toLowerCase();
    let games = CACHED_GAMES;
    
    if (service && service !== 'all') {
      games = games.filter(game => game.service === service);
    }
    
    const results = games.filter(game => 
      game.title.toLowerCase().includes(searchLower) ||
      game.genre.toLowerCase().includes(searchLower) ||
      game.publisher.toLowerCase().includes(searchLower)
    ).slice(0, 50); // Limit to 50 results
    
    res.json({
      success: true,
      query: q,
      count: results.length,
      games: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const gfnCount = CACHED_GAMES.filter(g => g.service === 'gfn').length;
    const xboxCount = CACHED_GAMES.filter(g => g.service === 'xbox').length;
    
    res.json({
      success: true,
      total: CACHED_GAMES.length,
      gfn: gfnCount,
      xbox: xboxCount,
      genres: getTopGenres(CACHED_GAMES),
      publishers: getTopPublishers(CACHED_GAMES),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper functions for stats
function getTopGenres(games, limit = 10) {
  const genreCount = {};
  games.forEach(game => {
    genreCount[game.genre] = (genreCount[game.genre] || 0) + 1;
  });
  
  return Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre, count]) => ({ genre, count }));
}

function getTopPublishers(games, limit = 10) {
  const publisherCount = {};
  games.forEach(game => {
    publisherCount[game.publisher] = (publisherCount[game.publisher] || 0) + 1;
  });
  
  return Object.entries(publisherCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([publisher, count]) => ({ publisher, count }));
}

// Get services
app.get('/api/services', (req, res) => {
  const services = [
    { id: 'gfn', name: 'GeForce NOW', color: '#76B900', count: CACHED_GAMES.filter(g => g.service === 'gfn').length },
    { id: 'xbox', name: 'Xbox Cloud Gaming', color: '#107C10', count: CACHED_GAMES.filter(g => g.service === 'xbox').length }
  ];
  
  res.json({
    success: true,
    services: services
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CloudBox Games API',
    version: '3.0.0',
    uptime: process.uptime(),
    games: CACHED_GAMES.length,
    endpoints: [
      '/api/games - Get all games',
      '/api/games?service=gfn|xbox - Filter by service',
      '/api/games?search=query - Search games',
      '/api/games?limit=20&offset=0 - Pagination',
      '/api/games/:id - Get specific game',
      '/api/search?q=query - Search endpoint',
      '/api/stats - Get statistics',
      '/api/services - Get services info',
      '/health - Health check'
    ]
  });
});

// Start server
app.listen(PORT, async () => {
  await ensureCacheDir();
  await loadGamesFromCache();
  
  console.log(`🚀 CloudBox Games API running on http://localhost:${PORT}`);
  console.log(`📊 Loaded ${CACHED_GAMES.length} games from cache`);
  console.log(`🎮 GFN: ${CACHED_GAMES.filter(g => g.service === 'gfn').length} games`);
  console.log(`🎮 Xbox: ${CACHED_GAMES.filter(g => g.service === 'xbox').length} games`);
  console.log(`📊 API: http://localhost:${PORT}/api/games`);
  console.log(`🔍 Search: http://localhost:${PORT}/api/search?q=halo`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});