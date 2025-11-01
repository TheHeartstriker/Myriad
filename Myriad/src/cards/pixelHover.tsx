import { useEffect, useRef, useState } from "react";
import type { GridEl } from "../flowFields/types";
function PixelHover() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const gridRef = useRef<GridEl[][]>([]);
  const [pixSize, setPixSize] = useState<number>(window.innerWidth * 0.003);
  const parentRectRef = useRef<DOMRect | null>(null);
  const rowRef = useRef<number>(0);
  const frameId = useRef<number>(0);
  const colRef = useRef<number>(0);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    setCtx(context);
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      //Update the canvas resolution to match parent size
      const parentRect = parent.getBoundingClientRect();
      parentRectRef.current = parentRect;
      canvas.width = parentRect.width;
      canvas.height = parentRect.height;
      //Update pixel size based on window size
      if (window.innerWidth <= 1250) {
        setPixSize(window.innerWidth * 0.005);
      } else {
        setPixSize(window.innerWidth * 0.003);
      }
      //Set canvas stuff
      setCtx(canvas.getContext("2d"));
      Impose();
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
  function Impose() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rows = Math.floor(canvas.height / pixSize);
    const cols = Math.floor(canvas.width / pixSize);
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
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(x, y, pixSize, pixSize);
    ctx.globalAlpha = 1.0; // Reset alpha
  }

  function render() {
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !gridRef.current || !gridRef.current.length) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridRef.current.length; i++) {
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

    // Get collumn and row location of the mouse's x and y
    let col = Math.floor(mousePosRef.current.x / pixSize);
    let row = Math.floor(mousePosRef.current.y / pixSize);

    // Defining are var's
    let radius = 40; //How large the effect circle is in cells
    const minChange = 0.05; // How little we can increase opacity
    const maxChange = 0.1; // How much we can increase opacity

    //Iterate over effect are and apply effects
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const distance = Math.sqrt(i * i + j * j);
        if (distance <= radius && Math.random() < 0.5) {
          const curCol = col + i;
          const curRow = row + j;
          if (
            curCol >= 0 &&
            curCol < colRef.current &&
            curRow >= 0 &&
            curRow < rowRef.current
          ) {
            // 1 at center -> 0 at edge
            const normDis = 1 - distance / radius;
            // Map to [minChange..maxChange]
            const change = minChange + (maxChange - minChange) * normDis;

            gridRef.current[curRow][curCol].opacity = Math.min(
              1.0,
              gridRef.current[curRow][curCol].opacity + change
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
    const rect = parentRectRef.current;
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    mousePosRef.current.x = mouseX;
    mousePosRef.current.y = mouseY;
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
