import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BoardContainer } from "./Board.style";
import Socket from "../../socket";

const Board = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const socket = useRef<any>();
  const roomCode = useParams().roomCode?.slice(1);

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawing = ({
    isDrawing,
    offsetX,
    offsetY,
  }: {
    isDrawing: boolean;
    offsetX: number;
    offsetY: number;
  }) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    if (!isDrawing) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };
  useEffect(() => {
    if (socket.current) return;
    socket.current = Socket.drawing({
      otherDrawing: drawing,
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.height = canvas.parentElement?.offsetHeight ?? 250;
    canvas.width = canvas.parentElement?.offsetWidth ?? 250;
    const context = canvas.getContext("2d");
    if (context) {
      contextRef.current = context;
    }
    return () => {
      socket.current?.disconnecting();
    };
  }, [canvasRef.current]);

  return socket.current ? (
    <BoardContainer>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={({ nativeEvent }: { nativeEvent: MouseEvent }) =>
          isMyTurn &&
          socket.current.drawing({
            roomCode,
            drawingData: {
              isDrawing,
              offsetX: nativeEvent.offsetX,
              offsetY: nativeEvent.offsetY,
            },
          })
        }
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
    </BoardContainer>
  ) : (
    <></>
  );
};

export default Board;
