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
  TOGGLE_READY,
  START_GAME,
  READY_ERROR,
  NEXT_TURN,
  GAME_TIME,
  SEND_CHAT,
  RECEIVE_CHAT,
  START_MY_TURN,
  END_MY_TURN,
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
export interface UserType {
  id: string;
  isReady: boolean;
  userName: string;
}
interface RoomType {
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

const rooms = <RoomType>{};

const createRoomCode = (rooms: RoomType) => {
  while (true) {
    const code = Math.random().toString(16).substr(2, 5);
    if (!(code in rooms)) return code;
  }
};

const randomAnswer = () => {
  // TODO
  return "배고파";
};

const nextTurn = ({ io, roomCode }: { io: any; roomCode: string }) => {
  const room = rooms[roomCode];
  if (++room.gameState.currRound > room.roomSettings.totalRound) {
    // TODO: 게임 종료
  }
  io.to(room.users[room.gameState.currOrder].id).emit(END_MY_TURN);
  if (++room.gameState.currOrder === room.roomSettings.maximumOfUser)
    room.gameState.currOrder = 0;

  io.to(roomCode).emit(NEXT_TURN, {
    restTime: GAME_TIME,
    currOrder: room.gameState.currOrder,
    currRound: room.gameState.currRound,
  });

  io.to(room.users[room.gameState.currOrder].id).emit(START_MY_TURN, {
    answer: randomAnswer(),
  });

  room.gameState.game = setTimeout(() => {
    nextTurn({ io, roomCode });
  }, GAME_TIME * 1000);
};

const socketLoader = (server: any, app: any): any => {
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
          game: null,
          answer: "",
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
      room.users.push({ id: socket.id, isReady: false, userName: socket.id });
      socket.emit(ENTER_OTHER_USER, room.users, room);
      socket.broadcast.to(roomCode).emit(ENTER_ONE_USER, socket.id);
    });

    socket.on(TOGGLE_READY, ({ roomCode, isReady }) => {
      const room = rooms[roomCode];
      room.users = room.users.map((user) => {
        if (user.id === socket.id) user.isReady = isReady;
        return user;
      });
      io.to(roomCode).emit(TOGGLE_READY, room.users);
    });

    socket.on(START_GAME, ({ roomCode }) => {
      if (
        rooms[roomCode].users.some(({ id, isReady }) => {
          if (id !== rooms[roomCode].hostId && !isReady) return true;
          return false;
        })
      )
        return socket.emit(READY_ERROR);
      const room = rooms[roomCode];
      io.to(roomCode).emit(START_GAME);
      io.to(room.users[0].id).emit(START_MY_TURN);
      room.gameState.game = setTimeout(() => {
        nextTurn({ io, roomCode });
      }, GAME_TIME * 1000);
    });

    socket.on(SEND_CHAT, ({ roomCode, message }) => {
      const room = rooms[roomCode];
      socket.broadcast
        .to(roomCode)
        .emit(RECEIVE_CHAT, { id: socket.id, message });
      if (!room.gameState.isPlaying || message !== room.gameState.answer)
        return;
      // 정답일 경우
      nextTurn({ roomCode, io });
    });

    socket.on(DRAWING, ({ roomCode, drawingData }) => {
      socket.broadcast.to(roomCode).emit(OTHER_DRAWING, drawingData);
    });

    socket.on(EXIT_ROOM, ({ roomCode }) => {
      if (!(roomCode in rooms)) return socket.emit(EXIST_ROOM_ERROR);
      // TODO: 방장권한, 게임이 진행 중인 경우...
      socket.leave(roomCode);
      const room = rooms[roomCode];
      room.users = room.users.filter(({ id }) => id !== socket.id);
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
