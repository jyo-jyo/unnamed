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
          <p>{userName}</p>
          {hostId !== id ? <p>{isReady ? "준비완" : "노준비"}</p> : <></>}
        </UserProfileBox>
      ))}
    </>
  );
};

export default UserList;
