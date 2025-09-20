import { useEffect, useState, useRef } from "react";
import type { GridEl } from "./types";
import { drawSquare, angleDraw } from "./draw";

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const colorValues = { h: 200, s: 100, l: 50 };
  const gridRef = useRef<GridEl[][]>([]);
  const rowRef = useRef(0);
  const colRef = useRef(0);
  const Pix_size = 25;

  const leftRight = useRef({
    leftX: window.innerWidth * -0.25,
    rightX: window.innerWidth * 1.25,
  });
  const topBottom = useRef({
    topY: window.innerHeight * -0.25,
    bottomY: window.innerHeight * 1.25,
  });
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    setCtx(context);
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCtx(canvas.getContext("2d"));
      Impose();
    };
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function render() {
    if (!ctx || !gridRef.current.length) return;
    const grid = gridRef.current;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        //drawSquare(cell.x, cell.y, ctx, Pix_size);
        //angleDraw(cell, ctx, Pix_size);
        drawCurve();
      }
    }
  }

  function drawCurve() {
    if (!ctx || !gridRef.current.length) return;

    // Starting point
    let x =
      leftRight.current.leftX +
      Math.random() * (leftRight.current.rightX - leftRight.current.leftX);
    let y =
      topBottom.current.topY +
      Math.random() * (topBottom.current.bottomY - topBottom.current.topY);

    const num_steps = 100;
    const step_length = Math.floor(Math.random() * 10);
    const grid = gridRef.current;

    let color = colorPick(100, 900, step_length * num_steps);

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

  function colorPick(
    min_length: number,
    max_length: number,
    current_length: number
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

  function create2DArray(
    Rows: number,
    Cols: number,
    leftX: number,
    topY: number
  ): GridEl[][] {
    let arr = new Array(Rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(Cols);
      let test = 1;
      if (i > Rows / 2) {
        test = -1;
      }
      for (let j = 0; j < arr[i].length; j++) {
        const angle = (j / Rows) * Math.PI * test;
        arr[i][j] = {
          angle: angle,
          x: leftX + i * Pix_size,
          y: topY + j * Pix_size,
        };
      }
    }
    return arr;
  }

  //Defines the number of rows and columns based on the window size
  function Impose() {
    const rows = Math.floor(
      (leftRight.current.rightX - leftRight.current.leftX) / Pix_size
    );
    const cols = Math.floor(
      (topBottom.current.bottomY - topBottom.current.topY) / Pix_size
    );
    rowRef.current = rows;
    colRef.current = cols;
    // Creates the grid based on the number of rows and columns
    let initialGrid = create2DArray(
      rows,
      cols,
      leftRight.current.leftX,
      topBottom.current.topY
    );
    gridRef.current = initialGrid;
  }

  useEffect(() => {
    Impose();
    render();
  }, [ctx]);

  // useEffect(() => {
  //   const animate = () => {
  //     render();
  //     animationIdRef.current = requestAnimationFrame(animate);
  //   };
  //   animate();
  //   return () => {
  //     if (animationIdRef.current) {
  //       cancelAnimationFrame(animationIdRef.current);
  //     }
  //   };
  // }, [ctx]);

  return <canvas className="myCanvas" ref={canvasRef}></canvas>;
}

export default FlowField;
