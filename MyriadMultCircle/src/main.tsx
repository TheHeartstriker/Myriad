import { createRoot } from "react-dom/client";
import MultCircle from "./multCircle";
import { StrictMode } from "react";

function App() {
  return (
    <>
      <StrictMode>
        <MultCircle />
      </StrictMode>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
