import { useEffect, useState, useRef } from "react";
import "./main.css";
function MultCircle() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const points = useRef<number[][]>([]);
  const multValue = useRef<number>(2);
  const frameId = useRef<number | null>(null);
  const colorRange = useRef<{ min: number; max: number }>({
    min: 190,
    max: 230,
  });
  const maxMinLength = useRef<number[]>([0, 0]);
  const radius = useRef<number>(500);
  const pointsCount = useRef<number>(150);

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

  function drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    hue: number
  ) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.stroke();
  }

  function maxMinLineLength() {
    if (!ctx || !canvasRef.current) return;
    maxMinLength.current[1] = radius.current * 2;
    maxMinLength.current[0] =
      2 * radius.current * Math.sin(Math.PI / pointsCount.current);
  }

  //Turn length into color hue
  // Map the length to a hue value
  function lengthToHue(length: number): number {
    const minLength = maxMinLength.current[0];
    const maxLength = maxMinLength.current[1];
    const hueRange = colorRange.current.max - colorRange.current.min;
    const normalizedLength = (length - minLength) / (maxLength - minLength);
    return Math.round(colorRange.current.min + normalizedLength * hueRange);
  }

  function createCirclePoints(radius: number, count: number) {
    if (!canvasRef.current) return;
    points.current = [];
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.current.push([x, y]);
    }
  }

  function renderFrame() {
    if (!canvasRef.current || !ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    multValue.current = multValue.current += 0.005;
    const len = points.current.length;
    for (let i = 0; i < len; i++) {
      //I represents the points value
      const jump: number = Math.floor((multValue.current * i) % len);
      const [x1, y1] = points.current[i];
      const [x2, y2] = points.current[jump];
      const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      drawLine(x1, y1, x2, y2, lengthToHue(lineLength));
    }
  }

  useEffect(() => {
    if (!ctx || !canvasRef.current) return;
    createCirclePoints(radius.current, pointsCount.current);
    maxMinLineLength();
    //Render
    function animate() {
      frameId.current = requestAnimationFrame(animate);
      renderFrame();
    }
    animate();
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [ctx]);

  return <canvas ref={canvasRef} className="mult-circle-canvas"></canvas>;
}

export default MultCircle;
