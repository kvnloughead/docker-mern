import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";

const RegisterModal = ({ isOpen, onRegister, onCloseModal, onClickLogIn }) => {
  const defaultValues = { email: "", password: "", name: "", avatar: "" };
  const { values, handleChange, setValues, resetForm } = useForm(defaultValues);

  useEffect(() => {
    setValues(defaultValues);
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    // Resetting the form fields is recommended, but should only occur after successful submission
    onRegister(values, resetForm);
  }

  return (
    <ModalWithForm
      title="Sign Up"
      name="new-user"
      onClose={onCloseModal}
      onSubmit={handleSubmit}
      isOpen={isOpen}
    >
      <label className="modal__label">
        Email*
        <input
          type="email"
          name="email"
          id="registration-modal-email"
          className="modal__input modal__input_type_card-name"
          placeholder="Email"
          required
          minLength="1"
          maxLength="30"
          onChange={handleChange}
          value={values.email}
          autoComplete="username"
        />
      </label>
      <label className="modal__label">
        Password*
        <input
          type="password"
          name="password"
          id="registration-modal-password"
          className="modal__input modal__input_type_url"
          placeholder="Password"
          required
          onChange={handleChange}
          value={values.password}
          autoComplete="new-password"
        />
      </label>
      <label className="modal__label">
        Name*
        <input
          type="text"
          name="name"
          id="registration-modal-name"
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
        Avatar URL*
        <input
          type="url"
          name="avatar"
          id="registration-modal-avatar"
          className="modal__input modal__input_type_url"
          placeholder="Avatar URL"
          required
          onChange={handleChange}
          value={values.avatar}
        />
      </label>

      <div className="modal__submit-row">
        <button type="submit" className="modal__button">
          Sign Up
        </button>
        <button
          type="button"
          className="modal__link-button"
          onClick={onClickLogIn}
        >
          or Log In
        </button>
      </div>
    </ModalWithForm>
  );
};

export default RegisterModal;
