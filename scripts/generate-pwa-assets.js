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

  // Clean up any stale screenshot files if present
  ['screenshot-wide.png', 'screenshot-narrow.png'].forEach((f) => {
    const p = path.join(publicDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('✅ All PWA icons generated successfully with sharp.');
}

generateAssets().catch((err) => {
  console.error('Error generating PWA assets:', err);
  process.exit(1);
});
