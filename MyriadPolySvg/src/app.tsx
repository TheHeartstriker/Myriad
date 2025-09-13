import Poly from "./assets/poly.tsx";
import "./App.css";
import { useEffect, useRef } from "react";

type IdArr = {
  id: string;
  distanceToMouse: number;
};

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
      darkenDistance(i);
    }
  }

  function fillPoly() {
    let amount = 109;
    for (let i = 1; i < amount; i++) {
      //id name
      let poly: IdArr = { id: "", distanceToMouse: 0 };
      poly["id"] = `Vector${i}`;
      //distance
      let elXY = document.getElementById(poly["id"])?.getBoundingClientRect();
      if (!elXY) continue;
      const centerX = elXY.x + elXY.width / 2;
      const centerY = elXY.y + elXY.height / 2;
      const distance = Math.sqrt(
        (centerX - mouseRef.current.x) ** 2 +
          (centerY - mouseRef.current.y) ** 2
      );

      poly["distanceToMouse"] = distance;
      //push to array
      otherPolyRef.current.push(poly);
    }
  }

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

  //The closer the poly is to the mouse, the darker it gets
  function darkenDistance(i: IdArr) {
    let el = document.getElementById(i.id);
    if (!el) return;
    let distance = i.distanceToMouse;
    // Clamp distance to a max value for calculation
    const maxDistance = 1000;
    const minBrightness = 32; // darkest
    const maxBrightness = 200; // lightest
    // Calculate brightness based on distance
    let brightness =
      minBrightness +
      ((maxBrightness - minBrightness) * Math.min(distance, maxDistance)) /
        maxDistance;
    brightness = Math.round(brightness);
    el.style.fill = `rgb(${brightness}, ${brightness}, ${brightness})`;
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
