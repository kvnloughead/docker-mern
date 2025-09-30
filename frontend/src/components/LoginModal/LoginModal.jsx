import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";

import ModalWithForm from "../ModalWithForm/ModalWithForm";

const LoginModal = ({ isOpen, onLogin, onCloseModal, onClickRegister }) => {
  const defaultValues = { email: "", password: "" };
  const { values, handleChange, resetForm } = useForm(defaultValues);

  function handleSubmit(e) {
    e.preventDefault();

    // Resetting the form fields is recommended, but should only occur after successful submission
    onLogin(values, resetForm);
  }

  return (
    <ModalWithForm
      title="Log In"
      name="log-in-user"
      onClose={onCloseModal}
      onSubmit={handleSubmit}
      isOpen={isOpen}
    >
      <label className="modal__label">
        Email
        <input
          type="email"
          name="email"
          id="login-modal-email"
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
        Password
        <input
          type="password"
          name="password"
          id="login-modal-password"
          className="modal__input modal__input_type_url"
          placeholder="Password"
          required
          onChange={handleChange}
          value={values.password}
          autoComplete="current-password"
        />
      </label>
      <div className="modal__submit-row">
        <button type="submit" className="modal__button">
          Log In
        </button>
        <button
          type="button"
          className="modal__link-button"
          onClick={onClickRegister}
        >
          or Sign Up
        </button>
      </div>
    </ModalWithForm>
  );
};

export default LoginModal;
