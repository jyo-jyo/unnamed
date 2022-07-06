import { Socket } from "socket.io-client";
import { EXIT_ROOM, READY_ERROR, START_GAME, TOGGLE_READY } from "common";
import { RoomProps } from "common";

const waiting =
  (socket: Socket) =>
  (functions: { setUsers: Function; setRoom: Function }) => {
    const { setUsers, setRoom } = functions;

    socket.on(TOGGLE_READY, (users) => {
      setUsers(users);
    });

    socket.on(READY_ERROR, () => {
      alert(READY_ERROR);
    });

    socket.on(START_GAME, () => {
      setRoom((prev: RoomProps) => {
        const room = Object.assign({}, prev);
        room.gameState.isPlaying = true;
        return room;
      });
    });

    const ready = (roomCode: string, isReady: boolean) =>
      socket.emit(TOGGLE_READY, { roomCode, isReady });

    const startGame = (roomCode: string) =>
      socket.emit(START_GAME, { roomCode });

    const exitRoom = (roomCode: string) => {
      socket.emit(EXIT_ROOM, { roomCode });
    };

    const disconnecting = () => {
      socket.off(TOGGLE_READY);
    };

    return { ready, exitRoom, startGame, disconnecting };
  };

export default waiting;
