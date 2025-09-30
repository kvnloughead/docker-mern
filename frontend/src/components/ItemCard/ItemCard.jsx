import { useContext } from "react";

import CurrentUserContext from "../../contexts/CurrentUserContext";

import "./ItemCard.css";

const ItemCard = ({ card, onCardClick, onLikeClick }) => {
  const currentUser = useContext(CurrentUserContext);

  const isLiked = card.likes.some((id) => id === currentUser._id);

  const handleClick = () => {
    onCardClick(card);
  };

  const handleLikeClick = () => {
    onLikeClick({ id: card._id, isLiked, user: currentUser });
  };

  return (
    <li className="card">
      <img
        src={card.imageUrl}
        alt={card.name}
        onClick={handleClick}
        className="card__image"
      />
      <div className="card__header">
        <p className="card__title">{card.name}</p>
        <button
          className={`card__like-button ${
            isLiked ? "card__like-button_is-active" : ""
          }`}
          onClick={handleLikeClick}
        ></button>
      </div>
    </li>
  );
};

export default ItemCard;
