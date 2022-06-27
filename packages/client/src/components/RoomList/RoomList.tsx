import React, { useEffect, useState, useRef } from "react";
import { Room } from "@components/RoomList";
import { RoomInfoType } from "@src/@types";
import Socket from "@socket/index";
import { RoomListContainer, RoomListBox } from "./RoomList.style";
const RoomList = () => {
  const [rooms, setRooms] = useState<RoomInfoType>({});
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
