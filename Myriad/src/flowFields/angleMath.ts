// Simple 1D Perlin noise implementation
let permutation = Array.from({ length: 256 }, (_, i) => i);
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
}
permutation = permutation.concat(permutation);

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function grad2d(hash: number, x: number, y: number) {
  // 8 possible directions
  const h = hash & 7;
  const u = h < 4 ? x : y;
  const v = h < 4 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function perlin2D(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const aa = permutation[xi + permutation[yi]];
  const ab = permutation[xi + permutation[yi + 1]];
  const ba = permutation[xi + 1 + permutation[yi]];
  const bb = permutation[xi + 1 + permutation[yi + 1]];

  const x1 = lerp(grad2d(aa, xf, yf), grad2d(ba, xf - 1, yf), u);
  const x2 = lerp(grad2d(ab, xf, yf - 1), grad2d(bb, xf - 1, yf - 1), u);

  return lerp(x1, x2, v); // Output is in [-1, 1]
}
