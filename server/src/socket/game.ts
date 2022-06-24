import { Socket } from "socket.io";
import {
  GAME_TIME,
  NEXT_TURN,
  READY_ERROR,
  RECEIVE_CHAT,
  SEND_CHAT,
  START_GAME,
  END_GAME,
  START_MY_TURN,
  END_MY_TURN,
  TOGGLE_READY,
} from "@constants/socket";
import { SocketType } from "@loader/socket";
const game = ({ io, socket, rooms }: SocketType) => {
  const randomAnswer = () => {
    // TODO: random keyword
    return "배고파";
  };

  const initGameState = () => {
    return {
      isPlaying: false,
      game: null,
      answer: "",
      currOrder: 0,
      currRound: 0,
    };
  };

  const nextTurn = ({ roomCode }: { roomCode: string }) => {
    const room = rooms[roomCode];
    if (room.gameState.game) clearTimeout(room.gameState.game);
    if (++room.gameState.currRound > room.roomSettings.totalRound) {
      // TODO: 게임 종료 점수 전송
      io.to(roomCode).emit(END_GAME);
      room.gameState = initGameState();
    }
    io.to(room.users[room.gameState.currOrder].id).emit(END_MY_TURN);
    if (++room.gameState.currOrder === room.roomSettings.maximumOfUser)
      room.gameState.currOrder = 0;

    io.to(roomCode).emit(NEXT_TURN, {
      restTime: GAME_TIME,
      currOrder: room.gameState.currOrder,
      currRound: room.gameState.currRound,
    });
    const answer = randomAnswer();
    room.gameState.answer = answer;
    io.to(room.users[room.gameState.currOrder].id).emit(START_MY_TURN, {
      answer,
    });
    room.gameState.game = setTimeout(() => {
      nextTurn({ roomCode });
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
    const answer = randomAnswer();
    room.gameState.answer = answer;
    room.gameState.isPlaying = true;
    room.gameState.game = setTimeout(() => {
      nextTurn({ roomCode });
    }, GAME_TIME * 1000);
    io.to(roomCode).emit(START_GAME);
    io.to(room.users[0].id).emit(START_MY_TURN, { answer });
  });

  socket.on(SEND_CHAT, ({ roomCode, message }) => {
    const room = rooms[roomCode];
    socket.broadcast
      .to(roomCode)
      .emit(RECEIVE_CHAT, { id: socket.id, message });
    if (!room.gameState.isPlaying || message !== room.gameState.answer) return;
    // 정답일 경우
    nextTurn({ roomCode });
  });
  return { io, socket, rooms };
};

export default game;
