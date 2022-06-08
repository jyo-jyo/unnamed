import React, { useEffect, useState, useRef } from "react";
import Room from "./Room";
import { RoomInfoType } from "../../pages/Lobby";
import Socket from "../../socket";
import { RoomListContainer } from "./RoomList.style";
const RoomList = () => {
  const [rooms, setRooms] = useState<RoomInfoType>({});
  const socket = useRef<any>();

  const loadRooms = (rooms: RoomInfoType) => {
    setRooms(rooms);
  };

  useEffect(() => {
    if (socket.current) return;
    socket.current = Socket.rooms({ loadRooms });
    socket.current.getRooms();
    return () => {
      // socket.current.disconnecting();
    };
  }, []);

  return (
    <div>
      <button onClick={() => socket.current.getRooms()}>새로고침</button>
      <RoomListContainer>
        {Object.keys(rooms).map((roomCode: string) => {
          const room = rooms[roomCode];
          return <Room roomCode={roomCode} roomInfo={room}></Room>;
        })}
      </RoomListContainer>
    </div>
  );
};

export default RoomList;
