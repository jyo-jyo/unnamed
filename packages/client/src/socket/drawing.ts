import { Socket } from "socket.io-client";

import {
  DRAWING,
  OTHER_DRAWING,
  START_MY_TURN,
  END_MY_TURN,
  START_GAME,
  END_GAME,
} from "common";

const drawing = (socket: Socket) => (closure: any) => {
  const { otherDrawing, startMyTurn, endMyTurn } = closure;

  socket.on(OTHER_DRAWING, (drawingData) => {
    otherDrawing(drawingData);
  });

  socket.on(START_MY_TURN, ({ answer }) => {
    alert(answer);
    startMyTurn();
  });
  socket.on(END_MY_TURN, () => {
    endMyTurn();
  });

  socket.on(START_GAME, () => {
    endMyTurn();
  });

  socket.on(END_GAME, () => {
    alert(END_GAME);
  });

  const drawing = ({
    roomCode,
    drawingData,
  }: {
    roomCode: string;
    drawingData: {
      isDrawing: boolean;
      offsetX: number;
      offsetY: number;
    };
  }) => socket.emit(DRAWING, { roomCode, drawingData });

  const disconnecting = () => {
    socket.off(START_GAME);
    socket.off(OTHER_DRAWING);
    socket.off(START_MY_TURN);
    socket.off(END_MY_TURN);
  };

  return { drawing, disconnecting };
};

export default drawing;
