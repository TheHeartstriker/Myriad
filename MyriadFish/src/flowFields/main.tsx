import { useEffect, useState, useRef } from "react";

type GridEl = {
  angle: number;
  x: number;
  y: number;
};

type Xy = {
  x: number;
  y: number;
};

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const gridRef = useRef<GridEl[][]>([]);
  const rowRef = useRef(0);
  const colRef = useRef(0);
  const Pix_size = 25;
  const buffer = 100;

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
      drawGrid();
    };
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function drawGrid() {
    if (!ctx || gridRef.current.length === 0) return;

    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent white
    ctx.lineWidth = 1;

    const grid = gridRef.current;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];

        // Only draw cells that are within the canvas bounds
        if (
          cell.x >= 0 - buffer &&
          cell.x <= window.innerWidth + buffer &&
          cell.y >= 0 - buffer &&
          cell.y <= window.innerHeight + buffer
        ) {
          drawSquare(cell.x, cell.y);
          angleDraw(cell);
        }
      }
    }
  }

  function drawDot(x: number, y: number) {
    if (!ctx) return;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSquare(x: number, y: number) {
    if (!ctx) return;
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent white
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x, y, Pix_size, Pix_size);
    ctx.stroke();
  }

  function angleDraw(gridEl: GridEl) {
    if (!ctx) return;
    let centerXy = { x: gridEl.x + Pix_size / 2, y: gridEl.y + Pix_size / 2 };
    // Move Pix_size / 2 in the direction of gridEl.angle
    let angleXy = {
      x: centerXy.x + (Pix_size / 4) * Math.cos(gridEl.angle),
      y: centerXy.y + (Pix_size / 4) * Math.sin(gridEl.angle),
    };
    drawDot(centerXy.x, centerXy.y);
    ctx.beginPath();
    ctx.moveTo(centerXy.x, centerXy.y);
    ctx.lineTo(angleXy.x, angleXy.y);
    ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Creates a 2D array with values of 0
  function create2DArray(Rows: number, Cols: number): GridEl[][] {
    let arr = new Array(Rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(Cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = { angle: 0, x: i * Pix_size, y: j * Pix_size };
      }
    }
    return arr;
  }

  //Defines the number of rows and columns based on the window size
  function Impose() {
    const rows = Math.floor((window.innerWidth + buffer) / Pix_size);
    const cols = Math.floor((window.innerHeight + buffer) / Pix_size);
    rowRef.current = rows;
    colRef.current = cols;
    // Creates the grid based on the number of rows and columns
    let initialGrid = create2DArray(rows, cols);
    gridRef.current = initialGrid;
  }

  useEffect(() => {
    Impose();
    drawGrid();
  }, [ctx]);

  return <canvas className="myCanvas" ref={canvasRef}></canvas>;
}

export default FlowField;
