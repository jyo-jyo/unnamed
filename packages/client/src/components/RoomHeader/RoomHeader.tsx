import React, { useEffect, useState, useRef } from "react";
import Socket from "@socket";
import { Header } from "@src/components";
import { RoomHeaderContainer, ExitButton } from "./RoomHeader.style";
import { Room } from "common";
import { useRoomCode } from "@src/hooks";
import { useNavigate } from "react-router-dom";

const RoomHeader = ({
  roomInfo,
  setRoomInfo,
  setUsers,
}: {
  roomInfo: Room | undefined;
  setRoomInfo: Function;
  setUsers: Function;
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const roomCode = useRoomCode();
  const socket = useRef<any>(null);
  const nav = useNavigate();
  const isHost = () => roomInfo?.hostId === Socket.getSID();

  useEffect(() => {
    socket.current = Socket.waiting({ setRoomInfo, setUsers });
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
          <span>{roomInfo?.roomSettings.roomName}</span>
          <span>{roomInfo?.roomSettings.isLocked}</span>
        </div>
        {!roomInfo?.gameState.isPlaying &&
          (isHost() ? (
            <button onClick={startGame}>게임시작</button>
          ) : (
            <button onClick={toggleReady}>
              {isReady ? "준비해제" : "준비완료"}
            </button>
          ))}
      </RoomHeaderContainer>
    </Header>
  );
};

export default RoomHeader;
