import { useContext, useEffect, useState } from "react";

import { useForm } from "../../hooks/useForm";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import ModalWithForm from "../ModalWithForm/ModalWithForm";

const EditModal = ({ onEdit, onCloseModal, isOpen }) => {
  const defaultValues = { name: "", avatar: "" };
  const { values, handleChange, setValues, resetForm } = useForm(defaultValues);

  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    if (currentUser) {
      setValues({ name: currentUser.name, avatar: currentUser.avatar });
    }
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();

    // Resetting the form fields is recommended, but should only occur after successful submission
    onEdit(values, resetForm);
  }

  return (
    <ModalWithForm
      title="Change profile data"
      name="log-in-user"
      onClose={onCloseModal}
      onSubmit={handleSubmit}
      isOpen={isOpen}
    >
      <label className="modal__label">
        User name
        <input
          type="text"
          name="name"
          id="edit-modal-name"
          className="modal__input modal__input_type_card-name"
          placeholder="User name"
          required
          minLength="1"
          maxLength="30"
          value={values.name || ""}
          onChange={handleChange}
        />
      </label>
      <label className="modal__label">
        Avatar URL
        <input
          type="url"
          name="avatar"
          id="edit-modal-avatar"
          className="modal__input modal__input_type_url"
          placeholder="Avatar URL"
          required
          value={values.avatar || ""}
          onChange={handleChange}
        />
      </label>
      <button type="submit" className="modal__button">
        Edit
      </button>
    </ModalWithForm>
  );
};

export default EditModal;
