import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Board, ChatList, UserList, RoomHeader } from "@src/components";
import Socket from "@socket";
import { useRoomCode } from "@src/hooks";
import { RoomContainer } from "./Room.style";
import { Room as RoomType, User } from "common";

const Room = () => {
  const nav = useNavigate();
  const [roomInfo, setRoomInfo] = useState<RoomType>();
  const [users, setUsers] = useState<User[]>([]);
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
