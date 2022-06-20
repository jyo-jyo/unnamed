import { Socket, Server } from "socket.io";

import { FRONT_BASE_URL } from "../constants/constant";
import {
  CREATE_ROOM,
  JOIN_ROOM,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  DRAWING,
  OTHER_DRAWING,
  FULL_ROOM_ERROR,
  EXIST_ROOM_ERROR,
  CREATE_SUCCESS,
  ROOM_LIST,
  EXIT_ROOM,
  EXIT_USER,
} from "../constants/socket";

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

interface RoomType {
  [roomCode: string]: {
    hostId: string | null;
    users: string[];
    gameState: {
      isPlaying: boolean;
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

    socket.on(ROOM_LIST, () => {
      const roomsInfo = Object.keys(rooms).reduce(
        (acc: RoomInfoType, roomCode) => {
          const room = rooms[roomCode];
          acc[roomCode] = {
            roomName: room.roomSettings.roomName,
            numberOfUser: room.users.length,
            maximumOfUser: room.roomSettings.maximumOfUser,
            totalRound: room.roomSettings.totalRound,
            isPlaying: room.gameState.isPlaying,
            isLocked: room.roomSettings.isLocked,
          };
          return acc;
        },
        {}
      );
      socket.emit(ROOM_LIST, roomsInfo);
    });

    socket.on(CREATE_ROOM, ({ roomSettings }) => {
      const roomCode = createRoomCode(rooms);
      rooms[roomCode] = {
        hostId: null,
        users: [],
        gameState: {
          isPlaying: false,
          currOrder: 0,
          currRound: 0,
        },
        roomSettings,
      };
      socket.emit(CREATE_SUCCESS, roomCode);
    });

    socket.on(JOIN_ROOM, ({ roomCode }: { roomCode: string }) => {
      if (!(roomCode in rooms)) return socket.emit(EXIST_ROOM_ERROR);
      const room = rooms[roomCode];
      if (!room.hostId) room.hostId = socket.id;
      if (room.users.length === room.roomSettings.maximumOfUser)
        return socket.emit(FULL_ROOM_ERROR);
      socket.join(roomCode);
      room.users.push(socket.id);
      socket.emit(ENTER_OTHER_USER, room.users, room);
      socket.broadcast.to(roomCode).emit(ENTER_ONE_USER, socket.id);
    });

    socket.on(DRAWING, ({ roomCode, drawingData }) => {
      socket.broadcast.to(roomCode).emit(OTHER_DRAWING, drawingData);
    });

    socket.on(EXIT_ROOM, ({ roomCode }) => {
      if (!(roomCode in rooms)) return socket.emit(EXIST_ROOM_ERROR);
      // TODO: 방장권한, 게임이 진행 중인 경우...
      socket.leave(roomCode);
      const room = rooms[roomCode];
      room.users = room.users.filter((id) => id !== socket.id);
      if (room.users.length === 0) {
        delete rooms[roomCode];
        return;
      }
      socket.broadcast.to(roomCode).emit(EXIT_USER, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("disconnect socket!!" + socket.id);
    });
  });

  return app;
};

export default socketLoader;
