import { useEffect, useState, useRef } from "react";
import type { GridEl } from "./types";
import { drawSquare, angleDraw, drawCurve, getSectorColor } from "./draw";
import { perlin2D } from "./angleMath";

function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const colorValues = { h: 200, s: 0, l: 77 };
  const colorValues2 = {
    color1: { h: 0, s: 80, l: 55 }, // Vibrant red
    color2: { h: 20, s: 85, l: 55 }, // Orange-red
    color3: { h: 35, s: 90, l: 55 }, // Orange
    color4: { h: 45, s: 90, l: 60 }, // Yellow-orange
    color5: { h: 50, s: 90, l: 65 }, // Gold
  };
  const gridRef = useRef<GridEl[][]>([]);
  const rowRef = useRef(0);
  const colRef = useRef(0);
  const Pix_size = 15;
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
    drawCurve(ctx, gridRef, leftRight, topBottom, colorValues, Pix_size, true);

    // for (let i = 0; i < rowRef.current; i++) {
    //   for (let j = 0; j < colRef.current; j++) {
    //     drawSquare(
    //       gridRef.current[i][j].x,
    //       gridRef.current[i][j].y,
    //       ctx,
    //       Pix_size
    //     );
    //     angleDraw(gridRef.current[i][j], ctx, Pix_size);
    //   }
    // }
  }

  const seed = Math.random() * 1000;
  const scale = 0.01; // Try 0.05 to 0.2 for different smoothness

  function create2DArray(
    Rows: number,
    Cols: number,
    leftX: number,
    topY: number
  ): GridEl[][] {
    let arr = new Array(Rows); //Create array of empty rows
    console.log(arr);

    let sectorSize = Rows / 5;
    for (let i = 0; i < arr.length; i++) {
      //Index into row and create empty columns
      arr[i] = new Array(Cols);
      //Iterate over the empty columns in the row
      for (let j = 0; j < arr[i].length; j++) {
        //let color = getSectorColor(sectorSize, j, colorValues2);
        const angle = perlin2D(i * scale, j * scale) * Math.PI * 2;
        arr[i][j] = {
          angle: angle,
          x: leftX + i * Pix_size,
          y: topY + j * Pix_size,
          //color: color,
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

  useEffect(() => {
    const animate = () => {
      render();
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [ctx]);

  return <canvas className="myCanvas" ref={canvasRef}></canvas>;
}

export default FlowField;
