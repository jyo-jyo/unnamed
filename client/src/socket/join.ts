import { Socket } from "socket.io-client";
import {
  EXIST_ROOM_ERROR,
  JOIN_ROOM,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
} from "../constants/socket";

const join = (socket: Socket) => (closure: any) => {
  const { addUser, addUsers } = closure;
  socket.on(EXIST_ROOM_ERROR, () => {
    alert(EXIST_ROOM_ERROR);
  });

  socket.on(ENTER_ONE_USER, (socketId) => {
    addUser(socketId);
  });

  socket.on(ENTER_OTHER_USER, (users) => {
    addUsers(users);
  });

  const joinRoom = (roomCode: string) => socket.emit(JOIN_ROOM, { roomCode });

  const disconnecting = () => {
    socket.off(EXIST_ROOM_ERROR);
    socket.off(ENTER_ONE_USER);
    socket.off(ENTER_OTHER_USER);
  };

  return { joinRoom, disconnecting };
};

export default join;
