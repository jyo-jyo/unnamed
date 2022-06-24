import React, { useEffect, useState, useRef } from "react";
import Room from "@components/Lobby/Room";
import { RoomInfoType } from "@pages/Lobby";
import Socket from "@socket/index";
import {
  RoomListContainer,
  RoomListBox,
} from "@components/Lobby/RoomList.style";
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
    <RoomListContainer>
      <button onClick={() => socket.current.getRooms()}>새로고침</button>
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
