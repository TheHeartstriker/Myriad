import { useEffect, useState, useRef } from "react";
import type { PixelDict, PixelImage, ColorData } from "../../types";

function PixelToSymbol({
  imageArr,
  color,
}: {
  imageArr: PixelImage[];
  color: ColorData | false;
}) {
  //All the locations inside the image
  const imageArrRef = useRef(imageArr);
  // All the pixels
  const pixelArrRef = useRef<PixelDict[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const colorRef = useRef<ColorData | false>(color);
  const currentColor = useRef<ColorData>({ r: 255, g: 255, b: 255 });
  const transitionSpeed = 0.0001;
  //Init canvas
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
  //Draw pixel function
  // If we dont have weather data we draw white when we do when transition to the target color
  function drawSquare(x: number, y: number, size: number) {
    if (!ctx) return;
    incrementWhiteToColor();

    ctx.fillStyle = `rgba(${Math.round(currentColor.current.r)}, ${Math.round(
      currentColor.current.g
    )}, ${Math.round(currentColor.current.b)}, 1)`;
    ctx.fillRect(x, y, size, size);
  }
  //Increment color towards target color
  function incrementWhiteToColor() {
    if (!colorRef.current) return;
    // Transition to target color
    const target = colorRef.current;
    currentColor.current.r +=
      (target.r - currentColor.current.r) * transitionSpeed;
    currentColor.current.g +=
      (target.g - currentColor.current.g) * transitionSpeed;
    currentColor.current.b +=
      (target.b - currentColor.current.b) * transitionSpeed;
  }
  //Initialize particles
  function initParticles() {
    if (!ctx || !imageArrRef.current) return;
    for (let i = 0; i < 750; i++) {
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
  //Update particles
  function updateParticles() {
    for (const pixel of pixelArrRef.current) {
      let euclideanDistance = Math.sqrt(
        Math.pow(pixel.target.x - pixel.location.x, 2) +
          Math.pow(pixel.target.y - pixel.location.y, 2)
      );
      //If the distance is greater than 1, move the pixel towards the target
      if (euclideanDistance > 1) {
        pixel.location.x += (pixel.target.x - pixel.location.x) * 0.04;
        pixel.location.y += (pixel.target.y - pixel.location.y) * 0.04;
      }
      drawSquare(pixel.location.x, pixel.location.y, 2);
    }
  }
  //Render and loop the particles
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
  }, [imageArr, ctx]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  return <canvas className="main-canvas" ref={canvasRef}></canvas>;
}

export default PixelToSymbol;
