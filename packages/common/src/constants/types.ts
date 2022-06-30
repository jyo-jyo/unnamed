export interface User {
  socketId: string;
  userName: string;
  isReady: boolean;
}
export interface RoomSetting {
  roomName: string;
  maximumOfUser: number;
  totalRound: number;
  isLocked: boolean;
  password: string;
}

export interface RoomProps {
  hostId: string | null;
  users: User[];
  gameState: {
    isPlaying: boolean;
    game: ReturnType<typeof setTimeout> | null;
    answer: string;
    currOrder: number;
    currRound: number;
  };
  roomSetting: RoomSetting;
}

export interface Rooms {
  [roomCode: string]: RoomProps;
}

export interface RoomSettings {
  roomName: string;
  maximumOfUser: number;
  totalRound: number;
  isLocked: boolean;
  password: string;
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
