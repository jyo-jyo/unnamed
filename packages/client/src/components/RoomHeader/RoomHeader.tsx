import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@src/components";
import { RoomHeaderContainer, ExitButton } from "./RoomHeader.style";
import { useRoomCode } from "@src/hooks";
import Socket from "@socket";
import { RoomProps } from "common";

const RoomHeader = ({
  room,
  setRoom,
  setUsers,
}: {
  room?: RoomProps;
  setRoom: Function;
  setUsers: Function;
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const roomCode = useRoomCode();
  const socket = useRef<any>(null);
  const nav = useNavigate();

  useEffect(() => {
    socket.current = Socket.waiting({ setRoom, setUsers });
    return () => {
      socket.current.disconnecting();
    };
  }, []);

  const toggleReady = () => {
    setIsReady((prev) => {
      const isReady = !prev;
      socket.current.ready(roomCode, isReady);
      return isReady;
    });
  };

  const startGame = () => {
    socket.current.startGame(roomCode);
  };

  const exitRoom = () => {
    if (!roomCode) return;
    socket.current.exitRoom(roomCode);
    nav(-1);
  };

  return (
    <Header>
      <RoomHeaderContainer>
        <div>
          <ExitButton onClick={exitRoom}>◀</ExitButton>
          <span>{room.roomSetting.roomName}</span>
          <span>{room.roomSetting.isLocked}</span>
        </div>
        {!room.gameState.isPlaying && room.hostId === Socket.getSID() ? (
          <button onClick={startGame}>게임시작</button>
        ) : (
          <button onClick={toggleReady}>
            {isReady ? "준비해제" : "준비완료"}
          </button>
        )}
      </RoomHeaderContainer>
    </Header>
  );
};

export default RoomHeader;
