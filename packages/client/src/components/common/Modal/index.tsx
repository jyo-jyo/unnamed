import { ModalContainer } from "./Modal.style";

const Modal = ({
  isOpen,
  closeModal,
  children,
}: {
  isOpen: boolean;
  closeModal: Function;
  children: JSX.Element;
}) => {
  return (
    <ModalContainer isOpen={isOpen}>
      <div>
        <button onClick={() => closeModal()}>X</button>
      </div>
      <div>{children}</div>
    </ModalContainer>
  );
};

export default Modal;
