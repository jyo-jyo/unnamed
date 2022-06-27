import React from "react";
import { UserType } from "@src/@types";
import { UserProfileBox } from "./UserList.style";
const UserList = ({
  users,
  hostId,
  isPlaying,
}: {
  users: UserType[];
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
