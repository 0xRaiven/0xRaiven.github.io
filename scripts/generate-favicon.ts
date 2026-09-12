import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG definition
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <!-- Background Obsidian Gradient -->
    <linearGradient id="tileBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#151319"/>
      <stop offset="100%" stop-color="#09080c"/>
    </linearGradient>

    <!-- Vibrant Crimson Diagonal Accent -->
    <linearGradient id="crimsonAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3b5c"/>
      <stop offset="100%" stop-color="#d12c4b"/>
    </linearGradient>

    <!-- Crisp Platinum/Metallic Pillars -->
    <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e4e4e7"/>
    </linearGradient>

    <!-- Ambient Crimson Glow -->
    <radialGradient id="ambientGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#ff3b5c" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ff3b5c" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Obsidian Squircle Base -->
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#tileBg)" stroke="#d12c4b" stroke-width="1.5" stroke-opacity="0.4"/>
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#ambientGlow)"/>

  <!-- Geometric Designer Monogram "R" -->
  <!-- Left Stem -->
  <path d="M16 16 H24.5 V48 H16 Z" fill="url(#pillarGrad)"/>

  <!-- Loop & Diagonal Leg (Integrated) -->
  <path d="M24.5 16 H36.5 C43 16 47 19.8 47 25.5 C47 29.8 44.5 33 40.5 34.2 L47.5 48 H38.5 L32.2 34.5 H24.5 V16 Z M24.5 22.2 V28.3 H35.5 C38 28.3 39.5 27.2 39.5 25.3 C39.5 23.4 38 22.2 35.5 22.2 H24.5 Z" fill="url(#pillarGrad)"/>

  <!-- Precision Crimson Blade Accent on the Leg -->
  <path d="M33 34.5 H40.5 L47.5 48 H40 Z" fill="url(#crimsonAccent)"/>
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
