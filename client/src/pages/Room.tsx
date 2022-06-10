import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../components/Room/Board";
import Socket from "../socket";

interface RoomType {
  hostId: string | null;
  users: string[];
  gameState: {
    isPlaying: boolean;
    currOrder: number;
    currRound: number;
  };
  roomSettings: {
    roomName: string;
    maximumOfUser: number;
    totalRound: number;
    isLocked: boolean;
    password: string;
  };
}

const Room = () => {
  const nav = useNavigate();
  const { roomCode } = useParams();
  const [roomInfo, setRoomInfo] = useState<RoomType>();
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = useRef<any>();

  const addUser = (user: any) => {
    setUsers((prev: any) => [...prev, user]);
  };

  const initUsers = (user: any) => {
    setUsers([...user]);
  };

  const loadRoomInfo = (roomInfo: RoomType) => {
    setRoomInfo(roomInfo);
  };

  const exitRoom = () => {
    if (!roomCode) return;
    socket.current.exitRoom(roomCode.slice(1));
    nav(-1);
  };

  useEffect(() => {
    if (!roomCode) return;
    if (socket.current) return;
    socket.current = Socket.join({ addUser, initUsers, loadRoomInfo });
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

  return isLoading ? (
    <>
      <div>
        <div>
          <button onClick={exitRoom}>◀</button>
        </div>
        <div>
          <text>{roomInfo?.roomSettings.roomName}</text>
          <text>{roomInfo?.roomSettings.isLocked}</text>
        </div>
      </div>
      <Board />
    </>
  ) : (
    <></>
  );
};

export default Room;
