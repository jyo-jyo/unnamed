import React, { useEffect, useRef, useState } from "react";
import { BoardContainer } from "./Board.style";

const Board = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.height = canvas.parentElement?.offsetHeight ?? 500;
    canvas.width = canvas.parentElement?.offsetWidth ?? 500;
    const context = canvas.getContext("2d");
    if (context) {
      contextRef.current = context;
    }
  }, []);

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawing = ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;
    if (ctx) {
      if (!isDrawing) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    }
  };

  return (
    <BoardContainer>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={drawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>
    </BoardContainer>
  );
};

export default Board;
