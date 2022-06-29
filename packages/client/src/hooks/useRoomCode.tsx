import { useParams } from "react-router-dom";

const useRoomCode = () => {
  const { roomCode } = useParams();
  return roomCode?.slice(1);
};

export default useRoomCode;
