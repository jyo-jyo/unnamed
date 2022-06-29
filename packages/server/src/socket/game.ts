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
  EXIST_ROOM_ERROR,
  EXIT_USER,
} from "common";
import { SocketProps } from "@src/@types";
import { User } from "common";

const game = ({ io, socket, rooms }: SocketProps) => {
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
      currRound: 1,
    };
  };

  const endGame = ({ roomCode, room }) => {
    // TODO: 게임 종료 점수 전송
    io.to(roomCode).emit(END_GAME);
    room.gameState = initGameState();
    return;
  };

  const nextTurn = ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room.gameState.currOrder === room.users.length)
      room.gameState.currOrder = 0;
    io.to(roomCode).emit(NEXT_TURN, {
      restTime: GAME_TIME,
      currOrder: room.gameState.currOrder,
      currRound: room.gameState.currRound,
    });
    const answer = randomAnswer();
    room.gameState.answer = answer;
    console.log(room.gameState.currOrder, room.users[room.gameState.currOrder]);
    io.to(room.users[room.gameState.currOrder].id).emit(START_MY_TURN, {
      answer,
    });
    room.gameState.game = setTimeout(() => {
      timeout({ roomCode });
    }, GAME_TIME * 1000);
  };

  const timeout = ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room.gameState.game) clearTimeout(room.gameState.game);
    // game 종료 처리
    if (++room.gameState.currRound > room.roomSettings.totalRound) {
      endGame({ roomCode, room });
      return;
    }
    // 다음 턴 처리
    io.to(room.users[room.gameState.currOrder++].id).emit(END_MY_TURN);
    nextTurn({ roomCode });
  };

  const indexOfUsers = (id: string, users: User[]) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) return i;
    }
    return -1;
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
      timeout({ roomCode });
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
    timeout({ roomCode });
  });

  socket.on(EXIT_ROOM, ({ roomCode }) => {
    if (!(roomCode in rooms)) return socket.emit(EXIST_ROOM_ERROR);
    // TODO: 방장권한, 게임이 진행 중인 경우...
    const room = rooms[roomCode];
    const { currOrder } = room.gameState;
    const myOrder = indexOfUsers(socket.id, room.users);
    socket.leave(roomCode);
    room.users = room.users.filter(({ id }) => id !== socket.id);
    if (room.users.length === 0) {
      if (rooms[roomCode].gameState.game)
        clearTimeout(rooms[roomCode].gameState.game);
      delete rooms[roomCode];
      return;
    }
    // 게임이 진행 중인 경우...
    if (room.gameState.isPlaying) {
      if (currOrder > myOrder) {
        room.gameState.currOrder--;
      } else if (currOrder < myOrder) {
        // room.gameState.currOrder++;
      } else {
        if (room.gameState.game) clearTimeout(room.gameState.game);
        if (++room.gameState.currRound > room.roomSettings.totalRound) {
          endGame({ room, roomCode });
          return;
        }
        nextTurn({ roomCode });
      }
      socket.broadcast.to(roomCode).emit(EXIT_USER, socket.id);
    }
  });

  return { io, socket, rooms };
};

export default game;
