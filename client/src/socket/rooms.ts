import { Socket } from "socket.io-client";
import { ROOM_LIST } from "../constants/socket";

const rooms = (socket: Socket) => (closure: any) => {
  const { loadRooms } = closure;

  socket.on(ROOM_LIST, (rooms) => {
    loadRooms(rooms);
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