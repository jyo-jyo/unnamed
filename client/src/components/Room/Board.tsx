import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BoardContainer } from "./Board.style";
import Socket from "../../socket";

const Board = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true);
  const { roomCode } = useParams();
  const socket = useRef<any>(null);

  const startMyTurn = () => setIsMyTurn(true);
  const endMyTurn = () => setIsMyTurn(false);

  useEffect(() => {
    if (socket.current) return;
    socket.current = Socket.drawing({
      otherDrawing: drawing,
      startMyTurn,
      endMyTurn,
    });
  }, []);

  const startDrawing = () => {
    if (!isMyTurn) return;
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    if (!isMyTurn) return;
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
    console.log(ctx);
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
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.height = canvas.parentElement?.offsetHeight ?? 250;
    canvas.width = canvas.parentElement?.offsetWidth ?? 250;
    const context = canvas.getContext("2d");
    if (context) {
      contextRef.current = context;
    }
  }, [canvasRef.current]);

  return (
    <BoardContainer>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={({ nativeEvent }: { nativeEvent: MouseEvent }) => {
          if (!isMyTurn) return;
          drawing({
            isDrawing,
            offsetX: nativeEvent.offsetX,
            offsetY: nativeEvent.offsetY,
          });
          socket.current.drawing({
            roomCode: roomCode?.slice(1),
            drawingData: {
              isDrawing,
              offsetX: nativeEvent.offsetX,
              offsetY: nativeEvent.offsetY,
            },
          });
        }}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
    </BoardContainer>
  );
};

export default Board;
