import "./WeatherCard.css";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { useContext } from "react";

// The WeatherCard component displays temperature in Fahrenheit.
const WeatherCard = ({ weatherData }) => {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  return (
    <div className="weather-card">
      {weatherData.temperature[currentTemperatureUnit]}
    </div>
  );
};

export default WeatherCard;
