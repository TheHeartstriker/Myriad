import { Vector } from "../helper/Vector";
import type { LifePoint } from "../types/Types";
export function drawOutline(points: Vector[], ctx: CanvasRenderingContext2D) {
  if (!ctx || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}

export function drawPoints(points: Vector[], ctx: CanvasRenderingContext2D) {
  if (!ctx || points.length < 1) return;
  ctx.fillStyle = "red";
  for (let i = points.length - 1; i >= 0; i--) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawRadiusOutline(
  mainP: LifePoint[],
  ctx: CanvasRenderingContext2D
) {
  if (!ctx) return;
  for (let i = mainP.length - 1; i >= 0; i--) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(
      mainP[i].position.x,
      mainP[i].position.y,
      mainP[i].radius,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
}

export function drawFullForm(points: Vector[], ctx: CanvasRenderingContext2D) {
  if (!ctx || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = points.length - 1; i >= 0; i--) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = `rgb(53, 125, 165)`; // Fill with DodgerBlue color
  ctx.fill();
  ctx.strokeStyle = "white"; // Draw white outline
  ctx.lineWidth = 2; // Optional: make the outline thicker
  ctx.stroke();
}
