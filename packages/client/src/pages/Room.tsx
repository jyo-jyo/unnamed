import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Board, ChatList, UserList, RoomHeader } from "@src/components";
import Socket from "@socket";
import { useRoomCode } from "@src/hooks";
import { RoomContainer } from "./Room.style";
import { User, RoomProps } from "common";

const Room = () => {
  const nav = useNavigate();
  const [room, setRoom] = useState<RoomProps>();
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
      setRoom,
      back,
    });
    socket.current.joinRoom(roomCode);

    return () => {
      if (!isLoading) socket.current.disconnecting();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    if (users.length === 0 || !room) return;
    setIsLoading(false);
  }, [users, room]);

  return isLoading ? (
    <></>
  ) : (
    <RoomContainer>
      <RoomHeader room={room} setRoom={setRoom} setUsers={setUsers} />
      <UserList
        users={users}
        hostId={room?.hostId}
        isPlaying={room.gameState.isPlaying}
      />
      <Board />
      <ChatList />
    </RoomContainer>
  );
};

export default Room;
