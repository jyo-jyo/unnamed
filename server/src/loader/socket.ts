import { Socket, Server } from "socket.io";

import { FRONT_BASE_URL } from "@constants/constant";
import { DRAWING, OTHER_DRAWING } from "@constants/socket";
import game from "@socket/game";
import join from "@socket/room";
import pipe from "@utils/pipe";
import { RoomType } from "@src/@types";

const socketLoader = (server: any, app: any): any => {
  const rooms = <RoomType>{};
  const io = new Server(server, {
    cors: {
      origin: FRONT_BASE_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket): void => {
    console.log("socket connection!!", socket.id);

    pipe(join, game)({ io, socket, rooms });

    socket.on(DRAWING, ({ roomCode, drawingData }) => {
      socket.broadcast.to(roomCode).emit(OTHER_DRAWING, drawingData);
    });

    socket.on("disconnect", () => {
      console.log("disconnect socket!!" + socket.id);
    });
  });

  return app;
};

export default socketLoader;
