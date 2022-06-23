import { Socket, Server } from "socket.io";

import { FRONT_BASE_URL } from "../constants/constant";
import {
  DRAWING,
  OTHER_DRAWING,
  EXIST_ROOM_ERROR,
  EXIT_ROOM,
  EXIT_USER,
} from "../constants/socket";
import game from "../socket/game";
import join from "../socket/room";
import pipe from "../utils/pipe";

export interface RoomInfo {
  roomName: string;
  numberOfUser: number;
  maximumOfUser: number;
  totalRound: number;
  isPlaying: boolean;
  isLocked: boolean;
}
export interface RoomInfoType {
  [roomCode: string]: RoomInfo;
}
export interface UserType {
  id: string;
  isReady: boolean;
  userName: string;
}
export interface RoomType {
  [roomCode: string]: {
    hostId: string | null;
    users: UserType[];
    gameState: {
      isPlaying: boolean;
      game: NodeJS.Timeout | null;
      answer: string;
      currOrder: number;
      currRound: number;
    };
    roomSettings: {
      roomName: string;
      maximumOfUser: number;
      totalRound: number;
      isLocked: boolean;
      password: string;
    };
  };
}

export interface SocketType {
  io: any;
  socket: Socket;
  rooms: RoomType;
}

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

    pipe(join, game)({ io, socket, rooms });

    socket.on(DRAWING, ({ roomCode, drawingData }) => {
      socket.broadcast.to(roomCode).emit(OTHER_DRAWING, drawingData);
    });

    socket.on("disconnect", () => {
      console.log("disconnect socket!!" + socket.id);
    });
  });

  return app;
};

export default socketLoader;
