import { v4 } from "uuid";
import {
  CREATE_ROOM,
  CREATE_SUCCESS,
  OTHER_USER_LIST,
  ENTER_OTHER_USER,
  NOT_EXIST_ROOM_ERROR,
  FULL_ROOM_ERROR,
  JOIN_ROOM,
  ROOM_LIST,
} from "common";

import { SocketProps } from "@types";
import { RoomsInfo, Room } from "common";

const join = ({ io, socket, rooms }: SocketProps) => {
  const createRoomCode = () => v4();

  socket.on(ROOM_LIST, () => {
    const roomsInfo = Object.entries<Room>(rooms).reduce(
      (acc: RoomsInfo, [roomCode, room]) => {
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

  socket.on(CREATE_ROOM, ({ roomSetting }) => {
    const roomCode = createRoomCode();
    rooms[roomCode] = new Room({ hostId: socket.id, roomSetting });
    socket.emit(CREATE_SUCCESS, roomCode);
  });

  socket.on(JOIN_ROOM, ({ roomCode }: { roomCode: string }) => {
    if (!(roomCode in rooms)) return socket.emit(NOT_EXIST_ROOM_ERROR);

    const room = rooms[roomCode];
    if (room.isFull()) return socket.emit(FULL_ROOM_ERROR);

    socket.join(roomCode);
    const user = { id: socket.id, isReady: false, userName: socket.id };
    room.addUser(user);

    socket.emit(OTHER_USER_LIST, room.users, room);
    socket.broadcast.to(roomCode).emit(ENTER_OTHER_USER, user);
  });

  return { io, socket, rooms };
};

export default join;
