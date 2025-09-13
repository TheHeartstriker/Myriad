import Poly from "./assets/poly.tsx";
import "./App.css";
import { useEffect, useRef } from "react";
function App() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentPolyRef = useRef<SVGSVGElement | null>(null);
  const otherPolyRef = useRef<SVGSVGElement | null[]>([]);

  function mouseMove(e: MouseEvent) {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    currentPolyRef.current = document.elementFromPoint(
      mouseRef.current.x,
      mouseRef.current.y
    ) as SVGSVGElement;
    console.log(currentPolyRef.current);
  }

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <div className="poly-container">
      <Poly />
    </div>
  );
}

export default App;
