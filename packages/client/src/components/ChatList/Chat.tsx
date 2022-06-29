import React from "react";

const Chat = ({
  message,
  id,
  isMyChat,
}: {
  message: string;
  id: string;
  isMyChat: boolean;
}) => {
  return (
    <div>
      <p>{id}</p>
      <span>{message}</span>
    </div>
  );
};

export default Chat;
