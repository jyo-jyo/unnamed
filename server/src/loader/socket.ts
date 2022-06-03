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

    socket.on("disconnect", () => {
      console.log("disconnect socket!!" + socket.id);
    });
  });

  return app;
};

export default socketLoader;
