import Poly from "./assets/poly.tsx";
import "./App.css";
import { useEffect, useRef } from "react";
import type { IdValue } from "./types";
import { darkenDistance, darkenColorDistance } from "./color/colorType.tsx";
import { rgbToHsl } from "./color/colorChange.tsx";

function App() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const otherPolyRef = useRef<IdValue[]>([]);

  function mouseMove(e: MouseEvent) {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;

    for (const i of otherPolyRef.current) {
      updateDistances(i);
      darkenDistance(i, 1000, [0.3, 0.7]);
      //darkenColorDistance(i, 1000, [0.2, 0.8]);
    }
  }
  //Loops and saves the intial distance, color and id of each poly
  function fillPoly() {
    let amount = 109;
    for (let i = 1; i < amount; i++) {
      let poly: IdValue = {
        id: "",
        distanceToMouse: 0,
        color: [0, 0, 0],
        elCenter: new DOMRect(),
      };
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
      // el.style.stroke = "black";
      poly["color"] = hslColor ?? [0, 0, 0];
      //Saving center
      poly["elCenter"] = elXY;
      //push to array
      otherPolyRef.current.push(poly);
    }
  }

  function updateCenter() {
    for (const i of otherPolyRef.current) {
      let elXY = document.getElementById(i.id)?.getBoundingClientRect();
      if (!elXY) return;
      i.elCenter = elXY;
    }
  }
  //updates distance to mouse
  function updateDistances(i: IdValue) {
    let elXY = i.elCenter;
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
    window.addEventListener("resize", updateCenter);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("resize", updateCenter);
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
