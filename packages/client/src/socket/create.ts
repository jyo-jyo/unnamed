import { Socket } from "socket.io-client";
import { CREATE_ROOM, CREATE_SUCCESS } from "common";
import { RoomSetting } from "common";

const create = (socket: Socket) => (functions: { joining: Function }) => {
  const { joining } = functions;

  socket.on(CREATE_SUCCESS, (roomCode: string) => {
    joining(roomCode);
  });

  const createRoom = (roomSetting: RoomSetting) =>
    socket.emit(CREATE_ROOM, { roomSetting });

  const disconnecting = () => {
    socket.off(CREATE_SUCCESS);
  };

  return { createRoom, disconnecting };
};

export default create;
