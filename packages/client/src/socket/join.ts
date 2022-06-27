import { Socket } from "socket.io-client";
import {
  EXIST_ROOM_ERROR,
  FULL_ROOM_ERROR,
  JOIN_ROOM,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  TOGGLE_READY,
  EXIT_USER,
  START_GAME,
  READY_ERROR,
} from "common";
import { UserType } from "@src/@types";

const join = (socket: Socket) => (closure: any) => {
  const { setUsers, setRoomInfo, back } = closure;

  socket.on(EXIST_ROOM_ERROR, () => {
    back();
    alert(EXIST_ROOM_ERROR);
  });

  socket.on(FULL_ROOM_ERROR, () => {
    back();
    alert(FULL_ROOM_ERROR);
  });

  socket.on(ENTER_ONE_USER, (user) => {
    console.log(user);
    setUsers((prev: UserType[]) => [...prev, user]);
  });

  socket.on(ENTER_OTHER_USER, (users, roomInfo) => {
    setUsers(users);
    setRoomInfo(roomInfo);
  });

  socket.on(EXIT_USER, (exitId) => {
    setUsers((prev: UserType[]) => prev.filter(({ id }) => id !== exitId));
  });

  socket.on(TOGGLE_READY, (users) => {
    setUsers(users);
  });

  socket.on(READY_ERROR, () => {
    alert(READY_ERROR);
  });

  const joinRoom = (roomCode: string) => socket.emit(JOIN_ROOM, { roomCode });

  const ready = (roomCode: string, isReady: boolean) =>
    socket.emit(TOGGLE_READY, { roomCode, isReady });

  const startGame = (roomCode: string) => socket.emit(START_GAME, { roomCode });

  const disconnecting = () => {
    socket.off(EXIST_ROOM_ERROR);
    socket.off(FULL_ROOM_ERROR);
    socket.off(ENTER_ONE_USER);
    socket.off(ENTER_OTHER_USER);
    socket.off(EXIT_USER);
    socket.off(TOGGLE_READY);
    socket.off(READY_ERROR);
  };

  return { joinRoom, ready, startGame, disconnecting };
};

export default join;
