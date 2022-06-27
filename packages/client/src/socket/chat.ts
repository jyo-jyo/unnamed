import { Socket } from "socket.io-client";
import { RECEIVE_CHAT, SEND_CHAT } from "common";

const chat = (socket: Socket) => (closure: any) => {
  const { addNewChat } = closure;

  socket.on(RECEIVE_CHAT, (chatData) => {
    addNewChat(chatData);
  });

  const sendChat = ({
    message,
    roomCode,
  }: {
    message: string;
    roomCode: string;
  }) => socket.emit(SEND_CHAT, { roomCode, message });

  const disconnecting = () => {
    socket.off(RECEIVE_CHAT);
  };

  return { sendChat, disconnecting };
};

export default chat;
