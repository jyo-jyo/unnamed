export interface Room {
  hostId: string | null;
  users: User[];
  gameState: {
    isPlaying: boolean;
    game: ReturnType<typeof setTimeout> | null;
    answer: string;
    currOrder: number;
    currRound: number;
  };
  roomSettings: {
    roomName: string;
    maximumOfUser: number;
    totalRound: number;
    isLocked: boolean;
    password: string;
  };
}

export interface Rooms {
  [roomCode: string]: Room;
}

export interface RoomInfo {
  roomName: string;
  numberOfUser: number;
  maximumOfUser: number;
  totalRound: number;
  isPlaying: boolean;
  isLocked: boolean;
}

export interface RoomsInfo {
  [roomCode: string]: RoomInfo;
}

export interface User {
  id: string;
  isReady: boolean;
  userName: string;
}
