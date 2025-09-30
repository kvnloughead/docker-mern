import { useContext } from "react";

import CurrentUserContext from "../../contexts/CurrentUserContext";

import "../ModalWithForm/ModalWithForm.css";
import "./ItemModal.css";

const ItemModal = ({ card, onClose, onCardDelete, isOpen }) => {
  const currentUser = useContext(CurrentUserContext);

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  return (
    <div
      className={`modal modal_type_image ${isOpen ? "modal_is-opened" : ""}`}
    >
      <div className="modal__content modal__content_content_image">
        <button type="button" className="modal__close" onClick={onClose} />
        <img
          alt={card?.name || ""}
          src={card?.imageUrl || ""}
          className="modal__image"
        />
        <div className="modal__footer">
          <div className="modal__footer-container">
            <p className="modal__caption">{card?.name || ""}</p>
            {currentUser && currentUser._id === card?.owner && (
              <button
                className="modal__delete-button"
                onClick={handleDeleteClick}
              >
                Delete item
              </button>
            )}
          </div>
          <p className="modal__caption">Weather: {card?.weather || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
