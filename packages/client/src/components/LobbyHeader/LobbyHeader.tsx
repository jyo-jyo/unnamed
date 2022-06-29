import React, { MouseEventHandler, useRef } from "react";
import { Header } from "../common";

const LobbyHeader = ({
  joining,
  openModal,
}: {
  joining: Function;
  openModal: MouseEventHandler;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const joinRoom = () => {
    const roomCode = inputRef.current?.value;
    if (!roomCode) {
      alert("roomCode를 입력해주세요.");
      return;
    }
    joining(roomCode);
  };

  return (
    <Header>
      <>
        <div>
          <input ref={inputRef} placeholder='방코드를 입력해주세요'></input>
          <button onClick={joinRoom}>입장</button>
        </div>
        <button onClick={openModal}>생성</button>
      </>
    </Header>
  );
};

export default LobbyHeader;
