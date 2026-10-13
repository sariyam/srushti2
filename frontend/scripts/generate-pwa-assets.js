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

  const DARK_GREY = { r: 34, g: 34, b: 34, alpha: 1 }; // #222222 elegant dark grey

  // Helper to create square icon with dark grey background
  async function createIcon(size, paddingRatio = 0.82) {
    const logoSize = Math.round(size * paddingRatio);
    const resizedLogo = await sharp(frontBuf)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: DARK_GREY,
      },
    })
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png();
  }

  // 1. Square icons for PWA (purpose: 'any')
  await (await createIcon(64, 0.85)).toFile(path.join(publicDir, 'pwa-64x64.png'));
  await (await createIcon(192, 0.82)).toFile(path.join(publicDir, 'pwa-192x192.png'));
  await (await createIcon(512, 0.82)).toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 2. Square icons for Apple & Favicons
  await (await createIcon(180, 0.82)).toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await (await createIcon(64, 0.85)).toFile(path.join(publicDir, 'favicon.png'));
  await (await createIcon(32, 0.88)).toFile(path.join(publicDir, 'favicon-32x32.png'));
  await (await createIcon(16, 0.90)).toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 3. Maskable icons (purpose: 'maskable') with 25% safe-padding on dark grey background
  await (await createIcon(192, 0.75)).toFile(path.join(publicDir, 'pwa-maskable-192x192.png'));
  await (await createIcon(512, 0.75)).toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

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
