import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LobbyHeader, RoomList, CreateRoomModal } from "@src/components";
import Socket from "@socket";

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
