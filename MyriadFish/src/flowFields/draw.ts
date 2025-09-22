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

export function drawCurve(
  ctx: CanvasRenderingContext2D | null,
  gridRef: React.RefObject<GridEl[][]>,
  leftRight: React.RefObject<{ leftX: number; rightX: number }>,
  topBottom: React.RefObject<{ topY: number; bottomY: number }>,
  colorValues: { h: number; s: number; l: number },
  Pix_size: number
) {
  if (!ctx || !gridRef.current.length) return;

  // Starting point
  let x =
    leftRight.current.leftX +
    Math.random() * (leftRight.current.rightX - leftRight.current.leftX);
  let y =
    topBottom.current.topY +
    Math.random() * (topBottom.current.bottomY - topBottom.current.topY);

  const num_steps = 100;
  const step_length = Math.floor(Math.random() * 5);
  const grid = gridRef.current;

  let color = colorPick(100, 900, step_length * num_steps, colorValues);

  // Begin curve
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.moveTo(x, y);

  for (let i = 0; i < num_steps; i++) {
    // Draw vertex (line to current position)
    ctx.lineTo(x, y);

    // Calculate grid indices allowing us to get the GridEl of the current position
    const column_index = Math.floor((x - leftRight.current.leftX) / Pix_size);
    const row_index = Math.floor((y - topBottom.current.topY) / Pix_size);

    // Check bounds
    if (
      column_index < 0 ||
      column_index >= grid.length ||
      row_index < 0 ||
      row_index >= grid[0].length
    ) {
      break;
    }

    // Get angle from grid
    // Calculate step based on angle and apply to its current position
    const grid_angle = grid[column_index][row_index].angle;
    const x_step = step_length * Math.cos(grid_angle);
    const y_step = step_length * Math.sin(grid_angle);

    // Update position
    x = x + x_step;
    y = y + y_step;
  }

  // End curve
  ctx.stroke();
}

export function colorPick(
  min_length: number,
  max_length: number,
  current_length: number,
  colorValues: { h: number; s: number; l: number }
) {
  // Normalize current_length to a value between 0 and 1
  const normalized = Math.max(
    0,
    Math.min(1, (current_length - min_length) / (max_length - min_length))
  );

  // Use normalized value to adjust the original lightness
  const adjustedLightness = colorValues.l * normalized;

  return `hsl(${colorValues.h}, ${colorValues.s}%, ${adjustedLightness}%)`;
}
