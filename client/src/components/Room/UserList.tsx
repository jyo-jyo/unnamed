import React from "react";
import { UserType } from "../../pages/Room";
import { UserProfileBox } from "./UserList.style";
const UserList = ({ users }: { users: UserType[] }) => {
  return (
    <>
      {users.map(({ id, isReady, userName }, index) => (
        <UserProfileBox isReady={isReady} key={index}>
          <p>{userName}</p>
          <p>{isReady ? "준비완" : "노준비"}</p>
        </UserProfileBox>
      ))}
    </>
  );
};

export default UserList;
