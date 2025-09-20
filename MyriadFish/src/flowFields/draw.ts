import type { GridEl } from "./types";

export function drawSquare(
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D | null,
  Pix_size: number
) {
  if (!ctx) return;
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent white
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(x, y, Pix_size, Pix_size);
  ctx.stroke();
}

export function angleDraw(
  gridEl: GridEl,
  ctx: CanvasRenderingContext2D | null,
  Pix_size: number
) {
  if (!ctx) return;
  let centerXy = { x: gridEl.x + Pix_size / 2, y: gridEl.y + Pix_size / 2 };
  // Move Pix_size / 2 in the direction of gridEl.angle
  let angleXy = {
    x: centerXy.x + (Pix_size / 4) * Math.cos(gridEl.angle),
    y: centerXy.y + (Pix_size / 4) * Math.sin(gridEl.angle),
  };
  drawDot(centerXy.x, centerXy.y, ctx);
  ctx.beginPath();
  ctx.moveTo(centerXy.x, centerXy.y);
  ctx.lineTo(angleXy.x, angleXy.y);
  ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
export function drawDot(
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D | null
) {
  if (!ctx) return;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}
