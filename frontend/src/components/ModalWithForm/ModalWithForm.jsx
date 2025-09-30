import "./ModalWithForm.css";
// import Modal from "../Modal/Modal"; // Optional

const ModalWithForm = ({
  title,
  name,
  onClose,
  children,
  onSubmit,
  isOpen,
}) => {
  return (
    // Example of optional Modal wrapper usage.
    /* <Modal name={name} onClose={onClose} isOpen={isOpen}>
      <h3 className="modal__title">{title}</h3>
      <form className="modal__form" name={name} onSubmit={onSubmit}>
        {children}
      </form>
    </Modal> */
    <div
      className={`modal modal_type_${name} ${isOpen ? "modal_is-opened" : ""}`}
    >
      <div className="modal__content">
        <button type="button" className="modal__close" onClick={onClose} />
        <h3 className="modal__title">{title}</h3>
        <form className="modal__form" name={name} onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
};

export default ModalWithForm;
