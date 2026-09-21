// Make a transparent-background version of Logo.png.
//
// The crest sits on a near-black backdrop AND is drawn with near-black
// outlines, so tolerance alone cannot separate them; what does is connectivity
// (the backdrop reaches the border, pockets between mascots do not).
//
// Two refinements matter for a clean result:
//  - no global blur: blurring the whole alpha channel washes grey over the art,
//    so only the boundary ring is softened;
//  - erode the background mask before cutting: the mascots' black outlines sit
//    just inside the fill, and cutting flush with them strips the linework and
//    leaves a dotted fringe. Pulling the cut back by a couple of pixels keeps
//    the outlines the artwork is drawn with.
const sharp = require('sharp');

const SRC = 'Logo.png';
const OUT_W = 640;
const BG = [7, 17, 19];
const TOL = 12;
const KEEP_OUTLINE = 3;   // px of backdrop retained as outline

(async () => {
  const { data, info } = await sharp(SRC).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const N = W * H;

  const near = new Uint8Array(N);
  for (let p = 0, i = 0; p < N; p++, i += C) {
    const d = Math.abs(data[i] - BG[0]) + Math.abs(data[i + 1] - BG[1]) + Math.abs(data[i + 2] - BG[2]);
    near[p] = d <= TOL ? 1 : 0;
  }

  const bg = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;
  const push = (p) => { if (!bg[p] && near[p]) { bg[p] = 1; stack[sp++] = p; } };
  for (let x = 0; x < W; x++) { push(x); push(x + (H - 1) * W); }
  for (let y = 0; y < H; y++) { push(y * W); push(W - 1 + y * W); }
  while (sp > 0) {
    const p = stack[--sp];
    const x = p % W, y = (p - x) / W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (y > 0) push(p - W);
    if (y < H - 1) push(p + W);
  }

  // Erode the background mask: pixels within KEEP_OUTLINE of the artwork go
  // back to opaque, preserving the black linework around every mascot.
  let mask = bg;
  for (let it = 0; it < KEEP_OUTLINE; it++) {
    const next = new Uint8Array(mask);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = y * W + x;
        if (!mask[p]) continue;
        const l = x > 0 && !mask[p - 1], r = x < W - 1 && !mask[p + 1];
        const u = y > 0 && !mask[p - W], d = y < H - 1 && !mask[p + W];
        if (l || r || u || d) next[p] = 0;
      }
    }
    mask = next;
  }

  const alpha = new Uint8Array(N);
  for (let p = 0; p < N; p++) alpha[p] = mask[p] ? 0 : 255;
  // Soften just the cut boundary so the silhouette is not aliased.
  const ring = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (!alpha[p]) continue;
      if (mask[p - 1] || mask[p + 1] || mask[p - W] || mask[p + W]) ring.push(p);
    }
  }
  for (const p of ring) alpha[p] = 190;

  let cut = 0;
  for (let p = 0; p < N; p++) if (mask[p]) cut++;
  console.log('background removed:', (100 * cut / N).toFixed(1) + '%');

  const out = Buffer.alloc(N * 4);
  for (let p = 0, i = 0, o = 0; p < N; p++, i += C, o += 4) {
    out[o] = data[i]; out[o + 1] = data[i + 1]; out[o + 2] = data[i + 2]; out[o + 3] = alpha[p];
  }

  const { data: t, info: ti } = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .trim({ threshold: 1 }).raw().toBuffer({ resolveWithObject: true });
  console.log('trimmed to', ti.width + 'x' + ti.height);

  const base = () => sharp(t, { raw: { width: ti.width, height: ti.height, channels: 4 } })
    .resize({ width: OUT_W });
  await base().webp({ quality: 92, alphaQuality: 100 }).toFile('public/assets/logo-transparent.webp');
  await base().png({ compressionLevel: 9 }).toFile('public/assets/logo-transparent.png');
  console.log('wrote public/assets/logo-transparent.{webp,png}');
})();
