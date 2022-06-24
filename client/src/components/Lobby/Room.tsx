import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RoomContainer,
  RoomTitleBox,
  RoomInfoBox,
} from "@components/Lobby/Room.style";
import { RoomInfo } from "@pages/Lobby";
const Room = ({
  roomCode,
  roomInfo,
}: {
  roomCode: string;
  roomInfo: RoomInfo;
}) => {
  const {
    roomName,
    numberOfUser,
    maximumOfUser,
    totalRound,
    isPlaying,
    isLocked,
  } = roomInfo;
  const [isAccessible, setIsAccessible] = useState<boolean>(true);
  const nav = useNavigate();

  useEffect(() => {
    if (isPlaying || numberOfUser >= maximumOfUser) setIsAccessible(false);
    else setIsAccessible(true);
  }, [isPlaying, numberOfUser, maximumOfUser]);

  const joining = () => {
    nav(`room:${roomCode}`);
  };

  return (
    <RoomContainer isAccessible={isAccessible} onClick={joining}>
      <RoomTitleBox>
        <span>{roomName}</span>
        {isLocked && <button>Locked</button>}
      </RoomTitleBox>
      <hr />
      <RoomInfoBox>
        <div>
          <span>인원</span>
          <span>
            {numberOfUser}/{maximumOfUser}
          </span>
        </div>
        <div>
          <span>라운드</span>
          <span>{totalRound}</span>
        </div>
      </RoomInfoBox>
    </RoomContainer>
  );
};

export default Room;
