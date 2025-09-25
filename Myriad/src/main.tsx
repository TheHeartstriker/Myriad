import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FlowField from "./flowFields/main.tsx";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlowField />
  </StrictMode>
);
