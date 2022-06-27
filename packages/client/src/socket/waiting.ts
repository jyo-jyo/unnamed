import { Socket } from "socket.io-client";
import { EXIT_ROOM, READY_ERROR, START_GAME, TOGGLE_READY } from "common";
import { RoomType } from "@src/@types";

const waiting = (socket: Socket) => (closure: any) => {
  const { setUsers, setRoomInfo } = closure;

  socket.on(TOGGLE_READY, (users) => {
    setUsers(users);
  });

  socket.on(READY_ERROR, () => {
    alert(READY_ERROR);
  });

  socket.on(START_GAME, () => {
    setRoomInfo((prev: RoomType) => {
      const roomInfo = Object.assign({}, prev);
      roomInfo.gameState.isPlaying = true;
      return roomInfo;
    });
  });

  const ready = (roomCode: string, isReady: boolean) =>
    socket.emit(TOGGLE_READY, { roomCode, isReady });

  const startGame = (roomCode: string) => socket.emit(START_GAME, { roomCode });

  const exitRoom = (roomCode: string) => {
    socket.emit(EXIT_ROOM, { roomCode });
  };

  const disconnecting = () => {
    socket.off(TOGGLE_READY);
  };

  return { ready, exitRoom, startGame, disconnecting };
};

export default waiting;
