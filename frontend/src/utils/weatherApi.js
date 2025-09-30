// The utils files contain API fetch and filter methods and the logic for defining temperature
import { handleServerResponse } from "./api";

const getForecastWeather = ({ latitude, longitude }, APIkey) =>
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`
  ).then(handleServerResponse);

// Could be improved: using the request method from api.js:
//
// const getForecastWeather = ({ latitude, longitude }, APIkey) => {
//   return request(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`,
//   );
// };

const filterDataFromWeatherAPI = (data) => {
  if (!data) {
    return null;
  }
  const weather = {};
  weather.city = data.name;
  weather.temperature = {};
  weather.temperature.F = `${Math.round(data.main.temp)}°F`;
  weather.temperature.C = `${Math.round(((data.main.temp - 32) * 5) / 9)}°C`;
  weather.type = getWeatherType(parseInt(weather.temperature.F));
  return weather;
};

const getWeatherType = (temp) => {
  if (temp >= 86) {
    return "hot";
  } else if (temp >= 65 && temp <= 85) {
    return "warm";
  } else if (temp <= 64) {
    return "cold";
  }
};

export { getForecastWeather, filterDataFromWeatherAPI };
