import { http } from "services/http";
import { WeatherResponseDto, ExchangeRateResponseDto } from "types";

export const getCurrentWeather = (city: string) => {
  return http.get<WeatherResponseDto>(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_KEY}`);
};

export const getExchangeRate = () => {
  return http.get<ExchangeRateResponseDto>("https://www.cbr-xml-daily.ru/daily_json.js")
}