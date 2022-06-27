import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Board } from "@components/Board";
import { ChatList } from "@components/ChatList";
import { UserList } from "@components/UserList";
import useRoomCode from "@hooks/useRoomCode";
import Socket from "@socket/index";
import { RoomContainer } from "@pages/Room.style";
import { RoomType, UserType } from "@src/@types";
import { RoomHeader } from "@src/components/RoomHeader";

const Room = () => {
  const nav = useNavigate();
  const [roomInfo, setRoomInfo] = useState<RoomType>();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = useRef<any>(null);
  const roomCode = useRoomCode();

  const back = () => {
    socket.current.disconnecting();
    nav("/", { replace: true });
  };

  useEffect(() => {
    if (socket.current) return;
    socket.current = Socket.join({
      setUsers,
      setRoomInfo,
      back,
    });
    socket.current.joinRoom(roomCode);

    return () => {
      if (!isLoading) socket.current.disconnecting();
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
      <RoomHeader
        roomInfo={roomInfo}
        setRoomInfo={setRoomInfo}
        setUsers={setUsers}
      />
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
