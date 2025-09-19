import type { IdValue } from "../PolySvg/types";
//
//Color changing functions based on params mainly distance
//

//Turns to white the closer to the mouse, black the further | Also ignores initial color
export function darkenDistance(
  i: IdValue,
  distanceMax = 1000,
  intensity = [0.01, 0.99]
) {
  //Collect needed elements and values
  const el = document.getElementById(i.id);
  if (!el) return;
  const distance = Math.min(i.distanceToMouse, distanceMax);
  const originalLightness = 100;
  // Normalize: 0.01 (close) to 0.99 (far)
  const norm = intensity[0] + intensity[1] * (distance / distanceMax);
  const lightness = Math.round(originalLightness * norm);
  // Apply new color
  el.style.fill = `hsl(0, 0%, ${lightness}%)`;
  el.style.stroke = `hsl(0, 0%, ${lightness}%)`;
  el.style.transition = "fill 0.3s linear, stroke 0.3s linear";
}

//Darkens intial color based on distance to mouse
export function darkenColorDistance(
  i: IdValue,
  distanceMax = 1000,
  intensity = [0.01, 0.99]
) {
  let el = document.getElementById(i.id);
  if (!el) return;
  let distance = i.distanceToMouse;
  // Normalize distance
  const norm = intensity[0] + intensity[1] * (distance / distanceMax);
  const lightness = Math.round(i.color[2] * norm);

  // Glow strength: closer = stronger
  const glowStrength = Math.round(16 * (1 - distance / distanceMax)); // 0-16px
  const glowColor = `hsl(${i.color[0]}, ${i.color[1]}%, ${lightness + 20}%)`;

  el.style.fill = `hsl(${i.color[0]}, ${i.color[1]}%, ${lightness}%)`;
  el.style.stroke = `hsl(${i.color[0]}, ${i.color[1]}%, ${lightness}%)`;
  el.style.transition =
    "fill 0.3s linear, stroke 0.3s linear, filter 0.3s linear";
  el.style.filter = `drop-shadow(0 0 ${glowStrength}px ${glowColor})`;
}
