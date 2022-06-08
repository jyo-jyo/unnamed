import React, { useState } from "react";
import { ModalContainer } from "./Modal.style";

const Modal = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ModalContainer isOpen={isOpen}>
      <div>
        <text></text>
        <button onClick={() => setIsOpen(false)}>X</button>
      </div>
      <div>{children}</div>
    </ModalContainer>
  );
};

export default Modal;
