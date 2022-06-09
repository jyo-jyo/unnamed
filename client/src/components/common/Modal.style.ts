import styled from "styled-components";

export const ModalContainer = styled.div<{ isOpen: boolean }>`
  border: solid 1px black;
  padding: 10px;

  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
`;
