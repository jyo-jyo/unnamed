import { Socket } from "socket.io-client";
import {
  NOT_EXIST_ROOM_ERROR,
  FULL_ROOM_ERROR,
  JOIN_ROOM,
  OTHER_USER_LIST,
  ENTER_OTHER_USER,
  TOGGLE_READY,
  EXIT_USER,
  START_GAME,
  READY_ERROR,
} from "common";

import { User, Room } from "common";

const join =
  (socket: Socket) =>
  (functions: { setUsers: Function; setRoom: Function; back: Function }) => {
    const { setUsers, setRoom, back } = functions;

    socket.on(NOT_EXIST_ROOM_ERROR, () => {
      back();
      alert(NOT_EXIST_ROOM_ERROR);
    });

    socket.on(FULL_ROOM_ERROR, () => {
      back();
      alert(FULL_ROOM_ERROR);
    });

    socket.on(ENTER_OTHER_USER, (user) => {
      setUsers((prev: User[]) => [...prev, user]);
    });

    socket.on(
      OTHER_USER_LIST,
      ({ users, room }: { users: User[]; room: typeof Room }) => {
        setUsers(users);
        setRoom(room);
      }
    );

    socket.on(EXIT_USER, (exitId) => {
      setUsers((prev: User[]) => prev.filter(({ id }) => id !== exitId));
    });

    socket.on(TOGGLE_READY, (users) => {
      setUsers(users);
    });

    socket.on(READY_ERROR, () => {
      alert(READY_ERROR);
    });

    const joinRoom = (roomCode: string) => socket.emit(JOIN_ROOM, { roomCode });

    const ready = (roomCode: string, isReady: boolean) =>
      socket.emit(TOGGLE_READY, { roomCode, isReady });

    const startGame = (roomCode: string) =>
      socket.emit(START_GAME, { roomCode });

    const disconnecting = () => {
      socket.off(NOT_EXIST_ROOM_ERROR);
      socket.off(FULL_ROOM_ERROR);
      socket.off(OTHER_USER_LIST);
      socket.off(ENTER_OTHER_USER);
      socket.off(EXIT_USER);
      socket.off(TOGGLE_READY);
      socket.off(READY_ERROR);
    };

    return { joinRoom, ready, startGame, disconnecting };
  };

export default join;
