import { Socket } from "socket.io";
import {
  CREATE_ROOM,
  CREATE_SUCCESS,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  EXIST_ROOM_ERROR,
  EXIT_ROOM,
  EXIT_USER,
  FULL_ROOM_ERROR,
  JOIN_ROOM,
  ROOM_LIST,
} from "../constants/socket";
import { RoomInfoType, RoomType, SocketType } from "../loader/socket";

const join = ({ io, socket, rooms }: SocketType) => {
  const createRoomCode = (rooms: RoomType) => {
    while (true) {
      const code = Math.random().toString(16).substr(2, 5);
      if (!(code in rooms)) return code;
    }
  };

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

  return { io, socket, rooms };
};

export default join;
