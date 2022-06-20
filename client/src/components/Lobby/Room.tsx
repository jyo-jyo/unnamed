import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContainer, RoomTitleBox, RoomInfoBox } from "./Room.style";
import { RoomInfo } from "../../pages/Lobby";
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
        <text>{roomName}</text>
        {isLocked && <button>Locked</button>}
      </RoomTitleBox>
      <hr />
      <RoomInfoBox>
        <div>
          <text>인원</text>
          <text>
            {numberOfUser}/{maximumOfUser}
          </text>
        </div>
        <div>
          <text>라운드</text>
          <text>{totalRound}</text>
        </div>
      </RoomInfoBox>
    </RoomContainer>
  );
};

export default Room;
