import styled from "styled-components";
import { COLOR } from "../../constants/style";

export const RoomContainer = styled.div<{ isAccessible: boolean }>`
  width: 250px;
  height: 80px;

  padding: 10px;
  margin: 5px;

  display: flex;
  flex: 1 1 1;
  flex-direction: column;
  justify-content: center;

  color: ${({ isAccessible }) => (isAccessible ? "black" : COLOR.disabled)};
  border: solid 1px
    ${({ isAccessible }) => (isAccessible ? "black" : COLOR.disabled)};
  hr {
    width: 100%;
  }
`;

export const RoomTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const RoomInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
