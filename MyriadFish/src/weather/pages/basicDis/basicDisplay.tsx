import type { WeatherData } from "../../types";
import "./basicDisplay.css";

function BasicDisplay({ weather }: { weather: WeatherData | null }) {
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
