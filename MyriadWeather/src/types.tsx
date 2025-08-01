export type PixelDict = {
  location: { x: number; y: number };
  target: { x: number; y: number };
};

export type PixelImage = {
  r: number;
  g: number;
  b: number;
  a: number;
  x: number;
  y: number;
};

export type WeatherData = {
  temp: number;
  humidity: number;
  pressure: number;
  feelsLike: number;
  grnd_level: number;
  sea_level: number;
  temp_min: number;
  temp_max: number;
};

export type ColorData = {
  r: number;
  g: number;
  b: number;
};
