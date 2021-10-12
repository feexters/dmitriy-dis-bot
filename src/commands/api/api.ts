import { http } from "services/http";
import { WeatherResponseDto } from "types";

export const getCurrentWeather = (city: string) => {
  return http.get<WeatherResponseDto>(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_KEY}`);
};