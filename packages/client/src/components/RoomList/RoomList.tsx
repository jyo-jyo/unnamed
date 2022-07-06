import React, { useEffect, useState, useRef } from "react";
import { Room } from "@src/components";
import Socket from "@socket";
import { RoomListContainer, RoomListBox } from "./RoomList.style";
import { RoomInfo } from "common";

const RoomList = () => {
  const [rooms, setRooms] = useState<{ [roomCode: string]: RoomInfo }>({});
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
        {Object.entries(rooms).map(([roomCode, roomInfo], index) => {
          return <Room roomCode={roomCode} roomInfo={roomInfo} key={index} />;
        })}
      </RoomListBox>
    </RoomListContainer>
  );
};

export default RoomList;
