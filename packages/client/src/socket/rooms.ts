import { Socket } from "socket.io-client";
import { ROOM_LIST } from "common";
import { RoomInfo } from "common";

const rooms = (socket: Socket) => (functions: { setRooms: Function }) => {
  const { setRooms } = functions;

  socket.on(ROOM_LIST, (rooms: { [roomCode: string]: RoomInfo }) => {
    setRooms(rooms);
  });

  const getRooms = () => {
    socket.emit(ROOM_LIST);
  };

  const disconnecting = () => {
    socket.off(ROOM_LIST);
  };

  return { getRooms, disconnecting };
};

export default rooms;
