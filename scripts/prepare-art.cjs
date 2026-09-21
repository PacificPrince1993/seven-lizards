// Turn the supplied numbered artwork into named, web-sized assets.
//
// The source PNGs already carry an alpha channel, but they were cut from a dark
// glow backdrop, so roughly 70% of their soft edge pixels are dark. Composited
// on the cream page that reads as a grey halo. Un-multiplying those edge pixels
// (scaling colour back up by the coverage they were blended with) restores the
// intended edge colour without touching the solid interior.
const sharp = require('sharp');

const JOBS = [
  { src: '5.png', out: 'hero-city',        width: 1920, format: 'webp', despill: false },
  { src: '6.png', out: 'scene-builders',   width: 1000, format: 'webp', despill: true },
  { src: '1.png', out: 'scene-helmet',     width: 1100, format: 'webp', despill: true },
  { src: '2.png', out: 'scene-blueprints', width: 1100, format: 'webp', despill: true },
  // The foundation strip carries ~230px of empty sky above the artwork, which
  // would open a gap between the last section and the footer. Crop it off.
  { src: '4.png', out: 'band-foundation',  width: 1920, format: 'webp', despill: true, trimTop: true },
  // PNG for the favicon, plus a much lighter webp for the header itself.
  { src: '3.png', out: 'logo-crest',       width: 900,  format: 'png',  despill: true },
  { src: '3.png', out: 'logo-crest',       width: 560,  format: 'webp', despill: true },
];

// Reverse the dark blend on partially transparent pixels.
function despill(data, channels) {
  let fixed = 0;
  for (let i = 0; i < data.length; i += channels) {
    const a = data[i + 3];
    if (a <= 8 || a >= 248) continue;
    const k = a / 255;
    for (let c = 0; c < 3; c++) {
      const v = Math.round(data[i + c] / k);
      data[i + c] = v > 255 ? 255 : v;
    }
    fixed++;
  }
  return fixed;
}

(async () => {
  for (const job of JOBS) {
    const src = `art-src/${job.src}`;
    let pipeline = sharp(src).ensureAlpha();

    if (job.despill) {
      const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
      const n = despill(data, info.channels);
      pipeline = sharp(data, {
        raw: { width: info.width, height: info.height, channels: info.channels },
      });
      console.log(`${job.src}: un-multiplied ${n} edge px`);
    }

    if (job.trimTop) {
      const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
      const { width, height, channels } = info;
      let top = 0;
      outer: for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (data[(y * width + x) * channels + 3] > 12) { top = y; break outer; }
        }
      }
      const cut = Math.max(0, top - 4);
      console.log(`${job.src}: cropping ${cut}px of empty sky`);
      pipeline = sharp(data, { raw: { width, height, channels } })
        .extract({ left: 0, top: cut, width, height: height - cut });
    }

    pipeline = pipeline.resize({ width: job.width, withoutEnlargement: true });

    const dest = `public/assets/${job.out}.${job.format}`;
    if (job.format === 'webp') {
      await pipeline.webp({ quality: 86, alphaQuality: 100, effort: 5 }).toFile(dest);
    } else {
      await pipeline.png({ compressionLevel: 9, palette: false }).toFile(dest);
    }

    const meta = await sharp(dest).metadata();
    const kb = (require('fs').statSync(dest).size / 1024).toFixed(0);
    console.log(`  -> ${dest}  ${meta.width}x${meta.height}  ${kb} KB`);
  }
})();
