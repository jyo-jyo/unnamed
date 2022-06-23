import { Socket } from "socket.io";
import {
  GAME_TIME,
  NEXT_TURN,
  READY_ERROR,
  RECEIVE_CHAT,
  SEND_CHAT,
  START_GAME,
  START_MY_TURN,
  END_MY_TURN,
  TOGGLE_READY,
} from "../constants/socket";
import { SocketType } from "../loader/socket";
const game = ({ io, socket, rooms }: SocketType) => {
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
    io.to(room.users[0].id).emit(START_MY_TURN, { answer: randomAnswer() });
    room.gameState.game = setTimeout(() => {
      nextTurn({ io, roomCode });
    }, GAME_TIME * 1000);
  });

  socket.on(SEND_CHAT, ({ roomCode, message }) => {
    const room = rooms[roomCode];
    socket.broadcast
      .to(roomCode)
      .emit(RECEIVE_CHAT, { id: socket.id, message });
    if (!room.gameState.isPlaying || message !== room.gameState.answer) return;
    // 정답일 경우
    nextTurn({ roomCode, io });
  });
  return { io, socket, rooms };
};

export default game;
