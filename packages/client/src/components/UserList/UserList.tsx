import React from "react";
import { User } from "common";
import { UserProfileBox } from "./UserList.style";
const UserList = ({
  users,
  hostId,
  isPlaying,
}: {
  users: User[];
  hostId?: string;
  isPlaying?: boolean;
}) => {
  return (
    <>
      {users.map(({ socketId, isReady, userName }, index) => (
        <UserProfileBox isReady={isReady} key={index}>
          <span>{userName}</span>
          {!isPlaying && hostId !== socketId && (
            <span>{isReady ? "준비완" : "노준비"}</span>
          )}
        </UserProfileBox>
      ))}
    </>
  );
};

export default UserList;
