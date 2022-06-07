import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Socket from "../socket";
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

  useEffect(() => {
    Socket.connect();
    return () => {
      Socket.disconnect();
    };
  }, []);

  const joining = (roomCode: string) => {
    nav(`/room:${roomCode}`);
  };

  const createRoom = () => {
    Socket.create({ joining }).createRoom();
  };

  const joinRoom = () => {
    const roomCode = inputRef.current?.value;
    if (!roomCode) {
      alert("roomCode를 입력해주세요.");
      return;
    }
    joining(roomCode);
  };

  return (
    <div>
      <input ref={inputRef}></input>
      <button onClick={createRoom}>생성</button>
      <button onClick={joinRoom}>입장</button>
    </div>
  );
};

export default Lobby;
