import "./Main.css";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import ItemCard from "../ItemCard/ItemCard";
import WeatherCard from "../WeatherCard/WeatherCard";
import { useContext } from "react";

const Main = ({ weatherData, cards, onCardClick, onLikeClick }) => {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  return (
    <main className="main">
      <WeatherCard weatherData={weatherData} />
      <section className="main__clothes">
        <div className="main__info">
          <div className="main__description-container">
            <p className="main__description">
              Today is {weatherData.temperature[currentTemperatureUnit]} and it
              is {weatherData.type}
            </p>
            <p className="main__description_slash"> / </p>
            <p className="main__description">You may want to wear:</p>
          </div>
        </div>
        <ul className="main__items">
          {cards &&
            cards
              .filter((card) => card.weather === weatherData.type)
              .map((filteredCard) => (
                <ItemCard
                  key={filteredCard._id}
                  card={filteredCard}
                  onCardClick={onCardClick}
                  onLikeClick={onLikeClick}
                />
              ))}
        </ul>
      </section>
    </main>
  );
};

export default Main;
