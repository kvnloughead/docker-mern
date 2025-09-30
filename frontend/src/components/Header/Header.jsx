import { Link } from "react-router-dom";
import { useContext } from "react";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import "./Header.css";
import "./Navigation.css";
import logoPath from "../../images/logo.svg";
import avatarDefault from "../../images/avatar-default.png";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const Header = ({
  weatherData,
  handleAddClick,
  handleRegisterClick,
  handleLoginClick,
  isLoggedIn,
}) => {
  const currentUser = useContext(CurrentUserContext);
  if (!currentUser) return null;
  const { name, avatar } = currentUser;
  if (!weatherData) return null;
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/">
          <img src={logoPath} alt="WTWR Logo" className="header__logo" />
        </Link>
        <p className="header__date">
          {currentDate}, {weatherData.city}
        </p>
      </div>
      <nav className="navigation">
        {isLoggedIn ? (
          <ul className="navigation__container">
            <ToggleSwitch />
            <li>
              <button onClick={handleAddClick} className="navigation__button">
                + Add clothes
              </button>
            </li>
            <li>
              <Link to="/profile" className="navigation__link">
                {name}
                {avatar ? (
                  <img
                    className="navigation__user"
                    /** Add user avatar prop and replace this with it */
                    src={avatar || avatarDefault}
                    alt="user avatar"
                  />
                ) : (
                  /** takes name, turns string to uppercase and takes first letter */
                  <span className="navigation__user navigation__user_type_none">
                    {name?.toUpperCase().charAt(0) || ""}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="navigation__container">
            <ToggleSwitch />
            <li>
              <button
                onClick={handleRegisterClick}
                className="navigation__button"
              >
                Sign Up
              </button>
            </li>
            <li>
              <button className="navigation__button" onClick={handleLoginClick}>
                Log In
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
