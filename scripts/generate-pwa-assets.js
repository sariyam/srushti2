import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateAssets() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const code = fs.readFileSync(path.join(rootDir, 'src/assets/logoBase64.ts'), 'utf8');
  const frontMatch = code.match(/front:\s*"data:image\/png;base64,([^"]+)"/);
  const backMatch = code.match(/back:\s*"data:image\/png;base64,([^"]+)"/);

  if (!frontMatch) {
    throw new Error('Front logo base64 not found in src/assets/logoBase64.ts');
  }

  const frontBuf = Buffer.from(frontMatch[1], 'base64');
  const backBuf = backMatch ? Buffer.from(backMatch[1], 'base64') : frontBuf;

  // Save source assets
  fs.writeFileSync(path.join(publicDir, 'front_logo.png'), frontBuf);
  fs.writeFileSync(path.join(publicDir, 'back_logo.png'), backBuf);

  // 1. Square icons for PWA (purpose: 'any')
  await sharp(frontBuf)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'pwa-64x64.png'));

  await sharp(frontBuf)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  await sharp(frontBuf)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 2. Square icons for Apple & Favicons
  await sharp(frontBuf)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(frontBuf)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  // 3. Maskable icons (purpose: 'maskable') with 20% safe-padding on #ebeaea background
  const maskable192Logo = await sharp(frontBuf)
    .resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 235, g: 234, b: 234, alpha: 1 },
    },
  })
    .composite([{ input: maskable192Logo, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-192x192.png'));

  const maskable512Logo = await sharp(frontBuf)
    .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 235, g: 234, b: 234, alpha: 1 },
    },
  })
    .composite([{ input: maskable512Logo, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 4. Desktop Wide Screenshot (1280x720) for Richer PWA Install UI
  const wideLogo = await sharp(frontBuf)
    .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // SVG overlay for wide banner
  const wideSvg = Buffer.from(`
    <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#ebeaea"/>
      <rect x="40" y="40" width="1200" height="640" rx="32" fill="#ffffff" stroke="#e0dede" stroke-width="2"/>
      <text x="640" y="140" font-family="system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="#1a1918">
        Srushti AI — Business to Brand
      </text>
      <text x="640" y="200" font-family="system-ui, sans-serif" font-size="22" font-weight="600" text-anchor="middle" fill="#666666">
        AI-Powered Studio Photography for Garments &amp; Jewelry
      </text>
    </svg>
  `);

  await sharp(wideSvg)
    .composite([{ input: wideLogo, top: 250, left: 480 }])
    .png()
    .toFile(path.join(publicDir, 'screenshot-wide.png'));

  // 5. Mobile Narrow Screenshot (750x1334) for Richer PWA Install UI
  const narrowLogo = await sharp(frontBuf)
    .resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const narrowSvg = Buffer.from(`
    <svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="1334" fill="#ebeaea"/>
      <rect x="30" y="50" width="690" height="1234" rx="36" fill="#ffffff" stroke="#e0dede" stroke-width="2"/>
      <text x="375" y="160" font-family="system-ui, sans-serif" font-size="40" font-weight="900" text-anchor="middle" fill="#1a1918">
        Srushti AI
      </text>
      <text x="375" y="220" font-family="system-ui, sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="#666666">
        Business to Brand
      </text>
      <text x="375" y="260" font-family="system-ui, sans-serif" font-size="16" font-weight="500" text-anchor="middle" fill="#888888">
        Instant AI Product Photoshoots
      </text>
    </svg>
  `);

  await sharp(narrowSvg)
    .composite([{ input: narrowLogo, top: 400, left: 225 }])
    .png()
    .toFile(path.join(publicDir, 'screenshot-narrow.png'));

  console.log('✅ All PWA icons and screenshots generated successfully with sharp.');
}

generateAssets().catch((err) => {
  console.error('Error generating PWA assets:', err);
  process.exit(1);
});
