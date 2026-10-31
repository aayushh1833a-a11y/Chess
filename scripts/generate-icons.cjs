const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// SVG Icon: Gothic Wizard Chess Knight Emblem
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#161c2b" />
      <stop offset="60%" stop-color="#0a0d14" />
      <stop offset="100%" stop-color="#040609" />
    </radialGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff2af" />
      <stop offset="35%" stop-color="#d4af37" />
      <stop offset="70%" stop-color="#aa8214" />
      <stop offset="100%" stop-color="#6e5006" />
    </linearGradient>
    <linearGradient id="cyanMagic" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64dfdf" />
      <stop offset="100%" stop-color="#48bfe3" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background base -->
  <rect width="512" height="512" rx="110" fill="url(#bgGlow)" />

  <!-- Sanctum runic circle -->
  <circle cx="256" cy="256" r="220" fill="none" stroke="url(#goldGradient)" stroke-width="3" stroke-dasharray="14 10" opacity="0.6" />
  <circle cx="256" cy="256" r="200" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.4" />
  
  <!-- Outer gothic corner accents -->
  <path d="M 60 120 L 60 60 L 120 60" fill="none" stroke="#d4af37" stroke-width="3" opacity="0.7" />
  <path d="M 452 120 L 452 60 L 392 60" fill="none" stroke="#d4af37" stroke-width="3" opacity="0.7" />
  <path d="M 60 392 L 60 452 L 120 452" fill="none" stroke="#d4af37" stroke-width="3" opacity="0.7" />
  <path d="M 452 392 L 452 452 L 392 452" fill="none" stroke="#d4af37" stroke-width="3" opacity="0.7" />

  <!-- Magical aura circle -->
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#cyanMagic)" stroke-width="2" opacity="0.3" filter="url(#glow)" />

  <!-- Sculpted Gothic Wizard Chess Knight Silhouette -->
  <g id="knight-emblem" filter="url(#glow)">
    <!-- Base pedestal -->
    <path d="M 170 395 C 190 385, 322 385, 342 395 L 356 418 L 156 418 Z" fill="url(#goldGradient)" />
    <path d="M 185 385 C 210 380, 302 380, 327 385 L 334 394 L 178 394 Z" fill="#fff2af" opacity="0.8" />

    <!-- Knight Neck & Head -->
    <path d="M 195 380 
             C 192 340, 185 300, 165 260 
             C 150 230, 155 195, 185 160 
             C 200 142, 225 125, 255 110 
             C 260 108, 275 120, 270 135 
             C 265 148, 252 155, 258 170 
             C 278 165, 305 175, 322 195 
             C 335 210, 335 230, 320 245 
             C 305 260, 278 262, 275 275 
             C 272 290, 288 320, 310 350 
             C 320 365, 325 375, 325 380 Z" 
          fill="url(#goldGradient)" />

    <!-- Mane Serrations (Gothic battle steed) -->
    <path d="M 172 245 L 145 235 L 168 220 L 140 205 L 168 190 L 145 170 L 180 160" 
          fill="none" stroke="url(#goldGradient)" stroke-width="6" stroke-linejoin="round" />

    <!-- Glowing Mystic Eye -->
    <polygon points="280,205 292,208 285,214 275,210" fill="#64dfdf" filter="url(#glow)" />
    <circle cx="284" cy="209" r="2.5" fill="#ffffff" />

    <!-- Muzzle / Jaw chisel line -->
    <path d="M 320 245 C 310 250, 295 248, 285 240" fill="none" stroke="#6e5006" stroke-width="3" />
  </g>

  <!-- Arcane Sparkles / Stars -->
  <path d="M 256 70 L 260 84 L 274 88 L 260 92 L 256 106 L 252 92 L 238 88 L 252 84 Z" fill="#fff2af" />
  <path d="M 380 140 L 383 150 L 393 153 L 383 156 L 380 166 L 377 156 L 367 153 L 377 150 Z" fill="#64dfdf" opacity="0.8" />
  <path d="M 130 330 L 133 340 L 143 343 L 133 346 L 130 356 L 127 346 L 117 343 L 127 340 Z" fill="#64dfdf" opacity="0.8" />
