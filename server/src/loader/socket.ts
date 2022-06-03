import { Socket, Server } from "socket.io";

import { FRONT_BASE_URL } from "../constants/constant";
import {
  CREATE_ROOM,
  JOIN_ROOM,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  DRAWING,
  OTHER_DRAWING,
  EXIST_ROOM_ERROR,
  CREATE_SUCCESS,
} from "../constants/socket";

interface RoomType {
  [roomCode: string]: {
    hostId: string | null;
    users: string[];
  };
}
const createRoomCode = (rooms: RoomType) => {
  while (true) {
    const code = Math.random().toString(16).substr(2, 5);
    if (!(code in rooms)) return code;
  }
};

const socketLoader = (server: any, app: any): any => {
  const rooms = <RoomType>{};

  const io = new Server(server, {
    cors: {
      origin: FRONT_BASE_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket): void => {
    console.log("socket connection!!", socket.id);

    socket.on(CREATE_ROOM, () => {
      const roomCode = createRoomCode(rooms);
      rooms[roomCode] = {
        hostId: null,
        users: [],
      };
      socket.emit(CREATE_SUCCESS, roomCode);
    });

    socket.on(JOIN_ROOM, ({ roomCode }: { roomCode: string }) => {
      if (!(roomCode in rooms)) return socket.emit(EXIST_ROOM_ERROR);
      if (!rooms[roomCode].hostId) rooms[roomCode].hostId = socket.id;
      socket.join(roomCode);
      rooms[roomCode].users.push(socket.id);
      socket.emit(ENTER_OTHER_USER, rooms[roomCode].users);
      io.to(roomCode).emit(ENTER_ONE_USER, socket.id);
    });

    socket.on(DRAWING, ({ roomCode, drawingData }) => {
      io.to(roomCode).emit(OTHER_DRAWING, drawingData);
    });

    socket.on("disconnect", () => {
      console.log("disconnect socket!!" + socket.id);
    });
  });

  return app;
};

export default socketLoader;
