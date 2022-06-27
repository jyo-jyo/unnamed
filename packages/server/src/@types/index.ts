import { Socket } from "socket.io";
export interface RoomInfo {
  roomName: string;
  numberOfUser: number;
  maximumOfUser: number;
  totalRound: number;
  isPlaying: boolean;
  isLocked: boolean;
}
export interface RoomInfoType {
  [roomCode: string]: RoomInfo;
}
export interface UserType {
  id: string;
  isReady: boolean;
  userName: string;
}
export interface RoomType {
  [roomCode: string]: {
    hostId: string | null;
    users: UserType[];
    gameState: {
      isPlaying: boolean;
      game: NodeJS.Timeout | null;
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
  };
}

export interface SocketType {
  io: any;
  socket: Socket;
  rooms: RoomType;
}
