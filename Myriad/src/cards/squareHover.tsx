import { useState, useEffect, useRef } from "react";
import type { GridEl } from "../flowFields/types";

function SquareHover() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pixSize, setPixSize] = useState<number>(50);
  const gridRef = useRef<GridEl[][]>([]);
  const rowColRef = useRef<{ row: number; col: number }>({ row: 0, col: 0 });
  const frameId = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredCellRef = useRef<{ row: number; col: number } | null>(null);
  const parentRectRef = useRef<DOMRect | null>(null);

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    setCtx(context);
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      parentRectRef.current = parentRect;
      //Unique resizing approach making the canvas size exactly match parent size
      const cols = Math.floor(parentRect.width / pixSize);
      const rows = Math.floor(parentRect.height / pixSize);
      canvas.width = cols * pixSize;
      canvas.height = rows * pixSize;
      setCtx(canvas.getContext("2d"));
      Impose(cols, rows);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function create2DArray(
    Rows: number,
    Cols: number,
    leftX: number,
    topY: number
  ): GridEl[][] {
    let arr = new Array(Rows); //Create array of empty rows

    for (let i = 0; i < arr.length; i++) {
      //Index into row and create empty columns
      arr[i] = new Array(Cols);
      //Iterate over the empty columns in the row
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = {
          x: leftX + j * pixSize,
          y: topY + i * pixSize,
          opacity: 0.0,
          color: "#b51a2b",
        };
      }
    }

    return arr;
  }

  //Defines the number of rows and columns based on the window size
  function Impose(col: number = 0, row: number = 0) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    rowColRef.current = { row: row, col: col };
    // Creates the grid based on the number of rows and columns
    let initialGrid = create2DArray(
      row,
      col,
      0, // leftX starts at 0
      0 // topY starts at 0
    );
    gridRef.current = initialGrid;
  }

  function drawSquare(x: number, y: number, color: string, opacity: number) {
    if (!ctx || !gridRef.current.length) return;
    //Fill color square
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(x, y, pixSize, pixSize);
    //Border color square
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, pixSize, pixSize);
  }

  function render() {
    if (!ctx || !gridRef.current.length) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let hovCol = hoveredCellRef.current?.col;
    let hovRow = hoveredCellRef.current?.row;
    if (hovCol !== undefined && hovRow !== undefined) {
      gridRef.current[hovRow][hovCol].opacity = clamp(
        gridRef.current[hovRow][hovCol].opacity + 0.05,
        0,
        1
      );
    }
    for (let i = 0; i < rowColRef.current.row; i++) {
      for (let j = 0; j < rowColRef.current.col; j++) {
        if (i !== hovRow || j !== hovCol) {
          gridRef.current[i][j].opacity = clamp(
            gridRef.current[i][j].opacity - 0.01,
            0,
            1
          );
        }
        drawSquare(
          gridRef.current[i][j].x,
          gridRef.current[i][j].y,
          gridRef.current[i][j].color,
          gridRef.current[i][j].opacity
        );
      }
    }
  }

  function MouseEffect() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if mouse is within canvas bounds
    if (
      mousePosRef.current.x >= 0 &&
      mousePosRef.current.x <= canvas.width &&
      mousePosRef.current.y >= 0 &&
      mousePosRef.current.y <= canvas.height
    ) {
      // Calculate grid position
      const col = Math.floor(mousePosRef.current.x / pixSize);
      const row = Math.floor(mousePosRef.current.y / pixSize);

      // Fill the hovered cell
      if (
        row >= 0 &&
        row < rowColRef.current.row &&
        col >= 0 &&
        col < rowColRef.current.col
      ) {
        hoveredCellRef.current = { row, col };
      } else {
        hoveredCellRef.current = null;
      }
    }
  }

  function mouseTracker(e: MouseEvent) {
    const rect = parentRectRef.current;
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    mousePosRef.current.x = mouseX;
    mousePosRef.current.y = mouseY;
  }
  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", mouseTracker);

    return () => {
      parent.removeEventListener("mousemove", mouseTracker);
    };
  }, []);

  useEffect(() => {
    function animate() {
      frameId.current = requestAnimationFrame(animate);
      MouseEffect();
      render();
    }
    animate();
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [ctx]);

  return <canvas className="card-canvas" ref={canvasRef}></canvas>;
}

export default SquareHover;
