import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../components/Room/Board";
import UserList from "../components/Room/UserList";
import Socket from "../socket";
import { RoomContainer } from "./Room.style";
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

export interface UserType {
  id: string;
  isReady: boolean;
  userName: string;
}

const Room = () => {
  const nav = useNavigate();
  const { roomCode } = useParams();
  const [roomInfo, setRoomInfo] = useState<RoomType>();
  const [users, setUsers] = useState<UserType[]>([]);
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

  const back = () => {
    socket.current.disconnecting();
    nav(-1);
  };

  const exitRoom = () => {
    if (!roomCode) return;
    socket.current.exitRoom(roomCode.slice(1));
    back();
  };

  useEffect(() => {
    if (!roomCode) return;
    if (socket.current) return;
    socket.current = Socket.join({ addUser, initUsers, loadRoomInfo, back });
    socket.current.joinRoom(roomCode.slice(1));

    return () => {
      if (!isLoading) exitRoom();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    if (users.length === 0) return;
    setIsLoading(false);
  }, [users]);

  return isLoading ? (
    <></>
  ) : (
    <RoomContainer>
      <div>
        <div>
          <button onClick={exitRoom}>◀</button>
        </div>
        <div>
          <text>{roomInfo?.roomSettings.roomName}</text>
          <text>{roomInfo?.roomSettings.isLocked}</text>
        </div>
      </div>
      <UserList users={users} />
      <Board />
    </RoomContainer>
  );
};

export default Room;
