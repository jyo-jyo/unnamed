import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board";
import Socket from "../socket";
const Room = () => {
  const { roomCode } = useParams();
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addUser = (user: any) => {
    setUsers((prev: any) => [...prev, user]);
  };

  const addUsers = (user: any) => {
    setUsers([...user]);
  };

  useEffect(() => {
    if (!roomCode) return;
    Socket.connect();
    const socket = Socket.room({ addUser, addUsers });
    socket.joinRoom(roomCode);

    return () => {
      socket.disconnecting();
    };
  }, [roomCode]);

  useEffect(() => {
    if (isLoading) return;
    if (users.length === 0) return;
    setIsLoading(true);
  }, [users]);

  return isLoading ? <></> : <Board />;
};

export default Room;
