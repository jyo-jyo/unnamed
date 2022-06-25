import {
  CREATE_ROOM,
  CREATE_SUCCESS,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  EXIST_ROOM_ERROR,
  EXIT_ROOM,
  EXIT_USER,
  FULL_ROOM_ERROR,
  GAME_TIME,
  JOIN_ROOM,
  ROOM_LIST,
  START_MY_TURN,
} from "@constants/socket";

import { RoomInfoType, RoomType, SocketType, UserType } from "@src/@types";

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
        currRound: 1,
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
    const user = { id: socket.id, isReady: false, userName: socket.id };
    room.users.push(user);
    socket.emit(ENTER_OTHER_USER, room.users, room);
    socket.broadcast.to(roomCode).emit(ENTER_ONE_USER, user);
  });

  return { io, socket, rooms };
};

export default join;