</svg>`;

// Write public/icon.svg
const publicDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
console.log('Created public/icon.svg');

// PNG Generator Function
function createPng(width, height, getPixel) {
  const rowLen = 1 + width * 4;
  const raw = Buffer.alloc(height * rowLen);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    raw[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idatData = zlib.deflateSync(raw);
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Procedural Gothic Chess Emblem Pixel Generator
function renderIconPixel(x, y, w, h, isMaskable = false) {
  // Normalize to -1 to +1
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background gradient: dark sanctum obsidian
  const bgGrad = Math.min(1, dist * 0.9);
  let r = Math.round(18 * (1 - bgGrad) + 5 * bgGrad);
  let g = Math.round(22 * (1 - bgGrad) + 8 * bgGrad);
  let b = Math.round(35 * (1 - bgGrad) + 14 * bgGrad);
  let a = 255;

  // Scale coordinates inside safe area if maskable
  const scale = isMaskable ? 0.72 : 0.88;
  const sx = nx / scale;
  const sy = ny / scale;
  const sDist = Math.sqrt(sx * sx + sy * sy);

  // Outer gold ring
  if (sDist > 0.85 && sDist < 0.91) {
    const ringT = (sDist - 0.85) / 0.06;
    const ringGlow = Math.sin(ringT * Math.PI);
    r = Math.min(255, Math.round(r + 212 * ringGlow));
    g = Math.min(255, Math.round(g + 175 * ringGlow));
    b = Math.min(255, Math.round(b + 55 * ringGlow));
  }

  // Cyan mystical inner halo
  if (sDist > 0.60 && sDist < 0.75) {
    const haloT = (sDist - 0.60) / 0.15;
    const haloGlow = Math.sin(haloT * Math.PI) * 0.35;
    r = Math.min(255, Math.round(r + 78 * haloGlow));
    g = Math.min(255, Math.round(g + 190 * haloGlow));
    b = Math.min(255, Math.round(b + 220 * haloGlow));
  }

  // Draw Knight piece center silhouette
  // Base pedestal
  if (sy > 0.42 && sy < 0.62 && Math.abs(sx) < (0.35 + (sy - 0.42) * 0.4)) {
    const goldFactor = (1 - (sy - 0.42) * 2.5);
    r = Math.round(225 * 0.7 + 245 * goldFactor * 0.3);
    g = Math.round(180 * 0.7 + 210 * goldFactor * 0.3);
    b = Math.round(55 * 0.7 + 110 * goldFactor * 0.3);
  }

  // Knight Body / Neck
  const neckY = sy + 0.05;
  const neckCenter = -0.05 + neckY * 0.25;
  const neckWidth = 0.22 + (neckY + 0.3) * 0.28;
  if (sy >= -0.25 && sy <= 0.45 && Math.abs(sx - neckCenter) < neckWidth) {
    // Steed mane / back curve
    if (sx < neckCenter - neckWidth * 0.5) {
      // mane jagged edges
      const maneWave = Math.sin(sy * 30);
      if (maneWave > 0.2) {
        r = 240; g = 210; b = 80;
      } else {
        r = 180; g = 140; b = 30;
      }
    } else {
      // Golden stone shading
      const light = Math.max(0, 1 - (sx + 0.3));
      r = Math.min(255, Math.round(200 + 55 * light));
      g = Math.min(255, Math.round(160 + 50 * light));
      b = Math.min(255, Math.round(40 + 40 * light));
    }
  }

  // Knight Head / Snout
  if (sy >= -0.55 && sy < -0.15) {
    const headX = sx - 0.05;
    const headY = sy + 0.35;
    const snoutDist = Math.sqrt(headX * headX * 1.4 + headY * headY * 2.2);
    if (snoutDist < 0.32) {
      // Snout front
      r = 235; g = 195; b = 65;
    }
    // Glowing cyan eye
    const eyeDx = sx - 0.12;
    const eyeDy = sy + 0.32;
    if (Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy) < 0.035) {
      r = 100; g = 240; b = 255;
    }
    // Crown / ear
    const earX = sx + 0.08;
    const earY = sy + 0.50;
    if (earY < 0 && Math.abs(earX) < 0.07 + earY * 0.3) {
      r = 245; g = 215; b = 80;
    }
  }

  // Corner rounding for non-maskable icons
  if (!isMaskable) {
    const cornerR = 0.38;
    const cx = Math.max(0, Math.abs(nx) - (1 - cornerR));
    const cy = Math.max(0, Math.abs(ny) - (1 - cornerR));
    if (cx * cx + cy * cy > cornerR * cornerR) {
      a = 0;
    }
  }

  return [r, g, b, a];
}

// Generate PWA Icons
console.log('Generating PNG icons...');
const png192 = createPng(192, 192, (x, y, w, h) => renderIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('Created public/pwa-192x192.png (', png192.length, 'bytes)');

const png512 = createPng(512, 512, (x, y, w, h) => renderIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
console.log('Created public/pwa-512x512.png (', png512.length, 'bytes)');

const pngMaskable512 = createPng(512, 512, (x, y, w, h) => renderIconPixel(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable512);
console.log('Created public/pwa-maskable-512x512.png (', pngMaskable512.length, 'bytes)');

const appleTouchIcon = createPng(180, 180, (x, y, w, h) => renderIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);
console.log('Created public/apple-touch-icon.png (', appleTouchIcon.length, 'bytes)');

const favicon = createPng(64, 64, (x, y, w, h) => renderIconPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon);
console.log('Created public/favicon.ico (', favicon.length, 'bytes)');

console.log('All icons generated successfully!');
