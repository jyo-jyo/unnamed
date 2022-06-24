import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CreateRoomModal } from "@src/components/CreateRoomModal";
import { RoomList } from "@src/components/RoomList";
import Socket from "@socket/index";
import { Header } from "@components/common";

const Lobby = () => {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const joining = (roomCode: string) => {
    nav(`/room:${roomCode}`);
    socket.current.disconnecting();
  };

  useEffect(() => {
    if (socket.current) return;
    Socket.connect();
    socket.current = Socket.create({ joining });
    return () => {};
  }, []);

  const createRoom = (roomSettings: Object) => {
    socket.current.createRoom(roomSettings);
  };

  const joinRoom = () => {
    const roomCode = inputRef.current?.value;
    if (!roomCode) {
      alert("roomCode를 입력해주세요.");
      return;
    }
    joining(roomCode);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Header>
        <>
          <div>
            <input ref={inputRef} placeholder='방코드를 입력해주세요'></input>
            <button onClick={joinRoom}>입장</button>
          </div>
          <button onClick={openModal}>생성</button>
        </>
      </Header>
      <RoomList />
      <CreateRoomModal
        isOpen={isOpen}
        closeModal={closeModal}
        createRoom={createRoom}
      />
    </>
  );
};

export default Lobby;
