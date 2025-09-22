import { useEffect, useState, useRef } from "react";
import type { GridEl } from "./types";
import { drawSquare, angleDraw, drawCurve, colorPick } from "./draw";
import { perlinAngle, perlin2D } from "./angleMath";

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const colorValues = { h: 0, s: 100, l: 50 };
  const gridRef = useRef<GridEl[][]>([]);
  const rowRef = useRef(0);
  const colRef = useRef(0);
  const Pix_size = 20;
  //Lower the more curve and space for them to form
  //Higher the less chance for curves to form

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
    for (let i = 0; i < 50000; i++) {
      drawCurve(ctx, gridRef, leftRight, topBottom, colorValues, Pix_size);
    }
  }

  function create2DArray(
    Rows: number,
    Cols: number,
    leftX: number,
    topY: number
  ): GridEl[][] {
    let arr = new Array(Rows);
    //Row
    const seed = Math.random() * 1000;
    const scale = 0.01; // Try 0.05 to 0.2 for different smoothness
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(Cols);
      for (let j = 0; j < arr[i].length; j++) {
        const angle = perlin2D(i * scale, j * scale) * Math.PI * 2;
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
