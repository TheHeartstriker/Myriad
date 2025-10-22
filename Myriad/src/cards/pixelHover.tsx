import { useEffect, useRef, useState } from "react";
import type { GridEl } from "../flowFields/types";
function PixelHover() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const mouseLoc = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const gridRef = useRef<GridEl[][]>([]);
  const Pix_size = 30;
  const rowRef = useRef<number>(0);
  const frameId = useRef<number>(0);
  const colRef = useRef<number>(0);

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

  function create2DArray(
    Rows: number,
    Cols: number,
    leftX: number,
    topY: number
  ): GridEl[][] {
    let arr = new Array(Rows); //Create array of empty rows

    for (let j = 0; j < Cols; j++) {
      arr[j] = new Array(Rows);
      for (let i = 0; i < Rows; i++) {
        arr[j][i] = {
          opacity: 0,
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
    rowRef.current = rows;
    colRef.current = cols;
    // Creates the grid based on the number of rows and columns
    let initialGrid = create2DArray(
      rows,
      cols,
      0, // leftX starts at 0
      0 // topY starts at 0
    );
    gridRef.current = initialGrid;
  }

  function drawSquare(x: number, y: number, color: string, opacity: number) {
    const context = ctx;
    if (!context) return;
    context.fillStyle = color;
    context.globalAlpha = opacity;
    context.fillRect(x, y, Pix_size, Pix_size);
    context.globalAlpha = 1.0; // Reset alpha
  }

  function render() {
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !gridRef.current || !gridRef.current.length) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridRef.current.length; i++) {
      if (!gridRef.current[i] || !gridRef.current[i].length) continue;
      for (let j = 0; j < gridRef.current[i].length; j++) {
        if (gridRef.current[i][j].opacity > 0)
          gridRef.current[i][j].opacity -= 0.05;
        if (gridRef.current[i][j].opacity > 0) {
          drawSquare(
            gridRef.current[i][j].x,
            gridRef.current[i][j].y,
            gridRef.current[i][j].color,
            gridRef.current[i][j].opacity
          );
        }
      }
    }
  }
  function MouseEffect() {
    const canvas = canvasRef.current;
    if (!ctx || !canvas) {
      return;
    }

    const mouseX = mouseLoc.current.x;
    const mouseY = mouseLoc.current.y;
    const rect = canvas.getBoundingClientRect();

    if (
      mouseX < rect.left ||
      mouseX > rect.right ||
      mouseY < rect.top ||
      mouseY > rect.bottom
    ) {
      return;
    }

    // Translate from viewport -> canvas coordinates and account for CSS scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const localX = (mouseX - rect.left) * scaleX;
    const localY = (mouseY - rect.top) * scaleY;

    // Convert to grid indices
    let x = Math.floor(localX / Pix_size);
    let y = Math.floor(localY / Pix_size);

    let radius = 30;
    // Change applied at edge vs. center
    const minChange = 0.05; // at the radius edge
    const maxChange = 0.1; // at the center

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const distance = Math.sqrt(i * i + j * j);
        if (distance <= radius && Math.random() < 0.5) {
          const X = x + i;
          const Y = y + j;
          if (X >= 0 && X < colRef.current && Y >= 0 && Y < rowRef.current) {
            // 1 at center -> 0 at edge
            const normDis = 1 - distance / radius;
            // Map to [minChange..maxChange]
            const change = minChange + (maxChange - minChange) * normDis;

            gridRef.current[X][Y].opacity = Math.min(
              1.0,
              gridRef.current[X][Y].opacity + change
            );
          }
        }
      }
    }
  }
  useEffect(() => {
    Impose();
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

  function mouseTracker(e: MouseEvent) {
    mouseLoc.current.x = e.clientX;
    mouseLoc.current.y = e.clientY;
  }

  useEffect(() => {
    window.addEventListener("mousemove", mouseTracker);
    return () => {
      window.removeEventListener("mousemove", mouseTracker);
    };
  }, []);

  return <canvas className="card-canvas" ref={canvasRef}></canvas>;
}

export default PixelHover;
