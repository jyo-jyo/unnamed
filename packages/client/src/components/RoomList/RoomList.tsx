import React, { useEffect, useState, useRef } from "react";
import { Room } from "@src/components";
import { RoomsInfo } from "common";
import Socket from "@socket";
import { RoomListContainer, RoomListBox } from "./RoomList.style";
const RoomList = () => {
  const [rooms, setRooms] = useState<RoomsInfo>({});
  const socket = useRef<any>(null);

  const loadRooms = () => {
    socket.current.getRooms();
  };

  useEffect(() => {
    socket.current = Socket.rooms({ setRooms });
    loadRooms();
    return () => {
      socket.current.disconnecting();
    };
  }, []);

  return (
    <RoomListContainer>
      <button onClick={loadRooms}>새로고침</button>
      <RoomListBox>
        {Object.keys(rooms).map((roomCode: string, index) => {
          const room = rooms[roomCode];
          return <Room roomCode={roomCode} roomInfo={room} key={index} />;
        })}
      </RoomListBox>
    </RoomListContainer>
  );
};

export default RoomList;
