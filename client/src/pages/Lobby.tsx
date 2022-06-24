import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "@components/Lobby/CreateRoomModal";
import RoomList from "@components/Lobby/RoomList";
import Socket from "@socket/index";
import Header from "@components/common/Header";
export interface RoomInfo {
  roomName: string;
  numberOfUser: number;
  maximumOfUser: number;
  totalRound: number;
  isPlaying: boolean;
  isLocked: boolean;
}
export interface RoomInfoType {
  [roomCode: string]: RoomInfo;
}

const Lobby = () => {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useRef<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const joining = (roomCode: string) => {
    nav(`/room:${roomCode}`);
  };

  useEffect(() => {
    if (socket.current) return;
    socket.current = Socket.create({ joining });
    Socket.connect();
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
