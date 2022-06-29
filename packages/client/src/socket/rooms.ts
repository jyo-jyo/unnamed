import { Socket } from "socket.io-client";
import { ROOM_LIST } from "common";

const rooms = (socket: Socket) => (closure: any) => {
  const { setRooms } = closure;

  socket.on(ROOM_LIST, (rooms) => {
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
