import { Socket } from "socket.io-client";
import {
  EXIST_ROOM_ERROR,
  FULL_ROOM_ERROR,
  JOIN_ROOM,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  TOGGLE_READY,
  EXIT_USER,
  EXIT_ROOM,
} from "../constants/socket";

const join = (socket: Socket) => (closure: any) => {
  const { addUser, initUsers, loadRoomInfo, back, toggleOtherReady } = closure;

  socket.on(EXIST_ROOM_ERROR, () => {
    back();
    alert(EXIST_ROOM_ERROR);
  });

  socket.on(FULL_ROOM_ERROR, () => {
    back();
    alert(FULL_ROOM_ERROR);
  });

  socket.on(ENTER_ONE_USER, (socketId) => {
    addUser(socketId);
  });

  socket.on(ENTER_OTHER_USER, (users, roomInfo) => {
    initUsers(users);
    loadRoomInfo(roomInfo);
  });

  socket.on(EXIT_USER, (users) => {
    initUsers(users);
  });

  socket.on(TOGGLE_READY, (data: any) => {
    toggleOtherReady(data);
  });

  const joinRoom = (roomCode: string) => socket.emit(JOIN_ROOM, { roomCode });

  const exitRoom = (roomCode: string) => {
    socket.emit(EXIT_ROOM, { roomCode });
    disconnecting();
  };

  const ready = (roomCode: string, isReady: boolean) =>
    socket.emit(TOGGLE_READY, { roomCode, isReady });

  const disconnecting = () => {
    socket.off(EXIST_ROOM_ERROR);
    socket.off(FULL_ROOM_ERROR);
    socket.off(ENTER_ONE_USER);
    socket.off(ENTER_OTHER_USER);
    socket.off(EXIT_USER);
  };

  return { joinRoom, exitRoom, ready, disconnecting };
};

export default join;
