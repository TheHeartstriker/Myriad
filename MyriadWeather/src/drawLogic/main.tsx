import { useEffect, useRef, useState } from "react";
import "./canvas.css";

function DrawSymbol() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const functionalImageArr = useRef<
    { r: number; g: number; b: number; a: number; x: number; y: number }[]
  >([]);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // Creates a refrence to current canvas
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Gets the context of the canvas
    const context = canvas.getContext("2d");
    setCtx(context);
    // Function to resize the canvas
    const resizeCanvas = () => {
      // The resize
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCtx(canvas.getContext("2d"));
    };
    // Event listener where the resizeCanvas function is called
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function loadImage() {
    const img: HTMLImageElement = new Image();
    img.src = "/letterATest.png";
    img.onload = () => {
      if (ctx) {
        // Draw image to the center of the canvas
        const x: number = (ctx.canvas.width - img.width) / 2;
        const y: number = (ctx.canvas.height - img.height) / 2;
        ctx.drawImage(img, x, y);
        // Load array data
        if (functionalImageArr.current.length === 0) {
          const imageData: number[] = Array.from(
            ctx.getImageData(x, y, img.width, img.height).data
          );
          functionalArrayToObject(imageData, x, y, img.width);
        }
      }
    };
  }
  // Shrink to a functional array of objects
  function functionalArrayToObject(
    arr: number[],
    offsetX: number,
    offsetY: number,
    imgWidth: number
  ) {
    const pixels: {
      r: number;
      g: number;
      b: number;
      a: number;
      x: number;
      y: number;
    }[] = [];
    let px = 0;
    for (let i = 0; i < arr.length; i += 4) {
      const localX = px % imgWidth;
      const localY = Math.floor(px / imgWidth);
      pixels.push({
        r: arr[i],
        g: arr[i + 1],
        b: arr[i + 2],
        a: arr[i + 3],
        x: localX + offsetX, // relative to canvas
        y: localY + offsetY, // relative to canvas
      });
      px++;
    }
    functionalImageArr.current = pixels;
  }

  function drawPixel(x: number, y: number) {
    if (!ctx) return;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 4, 4);
  }

  function drawRandom() {
    for (let i = 0; i < 100; i++) {
      let random: number = Math.floor(
        Math.random() * functionalImageArr.current.length
      );
      let currentPixel = functionalImageArr.current[random];
      if (currentPixel.r > 0 || currentPixel.g > 0 || currentPixel.b > 0) {
        drawPixel(currentPixel.x, currentPixel.y);
      }
    }
  }

  useEffect(() => {
    if (!ctx) return;
    loadImage();
    let aniId: number;
    aniId = requestAnimationFrame(() => {});
    return () => {
      cancelAnimationFrame(aniId);
    };
  }, [ctx]);

  useEffect(() => {
    if (functionalImageArr.current.length !== 0) {
      drawRandom();
    }
  }, [functionalImageArr.current]);

  return (
    <>
      <canvas className="transparent-canvas" ref={canvasRef}></canvas>
      {/* <canvas className="main-canvas" ref={canvasRef}></canvas> */}
    </>
  );
}

export default DrawSymbol;
