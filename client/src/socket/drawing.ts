import { Socket } from "socket.io-client";
import {
  DRAWING,
  OTHER_DRAWING,
  START_MY_TURN,
  END_MY_TURN,
} from "../constants/socket";

const drawing = (socket: Socket) => (closure: any) => {
  const { otherDrawing, startMyTurn, endMyTurn } = closure;

  socket.on(OTHER_DRAWING, (drawingData) => {
    otherDrawing(drawingData);
  });

  socket.on(START_MY_TURN, () => {
    startMyTurn();
  });
  socket.on(END_MY_TURN, () => {
    endMyTurn();
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
    socket.off(OTHER_DRAWING);
    socket.off(START_MY_TURN);
    socket.off(END_MY_TURN);
  };

  return { drawing, disconnecting };
};

export default drawing;
