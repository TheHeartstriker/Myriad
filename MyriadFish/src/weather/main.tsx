// import { StrictMode, useState, useEffect } from "react";
// import { createRoot } from "react-dom/client";
// import DrawSymbol from "../../../MyriadWeather/src/pages/symbol/drawsymbol";
// import BasicDisplay from "../../../MyriadWeather/src/pages/basicDis/basicDisplay";
// import { getWeatherAsync } from "../../../MyriadWeather/src/services/weather";
// import type { WeatherData } from "../../../MyriadWeather/src/types";

// function App() {
//   const [weather, setWeather] = useState<WeatherData | null>(null);

//   useEffect(() => {
//     async function fetchWeather() {
//       const weatherData = await getWeatherAsync();
//       setWeather(weatherData);
//     }
//     fetchWeather();
//   }, []);

//   return (
//     <>
//       <BasicDisplay weather={weather} />
//       <DrawSymbol weather={weather} />
//     </>
//   );
// }

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
