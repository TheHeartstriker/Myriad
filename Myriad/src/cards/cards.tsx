import "./cards.css";
import { useRef } from "react";
// import { basicHandleMouseMove } from "./basicGlow";
import PixelHover from "./pixelHover.tsx";

function Cards() {
  const cardRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="card-container"
      ref={containerRef}
      //   onMouseMove={(e) => basicHandleMouseMove(e, cardRef)}
    >
      <section className="card" ref={cardRef}>
        <PixelHover />
        <h2>
          Beneath the <br /> fading glow
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          blandit nisi ut eros congue, eget placerat sapien lacinia. Suspendisse
          sed justo ut elit volutpat tincidunt. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Curabitur blandit nisi ut eros congue,
          eget placerat sapien lacinia. Suspendisse sed justo ut elit volutpat
          tincidunt.
        </p>
      </section>
    </div>
  );
}
export default Cards;
