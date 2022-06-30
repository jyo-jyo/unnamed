import React, { useEffect, useRef, useState } from "react";
import Socket from "@socket";
import { useRoomCode } from "@src/hooks";
import { Chat } from "@src/components";
import { ChatType } from "@types";

const ChatList = () => {
  const chatRef = useRef<HTMLInputElement>(null);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const roomCode = useRoomCode();
  const id = Socket.getSID();
  const socket = useRef<any>(null);

  const addNewChat = (newChat: ChatType) => {
    setChatList((prev) => [...prev, newChat]);
  };

  useEffect(() => {
    socket.current = Socket.chat({ addNewChat });
    return () => {
      socket.current.disconnecting();
    };
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
