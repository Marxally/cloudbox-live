// convert-cache.js
import fs from 'fs/promises';
import { existsSync } from 'fs';

async function convertCache() {
  try {
    // Load your cache file - CHANGE THIS FILENAME
    const cacheData = JSON.parse(await fs.readFile('./your-cache-file.json', 'utf-8'));
    
    console.log(`Loaded cache with ${Object.keys(cacheData).length} entries`);
    
    // Convert to array format
    const gamesArray = [];
    let index = 0;
    
    for (const [hash, gameObj] of Object.entries(cacheData)) {
      const game = gameObj.data;
      
      // Skip if no game data
      if (!game || !game.title) {
        continue;
      }
      
      // Determine service (GFN or Xbox)
      let service = game.service || 'gfn';
      let url = game.url;
      let color = game.color;
      
      // If no service specified, try to guess from title
      if (!game.service) {
        const titleLower = game.title.toLowerCase();
        if (titleLower.includes('halo') || 
            titleLower.includes('forza') || 
            titleLower.includes('gears') || 
            titleLower.includes('flight simulator') ||
            titleLower.includes('sea of thieves') ||
            titleLower.includes('starfield') ||
            titleLower.includes('doom')) {
          service = 'xbox';
          url = `https://www.xbox.com/en-US/play/games/${game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          color = 'from-blue-400 to-blue-700';
        } else {
          service = 'gfn';
          url = 'https://www.nvidia.com/en-us/geforce-now/games/';
          color = 'from-green-400 to-green-700';
        }
      }
      
      // Create a proper game object
      gamesArray.push({
        id: `game_${index}_${hash.substring(0, 8)}`,
        title: game.title,
        service: service,
        imageUrl: game.imageUrl || `https://placehold.co/600x900/${service === 'xbox' ? '0078D4' : '107C10'}/white?text=${encodeURIComponent(game.title.substring(0, 30))}`,
        description: (game.description && game.description !== 'undefined...') 
          ? game.description
          : `${game.title} is available on ${service === 'xbox' ? 'Xbox Cloud Gaming' : 'GeForce NOW'}.`,
        publisher: game.publisher === 'Various' ? 'Multiple Publishers' : game.publisher || 'Unknown Publisher',
        genre: game.genre || 'Game',
        year: game.year || 2020,
        score: game.score || 0.0,
        url: url,
        color: color,
        source: game.source || 'cache'
      });
      
      index++;
      
      // Progress update
      if (index % 1000 === 0) {
        console.log(`Processed ${index} games...`);
      }
    }
    
    console.log(`✅ Converted ${gamesArray.length} games`);
    
    // Create cache directory if it doesn't exist
    if (!existsSync('./cache')) {
      await fs.mkdir('./cache', { recursive: true });
    }
    
    // Save as new cache file
    const newCache = {
      games: gamesArray,
      timestamp: Date.now(),
      count: gamesArray.length,
      sources: {
        gfn: gamesArray.filter(g => g.service === 'gfn').length,
        xbox: gamesArray.filter(g => g.service === 'xbox').length
      }
    };
    
    await fs.writeFile('./cache/games-cache.json', JSON.stringify(newCache, null, 2));
    console.log('✅ Saved to cache/games-cache.json');
    
    // Also save as sample data
    await fs.writeFile('./sample-games.json', JSON.stringify(gamesArray.slice(0, 100), null, 2));
    console.log('✅ Saved 100 sample games to sample-games.json');
    
    console.log('\n📊 Statistics:');
    console.log(`- Total games: ${gamesArray.length}`);
    console.log(`- GFN games: ${gamesArray.filter(g => g.service === 'gfn').length}`);
    console.log(`- Xbox games: ${gamesArray.filter(g => g.service === 'xbox').length}`);
    
  } catch (error) {
    console.error('Error:', error);
    console.log('\n💡 Make sure your cache file is named "your-cache-file.json" in the backend folder');
    console.log('💡 Or update the filename in line 8 of this script');
  }
}

convertCache();