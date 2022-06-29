import React from "react";
import { User } from "common";
import { UserProfileBox } from "./UserList.style";
const UserList = ({
  users,
  hostId,
  isPlaying,
}: {
  users: User[];
  hostId: string | undefined | null;
  isPlaying: boolean | undefined;
}) => {
  return (
    <>
      {users.map(({ id, isReady, userName }, index) => (
        <UserProfileBox isReady={isReady} key={index}>
          <span>{userName}</span>
          {!isPlaying && hostId !== id && (
            <span>{isReady ? "준비완" : "노준비"}</span>
          )}
        </UserProfileBox>
      ))}
    </>
  );
};

export default UserList;
