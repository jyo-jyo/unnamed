import io from "socket.io-client";
import { BACK_BASE_URL } from "../constants/constant";
import join from "./join";
import rooms from "./rooms";
import drawing from "./drawing";
import create from "./create";
import chat from "./chat";

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
    getSID: () => socket.id,
    create: create(socket),
    rooms: rooms(socket),
    join: join(socket),
    drawing: drawing(socket),
    chat: chat(socket),
  };
};
export default Socket();
