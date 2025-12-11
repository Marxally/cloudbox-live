import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve React app from 'frontend/build'
const frontendBuildPath = path.join(__dirname, 'frontend', 'build');
if (existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  console.log('✅ Serving React app from build folder');
}

// Path to games cache
const CACHE_DIR = path.join(__dirname, 'backend', 'cache');
const GAMES_CACHE_FILE = path.join(CACHE_DIR, 'games-cache.json');
let CACHED_GAMES = [];

// Load games from cache or use fallback
async function loadGames() {
  try {
    if (existsSync(GAMES_CACHE_FILE)) {
      const cacheData = await fs.readFile(GAMES_CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(cacheData);
      CACHED_GAMES = parsed.games || parsed;
      console.log(`✅ Loaded ${CACHED_GAMES.length} games from cache`);
    } else {
      console.log('⚠️ games-cache.json not found, using fallback data');
      CACHED_GAMES = [
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
  } catch (error) {
    console.error('❌ Error loading games:', error);
    CACHED_GAMES = [];
  }
}

// API Routes
app.get('/api/games', async (req, res) => {
  try {
    const { service, search } = req.query;
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
        (game.genre && game.genre.toLowerCase().includes(searchLower)) ||
        (game.publisher && game.publisher.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({
      success: true,
      count: games.length,
      games: games
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CloudBox API',
    games: CACHED_GAMES.length,
    timestamp: new Date().toISOString()
  });
});

// For all other routes, serve the React app
app.get('*', (req, res) => {
  if (existsSync(frontendBuildPath)) {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    res.json({
      message: 'CloudBox Backend is running',
      api: 'Visit /api/games',
      health: 'Visit /health'
    });
  }
});

// Start the server
app.listen(PORT, async () => {
  await loadGames();
  
  console.log(`
========================================
🚀 CloudBox Server Started!
========================================
🌐 Local:    http://localhost:${PORT}
📊 API:      http://localhost:${PORT}/api/games
❤️  Health:   http://localhost:${PORT}/health
🎮 Games:    ${CACHED_GAMES.length} loaded
========================================
  `);
});