import io from "socket.io-client";

import { BACK_BASE_URL } from "../constants/constant";
import room from "./room";
import create from "./create";

const Socket = () => {
  const socket = io(BACK_BASE_URL, {
    transports: ["websocket"],
    upgrade: false,
    forceNew: true,
  });

  socket.disconnect();

  return {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    create: create(socket),
    room: room(socket),
  };
};
export default Socket();
