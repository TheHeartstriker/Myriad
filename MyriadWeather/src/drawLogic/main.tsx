import { useEffect, useRef, useState } from "react";
import letterA from "../../public/letterATest.png";
import "./canvas.css";

function DrawSymbol() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    img.src = letterA;
    console.log(img.src);
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 100, 100);
      }
    };
  }

  useEffect(() => {
    if (!ctx) return;
    let aniId: number;
    loadImage();
    aniId = requestAnimationFrame(() => {
      //Loop to draw the symbol
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
    return () => {
      cancelAnimationFrame(aniId);
    };
  }, [ctx]);

  return <canvas className="weather-symbol" ref={canvasRef}></canvas>;
}

export default DrawSymbol;
