import React, { useEffect, useRef, useState } from "react";
import Socket from "@socket/index";
import useRoomCode from "@hooks/useRoomCode";
import Chat from "@components/ChatList/Chat";
import { ChatType } from "@src/@types";

const ChatList = ({ id }: { id: string }) => {
  const chatRef = useRef<HTMLInputElement>(null);
  const socket = useRef<any>(null);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const roomCode = useRoomCode();

  const addNewChat = (newChat: ChatType) => {
    setChatList((prev) => [...prev, newChat]);
  };

  useEffect(() => {
    if (socket.current) return;
    socket.current = Socket.chat({ addNewChat });
  }, []);

  const handleKeyDown = ({ code }: React.KeyboardEvent) => {
    if (code === "Enter") sendMessage();
  };

  const sendMessage = () => {
    const message = chatRef.current?.value;
    if (!message) return;
    socket.current.sendChat({ roomCode, message });
    addNewChat({ id, message });
    chatRef.current.value = "";
  };

  return (
    <>
      <div>
        {chatList.map((chat, index) => (
          <Chat
            message={chat.message}
            id={chat.id}
            isMyChat={chat.id === id}
            key={index}
          />
        ))}
      </div>
      <div>
        <input ref={chatRef} onKeyDown={handleKeyDown}></input>
        <button onClick={sendMessage}>전송</button>
      </div>
    </>
  );
};

export default ChatList;
