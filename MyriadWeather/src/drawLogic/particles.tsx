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
    for (let i = 0; i < 500; i++) {
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
      pixelArrRef.current.push(temp);
    }
  }

  function updateParticles() {
    for (const pixel of pixelArrRef.current) {
      let euclideanDistance = Math.sqrt(
        Math.pow(pixel.target.x - pixel.location.x, 2) +
          Math.pow(pixel.target.y - pixel.location.y, 2)
      );
      //If the distance is greater than 1, move the pixel towards the target
      if (euclideanDistance > 1) {
        pixel.location.x += (pixel.target.x - pixel.location.x) * 0.1;
        pixel.location.y += (pixel.target.y - pixel.location.y) * 0.1;
      }
      drawSquare(pixel.location.x, pixel.location.y, 2);
    }
  }

  useEffect(() => {
    if (!imageArr || imageArr.length === 0) return;
    imageArrRef.current = imageArr;
    initParticles();
    const aniId: number = requestAnimationFrame(function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        updateParticles();
      }
      requestAnimationFrame(animate);
    });
    return () => {
      cancelAnimationFrame(aniId);
    };
  }, [imageArr]);

  return <canvas className="main-canvas" ref={canvasRef}></canvas>;
}

export default PixelToSymbol;
