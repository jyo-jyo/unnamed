import { Socket } from "socket.io-client";
import { CREATE_ROOM, CREATE_SUCCESS } from "@constants/socket";

const create = (socket: Socket) => (closure: any) => {
  const { joining } = closure;

  socket.on(CREATE_SUCCESS, (roomCode: string) => {
    joining(roomCode);
  });

  const createRoom = (roomSettings: Object) =>
    socket.emit(CREATE_ROOM, { roomSettings });

  const disconnecting = () => {
    socket.off(CREATE_SUCCESS);
  };

  return { createRoom, disconnecting };
};

export default create;
