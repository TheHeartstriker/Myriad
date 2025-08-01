import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import DrawSymbol from "./pages/symbol/main";
import BasicDisplay from "./pages/basicDis/basicDisplay";
import { getWeatherAsync } from "./services/weather";
import type { WeatherData } from "./types";

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    getWeatherAsync().then(setWeather);
  }, []);

  return (
    <>
      <BasicDisplay weather={weather} />
      <DrawSymbol weather={weather} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
