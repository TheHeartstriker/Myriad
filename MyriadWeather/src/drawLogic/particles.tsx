import { useEffect, useState, useRef } from "react";
import type { PixelDict, PixelImage } from "../types";

function PixelToSymbol({ imageArr }: { imageArr: PixelImage[] }) {
  //All the locations inside the image
  const imageArrRef = useRef(imageArr);
  // All the pixels
  const pixelArrRef = useRef<PixelDict[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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
  }, [canvasRef]);

  function drawSquare(x: number, y: number, size: number) {
    if (!ctx) return;
    ctx.fillStyle = `rgba(${x}, ${y}, 0, 1)`;
    ctx.fillRect(x, y, size, size);
  }

  function initParticles() {
    if (!ctx || !imageArrRef.current) return;
    for (let i = 0; i < 100; i++) {
      let index: number = Math.floor(
        Math.random() * imageArrRef.current.length
      );
      let temp: PixelDict = {
        location: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
        target: {
          x: imageArrRef.current[index].x,
          y: imageArrRef.current[index].y,
        },
      };
      drawSquare(temp.target.x, temp.target.y, 5);
      pixelArrRef.current.push(temp);
    }
  }

  useEffect(() => {
    if (!imageArr || imageArr.length === 0) return;
    imageArrRef.current = imageArr;
    initParticles();
  }, [imageArr]);

  return <canvas className="main-canvas" ref={canvasRef}></canvas>;
}

export default PixelToSymbol;
