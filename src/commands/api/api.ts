import { http } from "services/http";
import { WeatherResponseDto, ExchangeRateResponseDto } from "types";
const iconv = require("iconv-lite");

export const getCurrentWeather = (city: string) => {
  return http.get<WeatherResponseDto>(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_KEY}`
  );
};

export const getExchangeRate = () => {
  return http.get<ExchangeRateResponseDto>(
    "https://www.cbr-xml-daily.ru/daily_json.js"
  );
};

export const getJoke = (type: number) => {
  return http
    .get<string>(`http://rzhunemogu.ru/RandJSON.aspx?CType=${type}`, {
      responseType: "arraybuffer",
    })
    .then((res) => {
      const encodingData = iconv
        .decode(new Buffer(res.data), "win1251")
        .toString();

      // TODO: try to use JSON.parse - parse error
      const slicedString = encodingData.slice(12, encodingData.length - 2);

      return {
        ...res,
        data: slicedString,
      };
    });
};
