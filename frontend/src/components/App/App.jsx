import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import Profile from "../Profile/Profile.jsx";
import Footer from "../Footer/Footer.jsx";
import AddItemModal from "../AddItemModal/AddItemModal.jsx";
import ItemModal from "../ItemModal/ItemModal.jsx";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal/DeleteConfirmationModal.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import EditModal from "../EditModal/EditModal.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";

import * as auth from "../../utils/auth.js";
import api from "../../utils/api.js";
import { apiKey, location } from "../../utils/constants.js";
import {
  filterDataFromWeatherAPI,
  getForecastWeather,
} from "../../utils/weatherApi.js";

const App = () => {
  // The initial state of state variables contains the correct data type.
  const [currentUser, setCurrentUser] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [weatherData, setWeatherData] = useState({});
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // isLoggedInLoading is currently optional, but maybe become required in the
  // future. It is used to ensure that, on initial page load, if a user is
  // already logged in they are directed to the correct URL.
  const [isLoggedInLoading, setIsLoggedInLoading] = useState(true);

  const fetchUserInfo = useCallback((token) => {
    auth
      .checkToken(token)
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setCurrentUser(res);
        } else {
          localStorage.removeItem("jwt");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoggedInLoading(false);
      });
  }, []);

  // Fetch user info on page load if JWT already exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      fetchUserInfo(token);
    } else {
      setIsLoggedInLoading(false);
    }
  }, [fetchUserInfo]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleLikeClick = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");
    return isLiked
      ? api
          .removeCardLike(id, token)
          .then((newCard) => {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? newCard : item))
            );
          })
          .catch((err) => console.log(err))
      : api
          .addCardLike(id, token)
          .then((newCard) => {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? newCard : item))
            );
          })
          .catch((err) => console.log(err));
  };

  const closeAllModals = () => {
    setActiveModal("");
  };

  // Optional implementation, instead of separate handlers.
  // const openModal = (modalName) => {
  //   return () => setActiveModal(modalName);
  // };

  const openAddItemModal = () => {
    setActiveModal("create");
  };

  const openRegistrationModal = () => {
    setActiveModal("register");
  };

  const openLoginModal = () => {
    setActiveModal("login");
  };

  const openEditProfileModal = () => {
    setActiveModal("edit");
  };

  const handleToggleSwitchChange = () => {
    currentTemperatureUnit === "F"
      ? setCurrentTemperatureUnit("C")
      : setCurrentTemperatureUnit("F");
  };

  const handleAddItemSubmit = (item, resetForm) => {
    api
      .addItem(item, localStorage.getItem("jwt"))
      .then((newItem) => {
        setClothingItems([newItem, ...clothingItems]);
        closeAllModals();
        resetForm();
      })
      .catch(console.error);
  };

  const openDeleteConfirmationModal = (card) => {
    setActiveModal("delete-confirmation");
    setCardToDelete(card);
  };

  const handleCardDelete = () => {
    api
      .removeItem(cardToDelete._id, localStorage.getItem("jwt"))
      .then(() => {
        setClothingItems((cards) =>
          cards.filter((c) => c._id !== cardToDelete._id)
        );
        setCardToDelete(null);
        closeAllModals();
      })
      .catch(console.error);
  };

  // The App component makes an API request for the weather data (only once — on mounting).
  useEffect(() => {
    if (location.latitude && location.longitude) {
      getForecastWeather(location, apiKey)
        .then((data) => {
          setWeatherData(filterDataFromWeatherAPI(data));
        })
        .catch(console.error);
    }
  }, []);

  // The App component saves default clothing items in the state.
  useEffect(() => {
    api
      .getItemList()
      .then((items) => {
        setClothingItems(items.reverse());
      })
      .catch(console.error);
  }, []);

  const onRegister = ({ name, avatar, email, password }, resetForm) => {
    auth
      .register(name, avatar, email, password)
      .then((res) => {
        if (res._id) {
          const userData = {
            name,
            avatar,
            email,
            password,
          };
          resetForm();
          onLogin(userData);
        } else {
          // invalid data
        }
      })
      .catch((err) => console.log(err));
  };

  const onLogin = ({ email, password }, resetForm) => {
    auth
      .login(email, password)
      .then((res) => {
        if (res.token) {
          // When the `onLogin()` handler is called, the JWT is saved
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          closeAllModals();
          // Manually fetch userInfo after login in addition to on first page load since we have the JWT now
          fetchUserInfo(res.token);
          resetForm && resetForm();
        }
      })
      .catch((err) => console.log(err));
  };

  const onEdit = (userData, resetForm) => {
    api
      .setUserInfo(userData, localStorage.getItem("jwt"))
      .then((res) => {
        setCurrentUser(res.data);
        closeAllModals();
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const onSignOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  };

  // The escape listener implementation is optional
  useEffect(() => {
    // If no active modal, don't use the listener
    if (!activeModal) return;

    const handleEscClose = (e) => {
      // Define function inside useEffect to keep the reference on rerender
      if (e.key === "Escape") {
        closeAllModals();
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      // Cleanup by removing listener
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <div className="page__wrapper">
            <Header
              isLoggedIn={isLoggedIn}
              weatherData={weatherData}
              handleAddClick={openAddItemModal}
              handleRegisterClick={openRegistrationModal}
              handleLoginClick={openLoginModal}
            />
            <Routes>
              <Route
                path="/"
                element={
                  weatherData.temperature ? (
                    <Main
                      weatherData={weatherData}
                      cards={clothingItems}
                      onCardClick={handleCardClick}
                      onLikeClick={handleLikeClick}
                    />
                  ) : (
                    // To prevent a warning in the console about empty outlets.
                    // May not be necessary in all cases
                    <p>Loading...</p>
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    loggedIn={isLoggedIn}
                    isLoggedInLoading={isLoggedInLoading}
                  >
                    {clothingItems.length !== 0 && (
                      <Profile
                        cards={clothingItems}
                        onCardClick={handleCardClick}
                        onAddNewClick={openAddItemModal}
                        onProfileChange={openEditProfileModal}
                        onLogOut={onSignOut}
                        onLikeClick={handleLikeClick}
                      />
                    )}
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
          <AddItemModal
            isOpen={activeModal === "create"}
            onCloseModal={closeAllModals}
            onAddItem={handleAddItemSubmit}
          />
          <ItemModal
            isOpen={activeModal === "preview"}
            card={selectedCard}
            onClose={closeAllModals}
            onCardDelete={openDeleteConfirmationModal}
          />
          <DeleteConfirmationModal
            isOpen={activeModal === "delete-confirmation"}
            onClose={closeAllModals}
            onCardDelete={handleCardDelete}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            onCloseModal={closeAllModals}
            onRegister={onRegister}
            onClickLogIn={openLoginModal}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            onCloseModal={closeAllModals}
            onLogin={onLogin}
            onClickRegister={openRegistrationModal}
          />
          <EditModal
            isOpen={activeModal === "edit"}
            onCloseModal={closeAllModals}
            onEdit={onEdit}
          />
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
};

export default App;
