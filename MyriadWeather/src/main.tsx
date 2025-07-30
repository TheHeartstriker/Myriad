import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DrawSymbol from "./pages/symbol/main";
import BasicDisplay from "./pages/basicDis/basicDisplay";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DrawSymbol />
    <BasicDisplay />
  </StrictMode>
);
