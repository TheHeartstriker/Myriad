import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Vector } from "./Vector.ts";

type LifePoint = {
  position: Vector;
  disConstraint: number;
};

const conShape = [20, 24, 28, 32, 32, 32, 28, 24, 20, 16, 12];

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const testVec = useRef<LifePoint[]>([]); // Array of main center points
  const drawVec = useRef<Vector[]>([]); // Array of points to draw the shape
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameId = useRef<number | null>(null);
  const mousePos = useRef<Vector>(new Vector(0, 0));

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

  function drawPoint(v: LifePoint) {
    if (!ctx) return;
    // Draw the center point
    ctx.beginPath();
    ctx.arc(v.position.x, v.position.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    // Draw the outline
    ctx.beginPath();
    ctx.arc(v.position.x, v.position.y, v.disConstraint, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  function drawShape(points: Vector[]) {
    if (!ctx || points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  //Check the constraint and move the points if they are too far apart
  function constrainCheck(i: number) {
    if (!ctx) return;
    const v1 = testVec.current[i].position;
    const v2 = testVec.current[i + 1].position;
    const disConstraint = testVec.current[i].disConstraint;
    const dist = Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
    if (dist > disConstraint) {
      const diff = dist - disConstraint;
      const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
      const moveX = Math.cos(angle) * diff;
      const moveY = Math.sin(angle) * diff;
      v1.x += moveX / 1.1;
      v1.y += moveY / 1.1;
      v2.x -= moveX / 1.1;
      v2.y -= moveY / 1.1;
    }
  }

  function init() {
    testVec.current = [];
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const spacing = 15;
    for (let i = 0; i < conShape.length; i++) {
      const pos = new Vector(startX, startY + i * spacing);
      const disConstraint = conShape[i];
      testVec.current.push({ position: pos, disConstraint: disConstraint });
    }
  }
  //Create a array of point across the circles to the left and right
  function createDrawArr(
    i: number,
    leftPoints: Vector[] = [],
    rightPoints: Vector[] = []
  ) {
    if (!ctx) return;
    if (i >= testVec.current.length - 1) return;

    const current = testVec.current[i];
    const next = testVec.current[i + 1];

    // Direction vector (front)
    const dx = next.position.x - current.position.x;
    const dy = next.position.y - current.position.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;

    // Normalize direction
    const frontX = dx / len;
    const frontY = dy / len;

    // Perpendicular vectors
    const perpLeftX = -frontY;
    const perpLeftY = frontX;
    const perpRightX = frontY;
    const perpRightY = -frontX;

    // Leftmost and rightmost points on the circle
    const left = new Vector(
      current.position.x + perpLeftX * current.disConstraint,
      current.position.y + perpLeftY * current.disConstraint
    );
    const right = new Vector(
      current.position.x + perpRightX * current.disConstraint,
      current.position.y + perpRightY * current.disConstraint
    );

    leftPoints.push(left);
    rightPoints.push(right);
  }

  function render() {
    if (!ctx || !testVec.current.length) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "black";

    testVec.current[0].position.x = mousePos.current.x;
    testVec.current[0].position.y = mousePos.current.y;

    const leftPoints: Vector[] = [];
    const rightPoints: Vector[] = [];
    for (let i = 0; i < testVec.current.length - 1; i++) {
      createDrawArr(i, leftPoints, rightPoints);
      constrainCheck(i);
    }
    drawVec.current = [...leftPoints, ...rightPoints.reverse()];
    drawShape(drawVec.current);
  }

  useEffect(() => {
    init();
    function animate() {
      frameId.current = requestAnimationFrame(animate);
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
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
  }
  useEffect(() => {
    window.addEventListener("mousemove", mouseTracker);
    return () => {
      window.removeEventListener("mousemove", mouseTracker);
    };
  }, []);

  return <canvas className="myCanvas" ref={canvasRef}></canvas>;
}

export default App;
