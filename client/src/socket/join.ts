import { Socket } from "socket.io-client";
import {
  EXIST_ROOM_ERROR,
  JOIN_ROOM,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  EXIT_USER,
  EXIT_ROOM,
} from "../constants/socket";

const join = (socket: Socket) => (closure: any) => {
  const { addUser, initUsers, loadRoomInfo } = closure;

  socket.on(EXIST_ROOM_ERROR, () => {
    alert(EXIST_ROOM_ERROR);
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

  const joinRoom = (roomCode: string) => socket.emit(JOIN_ROOM, { roomCode });

  const exitRoom = (roomCode: string) => {
    socket.emit(EXIT_ROOM, { roomCode });
    disconnecting();
  };

  const disconnecting = () => {
    socket.off(EXIST_ROOM_ERROR);
    socket.off(ENTER_ONE_USER);
    socket.off(ENTER_OTHER_USER);
    socket.off(EXIT_USER);
  };

  return { joinRoom, exitRoom, disconnecting };
};

export default join;
