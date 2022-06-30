import { Socket, Server } from "socket.io";

import { FRONT_BASE_URL } from "@src/constants";
import { DRAWING, OTHER_DRAWING } from "common";
import { game, room } from "@src/socket";
import { pipe } from "@src/utils";
import { Rooms } from "common";

const socketLoader = (server: any, app: any): any => {
  const rooms = <Rooms>{};
  const io = new Server(server, {
    cors: {
      origin: FRONT_BASE_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket): void => {
    console.log("socket connection!!", socket.id);

    pipe(room, game)({ io, socket, rooms });

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
