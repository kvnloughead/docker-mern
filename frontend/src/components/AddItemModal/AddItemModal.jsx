import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useForm } from "../../hooks/useForm";

const AddItemModal = ({ isOpen, onAddItem, onCloseModal }) => {
  // Students who start Project 11 after August 20th 2025 will be expected to
  // use a custom hook to handle their form components. If a student makes it
  // to Sprint 14 without a custom hook, you shouldn't strictly require
  // refactoring, just recommend it.
  //
  // const [name, setName] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  // const [weather, setWeather] = useState("");
  //
  // function handleNameChange(e) {
  //   setName(e.target.value);
  // }

  // function handleImageUrlChange(e) {
  //   setImageUrl(e.target.value);
  // }

  // function handleWeatherChange(e) {
  //   setWeather(e.target.value);
  // }

  // function handleSubmit(e) {
  //   e.preventDefault();

  //   onAddItem({
  //     name,
  //     imageUrl,
  //     weather,
  //   });
  // }

  const defaultValues = { name: "", imageUrl: "", weather: "hot" };
  const { values, handleChange, resetForm } = useForm(defaultValues);

  function handleSubmit(e) {
    e.preventDefault();

    // Resetting the form fields is recommended, but should only occur after successful submission
    onAddItem(values, resetForm);
  }

  return (
    <ModalWithForm
      title="New garment"
      name="new-card"
      onClose={onCloseModal}
      onSubmit={handleSubmit}
      isOpen={isOpen}
    >
      <label className="modal__label">
        Name
        <input
          type="text"
          name="name"
          id="add-item-name"
          className="modal__input modal__input_type_card-name"
          placeholder="Name"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.name}
        />
      </label>
      <label className="modal__label">
        Image
        <input
          type="url"
          name="imageUrl"
          id="add-item-image"
          className="modal__input modal__input_type_url"
          placeholder="Image URL"
          required
          onChange={handleChange}
          value={values.imageUrl}
        />
      </label>
      <fieldset className="modal__fieldset modal__fieldset_type_radio">
        <legend className="modal__legend">Select the weather type:</legend>
        <div>
          <input
            className="modal__radio-button"
            type="radio"
            id="choiceHot"
            name="weather"
            value="hot"
            onChange={handleChange}
            checked={values.weather === "hot"}
          />
          <label
            className="modal__label modal__label_type_radio"
            htmlFor="choiceHot"
          >
            Hot
          </label>
        </div>
        <div>
          <input
            className="modal__radio-button"
            type="radio"
            id="choiceWarm"
            name="weather"
            value="warm"
            onChange={handleChange}
            checked={values.weather === "warm"}
          />
          <label
            className="modal__label modal__label_type_radio"
            htmlFor="choiceWarm"
          >
            Warm
          </label>
        </div>
        <div>
          <input
            className="modal__radio-button"
            type="radio"
            id="choiceCold"
            name="weather"
            value="cold"
            onChange={handleChange}
            checked={values.weather === "cold"}
          />
          <label
            className="modal__label modal__label_type_radio"
            htmlFor="choiceCold"
          >
            Cold
          </label>
        </div>
      </fieldset>
      <button type="submit" className="modal__button">
        Add garment
      </button>
    </ModalWithForm>
  );
};

export default AddItemModal;
