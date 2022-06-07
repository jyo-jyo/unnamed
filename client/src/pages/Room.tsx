import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board";
import Socket from "../socket";
const Room = () => {
  const { roomCode } = useParams();
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = useRef<any>();

  const addUser = (user: any) => {
    setUsers((prev: any) => [...prev, user]);
  };

  const addUsers = (user: any) => {
    setUsers([...user]);
  };

  useEffect(() => {
    if (!roomCode) return;
    if (socket.current) return;
    socket.current = Socket.join({ addUser, addUsers });
    socket.current.joinRoom(roomCode.slice(1));

    return () => {
      // socket.current.disconnecting();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (users.length === 0) return;
    setIsLoading(true);
  }, [users]);

  return isLoading ? <Board /> : <></>;
};

export default Room;
