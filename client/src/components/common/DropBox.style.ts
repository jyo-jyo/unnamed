import styled from "styled-components";
import { COLOR } from "@constants/style";

export const DropBoxContainer = styled.div``;

export const DropBoxButton = styled.button`
  width: 80px;
  height: 40px;

  border: none;
  border-radius: 10px;
`;

export const DropBoxItemBox = styled.div<{ isOpen: boolean }>`
  position: absolute;

  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 3px;

  border-radius: 10px;
  background-color: ${COLOR.white};
`;

export const DropBoxItem = styled.div<{
  isFirst: boolean;
  isLast: boolean;
}>`
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ isFirst }) => (isFirst ? "10px 10px" : "0px 0px")}
    ${({ isLast }) => (isLast ? "10px 10px" : "0px 0px")};
  :hover {
    background-color: ${COLOR.disabled};
    color: ${COLOR.white};
  }
`;
