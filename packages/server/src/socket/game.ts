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
  EXIT_ROOM,
  NOT_EXIST_ROOM_ERROR,
  UNDERSTAFFED_ERROR,
  EXIT_USER,
  BECOME_HOST,
} from "common";

import { SocketProps } from "@types";

const game = ({ io, socket, rooms }: SocketProps) => {
  const randomAnswer = () => {
    // TODO: random keyword
    return "배고파";
  };

  const endGame = ({ roomCode, room }) => {
    // TODO: 게임 종료 점수 전송
    io.to(roomCode).emit(END_GAME);
    room.initGameState();
    return;
  };

  const nextTurn = ({ roomCode }) => {
    const room = rooms[roomCode];
    room.nextTurn(1);
    if (room.isDone()) return endGame({ roomCode, room });
    io.to(roomCode).emit(NEXT_TURN, {
      restTime: GAME_TIME,
      currOrder: room.getCurrOrder(),
      currRound: room.getCurrRound(),
    });
    const answer = randomAnswer();
    io.to(room.getCurrUserId()).emit(START_MY_TURN, { answer });
    room.startGame({
      answer,
      game: setTimeout(() => {
        timeout({ roomCode });
      }, GAME_TIME * 1000),
    });
  };

  const timeout = ({ roomCode }) => {
    const room = rooms[roomCode];
    io.to(room.getCurrUserId()).emit(END_MY_TURN);
    // 다음 턴 처리
    nextTurn({ roomCode });
  };

  socket.on(TOGGLE_READY, ({ roomCode, isReady }) => {
    const room = rooms[roomCode];
    room.toggleReady({ socketId: socket.id, isReady });
    io.to(roomCode).emit(TOGGLE_READY, room.users);
  });

  socket.on(START_GAME, ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room.isReady()) return socket.emit(READY_ERROR);
    if (room.getNumOfUser() === 1) return socket.emit(UNDERSTAFFED_ERROR);
    const answer = randomAnswer();
    room.startGame({
      answer,
      game: setTimeout(() => {
        timeout({ roomCode });
      }, GAME_TIME * 1000),
    });
    io.to(roomCode).emit(START_GAME);
    io.to(room.getCurrUserId()).emit(START_MY_TURN, { answer });
  });

  socket.on(SEND_CHAT, ({ roomCode, message }) => {
    const room = rooms[roomCode];
    socket.broadcast
      .to(roomCode)
      .emit(RECEIVE_CHAT, { id: socket.id, message });
    if (!room.isPlaying() || !room.isCorrect(message)) return;
    // 정답일 경우

    timeout({ roomCode });
  });

  socket.on(EXIT_ROOM, ({ roomCode }) => {
    if (!(roomCode in rooms)) return socket.emit(NOT_EXIST_ROOM_ERROR);
    // TODO: 방장권한, 게임이 진행 중인 경우...
    const room = rooms[roomCode];
    const currOrder = room.getCurrOrder();
    const myOrder = room.getIndexOfUser(socket.id);
    socket.leave(roomCode);
    room.deleteUser({ index: myOrder });
    if (room.getNumOfUser() === 0) {
      room.clearGame();
      delete rooms[roomCode];
      return;
    }
    // 방장권한
    if (room.isHost(socket.id)) {
      room.changeHost();
      io.to(room.getHostId()).emit(BECOME_HOST);
    }
    // 게임이 진행 중인 경우...
    if (room.isPlaying()) {
      if (room.getNumOfUser() === 1) {
        endGame({ roomCode, room });
      } else {
        if (currOrder > myOrder) {
          room.gameState.currOrder--;
        } else if (currOrder < myOrder) {
          // room.gameState.currOrder++;
        } else {
          room.nextTurn(0);
          if (room.isDone()) return endGame({ roomCode, room });
          nextTurn({ roomCode });
        }
      }
    }
    socket.broadcast.to(roomCode).emit(EXIT_USER, socket.id);
  });

  return { io, socket, rooms };
};

export default game;
