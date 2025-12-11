// Simple 2D Perlin-like noise implementation (small, dependency-free)
// Not a full-featured library but suitable for terrain height generation.
const PERM = new Uint8Array(512);
const P = new Uint8Array(256);
for (let i = 0; i < 256; i++) P[i] = i;
// simple shuffle
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const t = P[i];
  P[i] = P[j];
  P[j] = t;
}
for (let i = 0; i < 512; i++) PERM[i] = P[i & 255];

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

function grad(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function noise2D(x, y) {
  // Grid cell coordinates
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const aa = PERM[PERM[X] + Y];
  const ab = PERM[PERM[X] + Y + 1];
  const ba = PERM[PERM[X + 1] + Y];
  const bb = PERM[PERM[X + 1] + Y + 1];

  const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
  const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
  return lerp(x1, x2, v);
}

export function fractalNoise(x, y, octaves = 4, lacunarity = 2, gain = 0.5) {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    sum += noise2D(x * freq, y * freq) * amp;
    max += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / max;
}

export default noise2D;
