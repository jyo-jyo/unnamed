import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CreateRoomModal } from "@src/components/CreateRoomModal";
import { RoomList } from "@src/components/RoomList";
import Socket from "@socket/index";
import { LobbyHeader } from "@src/components/LobbyHeader";

const Lobby = () => {
  const nav = useNavigate();
  const socket = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const joining = (roomCode: string) => {
    nav(`/room:${roomCode}`);
    socket.current.disconnecting();
  };

  useEffect(() => {
    if (socket.current) return;
    Socket.connect();
    socket.current = Socket.create({ joining });
    return () => {};
  }, []);

  const createRoom = (roomSettings: Object) => {
    socket.current.createRoom(roomSettings);
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <LobbyHeader joining={joining} openModal={openModal} />
      <RoomList />
      <CreateRoomModal
        isOpen={isOpen}
        closeModal={closeModal}
        createRoom={createRoom}
      />
    </>
  );
};

export default Lobby;
