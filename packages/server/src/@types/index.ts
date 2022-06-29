import { Socket } from "socket.io";
import { Rooms } from "common";
export interface SocketProps {
  io: any;
  socket: Socket;
  rooms: Rooms;
}
