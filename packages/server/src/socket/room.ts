import { v4 } from "uuid";
import {
  CREATE_ROOM,
  CREATE_SUCCESS,
  ENTER_ONE_USER,
  ENTER_OTHER_USER,
  EXIST_ROOM_ERROR,
  FULL_ROOM_ERROR,
  JOIN_ROOM,
  ROOM_LIST,
} from "common";

import { SocketProps } from "@types";
import { RoomsInfo, Rooms } from "common";

const join = ({ io, socket, rooms }: SocketProps) => {
  const createRoomCode = () => v4();

  socket.on(ROOM_LIST, () => {
    const roomsInfo = Object.keys(rooms).reduce((acc: RoomsInfo, roomCode) => {
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
    }, {});
    socket.emit(ROOM_LIST, roomsInfo);
  });

  socket.on(CREATE_ROOM, ({ roomSettings }) => {
    const roomCode = createRoomCode();
    rooms[roomCode] = {
      hostId: socket.id,
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
