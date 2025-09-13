import Poly from "./assets/poly.tsx";
import "./App.css";
import { useEffect, useRef } from "react";
import type { IdArr } from "./types";
import { darkenDistance, darkenColorDistance } from "./color/colorType.tsx";
import { rgbToHsl } from "./color/colorChange.tsx";

function App() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentPolyRef = useRef<SVGSVGElement | null>(null);
  const otherPolyRef = useRef<IdArr[]>([]);

  function mouseMove(e: MouseEvent) {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    currentPolyRef.current = document.elementFromPoint(
      mouseRef.current.x,
      mouseRef.current.y
    ) as SVGSVGElement;
    for (const i of otherPolyRef.current) {
      updateDistances(i);
      //darkenDistance(i);
      darkenColorDistance(i);
    }
  }
  //Loops and saves the intial distance, color and id of each poly
  function fillPoly() {
    let amount = 109;
    for (let i = 1; i < amount; i++) {
      let poly: IdArr = { id: "", distanceToMouse: 0, color: [0, 0, 0] };
      let el = document.getElementById(`Vector${i}`);
      if (!el) continue;
      //id name
      poly["id"] = `Vector${i}`;
      //distance
      let elXY = el.getBoundingClientRect();
      if (!elXY) continue;
      const centerX = elXY.x + elXY.width / 2;
      const centerY = elXY.y + elXY.height / 2;
      const distance = Math.sqrt(
        (centerX - mouseRef.current.x) ** 2 +
          (centerY - mouseRef.current.y) ** 2
      );
      poly["distanceToMouse"] = distance;
      //saving intial color and change to hsl
      let hslColor = rgbToHsl(window.getComputedStyle(el).fill);
      poly["color"] = hslColor;
      //push to array
      otherPolyRef.current.push(poly);
    }
  }
  //updates distance to mouse
  function updateDistances(i: IdArr) {
    let elXY = document.getElementById(i.id)?.getBoundingClientRect();
    if (!elXY) return;
    const centerX = elXY.x + elXY.width / 2;
    const centerY = elXY.y + elXY.height / 2;
    const distance = Math.sqrt(
      (centerX - mouseRef.current.x) ** 2 + (centerY - mouseRef.current.y) ** 2
    );
    i.distanceToMouse = distance;
  }

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  useEffect(() => {
    if (otherPolyRef.current.length > 0) return;
    fillPoly();
    console.log(otherPolyRef.current);
  }, []);

  return (
    <div className="poly-container">
      <Poly />
    </div>
  );
}

export default App;
