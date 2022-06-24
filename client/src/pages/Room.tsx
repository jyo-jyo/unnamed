import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Board } from "@components/Board";
import { ChatList } from "@components/ChatList";
import { UserList } from "@components/UserList";
import useRoomCode from "@hooks/useRoomCode";
import Socket from "@socket/index";
import { RoomContainer } from "@pages/Room.style";
import { RoomType, UserType } from "@src/@types";

const Room = () => {
  const nav = useNavigate();
  const [roomInfo, setRoomInfo] = useState<RoomType>();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = useRef<any>();
  const roomCode = useRoomCode();

  const back = () => {
    socket.current.disconnecting();
    nav(-1);
  };

  const exitRoom = () => {
    if (!roomCode) return;
    socket.current.exitRoom(roomCode);
    back();
  };

  const toggleMyReady = () => {
    setIsReady((prev) => {
      const isReady = !prev;
      socket.current.ready(roomCode, isReady);
      return isReady;
    });
  };

  const isHost = () => roomInfo?.hostId === Socket.getSID();

  useEffect(() => {
    if (!roomCode) return;
    if (socket.current) return;
    socket.current = Socket.join({
      setUsers,
      setRoomInfo,
      back,
    });
    socket.current.joinRoom(roomCode);

    return () => {
      if (!isLoading) exitRoom();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    if (users.length === 0) return;
    setIsLoading(false);
  }, [users]);

  return isLoading ? (
    <></>
  ) : (
    <RoomContainer>
      <div>
        <div>
          <button onClick={exitRoom}>◀</button>
          {!roomInfo?.gameState.isPlaying && isHost() ? (
            <button onClick={() => socket.current.startGame(roomCode)}>
              게임시작
            </button>
          ) : (
            <button onClick={toggleMyReady}>
              {isReady ? "준비해제" : "준비완료"}
            </button>
          )}
        </div>
        <div>
          <span>{roomInfo?.roomSettings.roomName}</span>
          <span>{roomInfo?.roomSettings.isLocked}</span>
        </div>
      </div>
      <UserList
        users={users}
        hostId={roomInfo?.hostId}
        isPlaying={roomInfo?.gameState.isPlaying}
      />
      <Board />
      <ChatList />
    </RoomContainer>
  );
};

export default Room;
