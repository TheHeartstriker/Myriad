/**
 * Maps a Celsius temperature to an RGB color.
 * -30°C (coldest) => cyan (0, 255, 255)
 * 57°C (hottest)  => red  (255, 0, 0)
 * Values in between are interpolated.
 */
export function tempToRGB(tempC: number): { r: number; g: number; b: number } {
  const minTemp = -30;
  const maxTemp = 57;

  // Clamp temp to range
  const t = Math.max(minTemp, Math.min(maxTemp, tempC));
  // Normalize to 0..1
  const norm = (t - minTemp) / (maxTemp - minTemp);

  // Interpolate from cyan (0,255,255) to red (255,0,0)
  const r = Math.round(255 * norm);
  const g = Math.round(255 * (1 - norm));
  const b = Math.round(255 * (1 - norm));

  return { r, g, b };
}
