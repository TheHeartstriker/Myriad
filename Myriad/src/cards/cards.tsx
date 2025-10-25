import "./cards.css";
import { useRef } from "react";
import { simpleHoverMouseMove } from "./basicGlow";
import PixelHover from "./pixelHover.tsx";
import SquareHover from "./squareHover.tsx";

function Cards() {
  const cardRef1 = useRef<HTMLElement>(null);
  const cardRef2 = useRef<HTMLElement>(null);
  const cardRef3 = useRef<HTMLElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="card-container"
      ref={containerRef}
      onMouseMove={(e) => simpleHoverMouseMove(e, cardRef1)}
    >
      {/* Card 1 */}
      <section className="card card1" ref={cardRef1}>
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
      {/* Card 2 */}
      <section className="card card2" ref={cardRef2}>
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
      {/* Card 3 */}
      <section className="card card3" ref={cardRef3}>
        <SquareHover />
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
