const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const svgContent = `
  <svg width="512" height="512" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4F46E5" />
        <stop offset="100%" stop-color="#7C3AED" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#cloudGradient)"/>
    <path d="M16 28C13.8 28 12 26.2 12 24C12 21.8 13.8 20 16 20C16.4 20 16.8 20.1 17.2 20.2C18.7 16.5 22.3 14 26.5 14C31.2 14 35 17.8 35 22.5C35 25.1 33.9 27.4 32 29C31.1 29.6 30 30 28.8 30H20C18.9 30 17.8 29.6 16.9 29C16.3 28.6 15.7 28.3 15 28H16Z" fill="white"/>
    <path d="M28 22.5C28 24.985 25.985 27 23.5 27C21.015 27 19 24.985 19 22.5C19 20.015 21.015 18 23.5 18C25.985 18 28 20.015 28 22.5Z" fill="white" fill-opacity="0.8"/>
  </svg>
  `;

  const sizes = [
    { name: 'favicon', size: 48 },
    { name: 'logo192', size: 192 },
    { name: 'logo512', size: 512 },
    { name: 'apple-touch-icon', size: 180 },
    { name: 'logo144', size: 144 },
  ];

  for (const { name, size } of sizes) {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '../public', `${name}.png`));
    
    console.log(`Generated ${name}.png (${size}x${size})`);
  }

  // Also create the SVG file
  await fs.writeFile(
    path.join(__dirname, '../public', 'favicon.svg'),
    svgContent
  );
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);