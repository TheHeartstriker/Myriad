import { useEffect, useRef, useState } from "react";
import "./canvas.css";
import PixelToSymbol from "./particles";
import { tempToRGB } from "../util";
import type { PixelImage, WeatherData } from "../../types";

function DrawSymbol({ weather }: { weather: WeatherData | null }) {
  const [functionalImageArr, setFunctionalImageArr] = useState<PixelImage[]>(
    []
  );
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  // Initializes the canvas and refresh params
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
    };
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  //Draws the image sets it center and calls loadImage
  function drawImage(size: number) {
    const img: HTMLImageElement = new Image();
    imageRef.current = img;
    imageRef.current.src = "/rain.png";

    imageRef.current.onload = () => {
      if (ctx) {
        // Draw image to the center of the canvas
        const x = (ctx.canvas.width - size) / 2;
        const y = (ctx.canvas.height - size) / 2;
        ctx.drawImage(imageRef.current!, x, y, size, size);
        loadImage(size, x, y);
      }
    };
  }
  // Stores the image data in a functional array
  function loadImage(size: number, x: number, y: number) {
    if (!ctx || !imageRef.current) return;
    // Load array data
    if (functionalImageArr.length === 0) {
      const imageData: number[] = Array.from(
        ctx.getImageData(x, y, size, size).data
      );
      functionalArrayToObject(imageData, x, y, size);
    }
  }

  // Convert large array into array of objects
  //Also discards alpha values of 0
  function functionalArrayToObject(
    arr: number[],
    offsetX: number,
    offsetY: number,
    imgWidth: number
  ) {
    const pixels: PixelImage[] = [];
    let px = 0;
    for (let i = 0; i < arr.length; i += 4) {
      const localX = px % imgWidth;
      const localY = Math.floor(px / imgWidth);
      if (arr[i + 3] !== 0) {
        pixels.push({
          r: arr[i],
          g: arr[i + 1],
          b: arr[i + 2],
          a: arr[i + 3],
          x: localX + offsetX, // relative to canvas
          y: localY + offsetY, // relative to canvas
        });
      }
      px++;
    }
    setFunctionalImageArr(pixels);
  }
  //Draws with a set 500px size
  useEffect(() => {
    if (!ctx) return;
    drawImage(500);
  }, [ctx]);

  return (
    <>
      <canvas className="transparent-canvas" ref={canvasRef}></canvas>
      <PixelToSymbol
        imageArr={functionalImageArr}
        color={weather?.temp ? tempToRGB(weather.temp) : false}
      />
    </>
  );
}

export default DrawSymbol;
