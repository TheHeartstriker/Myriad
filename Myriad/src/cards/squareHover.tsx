import { useState, useEffect, useRef } from "react";
import type { GridEl } from "../flowFields/types";

function SquareHover() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const Pix_size = 50;
  const gridRef = useRef<GridEl[][]>([]);
  const rowColRef = useRef<{ row: number; col: number }>({ row: 0, col: 0 });
  const frameId = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoveredCellRef = useRef<{ row: number; col: number } | null>(null);

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      // Get the parent container's dimensions instead of window
      const parent = canvas.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const cols = Math.floor(parentRect.width / Pix_size);
      const rows = Math.floor(parentRect.height / Pix_size);

      canvas.width = cols * Pix_size;
      canvas.height = rows * Pix_size;

      const context = canvas.getContext("2d");
      setCtx(context);
      Impose();
    };

    // Initial setup
    updateCanvasSize();

    const resizeCanvas = () => {
      updateCanvasSize();
    };

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
    let arr = new Array(Rows);
    for (let i = 0; i < Rows; i++) {
      arr[i] = new Array(Cols);
      for (let j = 0; j < Cols; j++) {
        arr[i][j] = {
          opacity: 0.2,
          x: leftX + j * Pix_size,
          y: topY + i * Pix_size,
          color: "#b51a2b",
        };
      }
    }
    return arr;
  }

  //Defines the number of rows and columns based on the window size
  function Impose() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rows = Math.floor(canvas.height / Pix_size);
    const cols = Math.floor(canvas.width / Pix_size);

    rowColRef.current = { row: rows, col: cols };
    // Creates the grid based on the number of rows and columns
    let initialGrid = create2DArray(
      rows,
      cols,
      0, // leftX starts at 0
      0 // topY starts at 0
    );
    gridRef.current = initialGrid;
  }

  function drawSquare(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D | null,
    Pix_size: number,
    color: string = "#ae00ff",
    fillColor: string | null = null
  ) {
    if (!ctx) return;
    ctx.strokeStyle = `${color}`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x, y, Pix_size, Pix_size);
    if (fillColor) {
      ctx.fillStyle = `${fillColor}`;
      ctx.fill();
    }
    ctx.stroke();
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
      drawSquare(
        gridRef.current[hovRow][hovCol].x,
        gridRef.current[hovRow][hovCol].y,
        ctx,
        Pix_size,
        gridRef.current[hovRow][hovCol].color,
        `rgba(181, 26, 43, ${gridRef.current[hovRow][hovCol].opacity})`
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
          ctx,
          Pix_size,
          gridRef.current[i][j].color,
          `rgba(181, 26, 43, ${gridRef.current[i][j].opacity})`
        );
      }
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Update mouse position ref
    mousePosRef.current = { x: mouseX, y: mouseY };

    // Check if mouse is within canvas bounds
    if (
      mouseX >= 0 &&
      mouseX <= canvas.width &&
      mouseY >= 0 &&
      mouseY <= canvas.height
    ) {
      // Calculate grid position
      const col = Math.floor(mouseX / Pix_size);
      const row = Math.floor(mouseY / Pix_size);

      // Fill the hovered cell
      if (
        row >= 0 &&
        row < rowColRef.current.row &&
        col >= 0 &&
        col < rowColRef.current.col
      ) {
        hoveredCellRef.current = { row, col };
      }
    }
  }

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    Impose();
  }, [ctx]);

  useEffect(() => {
    function animate() {
      frameId.current = requestAnimationFrame(animate);
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
