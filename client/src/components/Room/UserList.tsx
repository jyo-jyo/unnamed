import React from "react";
import { UserType } from "../../pages/Room";
import { UserProfileBox } from "./UserList.style";
const UserList = ({
  users,
  hostId,
}: {
  users: UserType[];
  hostId: string | undefined | null;
}) => {
  return (
    <>
      {users.map(({ id, isReady, userName }, index) => (
        <UserProfileBox isReady={isReady} key={index}>
          <span>{userName}</span>
          {hostId !== id ? <span>{isReady ? "준비완" : "노준비"}</span> : <></>}
        </UserProfileBox>
      ))}
    </>
  );
};

export default UserList;
