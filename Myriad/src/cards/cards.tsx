import "./cards.css";
import { useRef } from "react";

function Cards() {
  const cardRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate distance from card edges
    const distanceX = Math.max(0, Math.max(-x, x - rect.width));
    const distanceY = Math.max(0, Math.max(-y, y - rect.height));
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Calculate opacity based on distance (fade out over 100px)
    const maxDistance = 100;
    const opacity = Math.max(0, 1 - distance / maxDistance) / 3;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--glow-opacity", opacity.toString());
  };

  return (
    <div
      className="card-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <section className="card" ref={cardRef}>
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
