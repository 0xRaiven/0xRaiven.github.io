import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG definition: "0x Hex NetCore" (100% Transparent background, Network nodes + Git Branch + 0x Hex notation)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <!-- Vibrant Electric Crimson Gradient -->
    <linearGradient id="neonCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3b69"/>
      <stop offset="60%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>

    <!-- Pure Platinum Chrome Gradient -->
    <linearGradient id="chromePillar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <!-- Obsidian Core Shadow for universal contrast across both dark & light backgrounds -->
    <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- Dark Contour Underlay: Ensures crisp visibility across light and dark themes -->
  <g opacity="0.9" filter="url(#cyberGlow)">
    <polygon points="32,5 57,19.5 57,44.5 32,59 7,44.5 7,19.5" 
             stroke="#0b0a10" stroke-width="7" stroke-linejoin="round"/>
    <line x1="17" y1="21" x2="47" y2="43" stroke="#0b0a10" stroke-width="6.5" stroke-linecap="round"/>
    <line x1="17" y1="43" x2="47" y2="21" stroke="#0b0a10" stroke-width="6.5" stroke-linecap="round"/>
  </g>

  <!-- Outer "0" Ring: Cybernetic Hexagon Loop (Transparent background) -->
  <polygon points="32,5 57,19.5 57,44.5 32,59 7,44.5 7,19.5" 
           stroke="url(#neonCrimson)" stroke-width="4.2" stroke-linejoin="round"/>

  <!-- Inner "x" Cross: Git Branching & Network Data Paths -->
  <line x1="17" y1="21" x2="47" y2="43" stroke="url(#chromePillar)" stroke-width="3.6" stroke-linecap="round"/>
  <line x1="17" y1="43" x2="47" y2="21" stroke="url(#chromePillar)" stroke-width="3.6" stroke-linecap="round"/>

  <!-- Center Hub: Central Network Router / Git Merge Point -->
  <circle cx="32" cy="32" r="6" fill="#09080d" stroke="url(#neonCrimson)" stroke-width="2.6"/>
  <circle cx="32" cy="32" r="2.4" fill="#ffffff"/>

  <!-- 4 Terminal Commit Nodes: Distributed Network Packets -->
  <!-- Top-Left Commit Node -->
  <circle cx="17" cy="21" r="4.5" fill="#09080d" stroke="#ffffff" stroke-width="2.2"/>
  <circle cx="17" cy="21" r="1.6" fill="#ff2a5f"/>

  <!-- Top-Right Commit Node -->
  <circle cx="47" cy="21" r="4.5" fill="#09080d" stroke="#ffffff" stroke-width="2.2"/>
  <circle cx="47" cy="21" r="1.6" fill="#ff2a5f"/>

  <!-- Bottom-Left Commit Node -->
  <circle cx="17" cy="43" r="4.5" fill="#09080d" stroke="#ffffff" stroke-width="2.2"/>
  <circle cx="17" cy="43" r="1.6" fill="#ff2a5f"/>

  <!-- Bottom-Right Commit Node -->
  <circle cx="47" cy="43" r="4.5" fill="#09080d" stroke="#ffffff" stroke-width="2.2"/>
  <circle cx="47" cy="43" r="1.6" fill="#ff2a5f"/>

  <!-- Apex Telemetry Ping Dots -->
  <circle cx="32" cy="5" r="2.2" fill="#ffffff"/>
  <circle cx="32" cy="59" r="2.2" fill="#ffffff"/>
</svg>`;

// Function to construct a multi-size ICO from PNG buffers
function createIco(pngBuffers: Buffer[]): Buffer {
  // ICO header: 6 bytes
  // 2 bytes: reserved (0)
  // 2 bytes: image type (1 = icon)
  // 2 bytes: number of images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  // Directory entries: 16 bytes per image
  const entries: Buffer[] = [];
  let offset = 6 + pngBuffers.length * 16;

  for (const png of pngBuffers) {
    // Read PNG width & height (IHDR chunk is at byte 12-24)
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);

    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color palette (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset

    entries.push(entry);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const appDir = path.join(process.cwd(), 'app');

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent.trim());
  console.log('Saved SVG icon to public/icon.svg and app/icon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // Generate PNGs
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  console.log('Saved apple-touch-icon.png, icon-192.png, icon-512.png');

  // Create multi-res ICO (16x16, 32x32, 48x48)
  const icoBuffer = createIco([png16, png32, png48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Saved multi-resolution favicon.ico to public/ and app/');
}

main().catch(console.error);
