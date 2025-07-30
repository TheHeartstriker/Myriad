export async function getWeatherAsync() {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(`Latitude: ${lat}, Longitude: ${lon}`);
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=33a3d4f50a1786d28d8dba204504600c`
  );
  const data = await response.json();
  console.log(data.main);
  return data.main;
}
