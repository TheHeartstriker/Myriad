import { getWeatherAsync } from "../../services/weather";
import { useEffect, useState } from "react";
import type { WeatherData } from "../../types";
import "./basicDisplay.css";

function BasicDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getWeatherAsync();
      setWeather(data);
    };
    fetchWeather();
  }, []);

  return (
    <div className="basic-display">
      {weather ? (
        <>
          <p>Temperature: {weather.temp}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Pressure: {weather.pressure} hPa</p>
        </>
      ) : null}
    </div>
  );
}

export default BasicDisplay;
