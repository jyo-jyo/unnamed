import styled from "styled-components";

export const DropBoxContainer = styled.div``;

export const DropBoxItem = styled.div``;

export const DropBoxButton = styled.button``;

export const DropBoxItemBox = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
`;
