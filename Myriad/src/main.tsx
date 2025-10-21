import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Cards from "./cards/cards";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Cards />
  </StrictMode>
);
