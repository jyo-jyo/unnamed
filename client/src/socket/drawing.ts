import { Socket } from "socket.io-client";
import { DRAWING, OTHER_DRAWING } from "../constants/socket";

const drawing = (socket: Socket) => (closure: any) => {
  const { otherDrawing } = closure;

  socket.on(OTHER_DRAWING, (drawingData) => {
    otherDrawing(drawingData);
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
  };

  return { drawing, disconnecting };
};

export default drawing;
