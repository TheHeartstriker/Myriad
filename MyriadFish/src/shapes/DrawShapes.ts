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
  for (let i = 0; i < points.length; i++) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawMainPoints(
  mainP: LifePoint,
  ctx: CanvasRenderingContext2D
) {
  if (!ctx) return;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(
    mainP.position.x,
    mainP.position.y,
    mainP.disConstraint,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}

export function drawFullForm(points: Vector[], ctx: CanvasRenderingContext2D) {
  if (!ctx || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = "lightblue"; // Fill inside with light blue
  ctx.fill();
  ctx.strokeStyle = "white"; // Draw white outline
  ctx.lineWidth = 2; // Optional: make the outline thicker
  ctx.stroke();
}
