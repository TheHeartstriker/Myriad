import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DrawSymbol from "./drawLogic/main";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DrawSymbol />
  </StrictMode>
);
