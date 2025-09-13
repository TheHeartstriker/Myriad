import type { IdArr } from "../types";
//
//Color changing functions based on params mainly distance
//

//Turns to white the closer to the mouse, black the further | Also ignores initial color
export function darkenDistance(i: IdArr, distanceMax = 1000, intensity = 1) {
  let el = document.getElementById(i.id);
  if (!el) return;
  let distance = i.distanceToMouse;
  // Clamp distance to a max value for calculation
  const maxDistance = distanceMax;
  const minLightness = 12; // darkest (in %)
  const maxLightness = 78; // lightest (in %)
  // Calculate lightness based on distance
  let lightness =
    minLightness * intensity +
    ((maxLightness - minLightness) * Math.min(distance, maxDistance)) /
      maxDistance;
  lightness = Math.round(lightness);
  el.style.fill = `hsl(0, 0%, ${lightness}%)`;
  el.style.stroke = `hsl(0, 0%, ${lightness}%)`;
  el.style.transition = "fill 0.3s linear, stroke 0.3s linear";
}

//Darkens intial color based on distance to mouse
export function darkenColorDistance(
  i: IdArr,
  distanceMax = 1000,
  intensity = 1
) {
  let el = document.getElementById(i.id);
  if (!el) return;
  let distance = i.distanceToMouse;
  let originalColor = i.color;
  if (!originalColor) return;

  const hue = Number(originalColor[0]);
  const saturation = Number(originalColor[1]);
  const originalLightness = Number(originalColor[2]);

  // If distance exceeds max, use original lightness
  let lightness;
  if (distance >= distanceMax) {
    lightness = originalLightness;
  } else {
    // Calculate darkened lightness based on distance
    const minLightness = 12; // darkest (in %)
    lightness =
      originalLightness -
      ((originalLightness - minLightness * intensity) *
        (distanceMax - distance)) /
        distanceMax;
    lightness = Math.round(lightness);
  }

  el.style.fill = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  el.style.stroke = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  el.style.transition = "fill 0.3s linear, stroke 0.3s linear";
}
