import { useContext } from "react";

import ItemCard from "../ItemCard/ItemCard";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import "./ClothesSection.css";

/**
 * The **ClothesSection** component dispalys each section for the Profile Page.
 * @author [Santiago](https://github.com/Santiag0SR)
 */
const ClothesSection = ({
  sectionData,
  onAddNewClick,
  onCardClick,
  onLikeClick,
}) => {
  const currentUser = useContext(CurrentUserContext);
  if (!currentUser) return null;

  return (
    <div className="clothes-section">
      <div className="clothes-section__info">
        <button className="clothes-section__button" onClick={onAddNewClick}>
          + Add new
        </button>
      </div>
      <ul className="clothes-section__list">
        {sectionData.length &&
          sectionData.map(
            (card) =>
              currentUser &&
              currentUser._id === card.owner && (
                <ItemCard
                  key={card._id}
                  card={card}
                  onCardClick={onCardClick}
                  onLikeClick={onLikeClick}
                />
              )
          )}
      </ul>
    </div>
  );
};

export default ClothesSection;
