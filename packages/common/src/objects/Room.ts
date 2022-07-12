import { RoomInfo, RoomSetting, User } from "src/types";

function Room({
  hostId,
  roomSetting,
}: {
  hostId: string;
  roomSetting: RoomSetting;
}) {
  this.hostId = hostId;
  this.users = [];
  this.gameState = {
    isPlaying: false,
    game: null,
    answer: "",
    currOrder: 0,
    currRound: 0,
  };
  this.roomSetting = roomSetting;
}

Room.prototype = {
  constructor: Room,

  getNumOfUser: function (): number {
    return this.users.length;
  },
  isFull: function (): boolean {
    return this.gameState.maximumOfUser <= this.getNumOfUser();
  },
  isDone: function (): boolean {
    return this.gameState.currRound > this.roomSetting.totalRound;
  },

  isPlaying: function (): boolean {
    return this.gameState.isPlaying;
  },

  isCorrect: function (message): boolean {
    return this.gameState.answer === message;
  },

  isHost: function (socketId): boolean {
    return socketId === this.hostId;
  },

  clearGame: function (): void {
    if (this.gameState.game) clearTimeout(this.gameState.game);
  },

  nextTurn: function (val: number): void {
    this.clearGame();
    this.gameState.currOrder += val;
    if (this.gameState.currOrder === this.getNumOfUser())
      this.gameState.currOrder = 0;
    this.gameState.currRound++;
  },

  startGame: function ({ answer, game }): void {
    this.gameState.answer = answer;
    this.gameState.isPlaying = true;
    this.gameState.game = game;
  },

  initGameState: function (): void {
    this.clearGame();
    this.gameState = {
      isPlaying: false,
      game: null,
      answer: "",
      currOrder: 0,
      currRound: 0,
    };
  },

  changeHost: function (): void {
    this.hostId = this.users[0].socketId;
  },

  addUser: function (user: User): void {
    this.users.push(user);
  },

  deleteUser: function ({ index }): void {
    this.users = this.users.filter((_, idx) => idx !== index);
  },

  getIndexOfUser: function (socketId: string): number {
    for (let i = 0; i < this.getNumOfUser(); i++) {
      if (this.users[i].socketId === socketId) return i;
    }
    return -1;
  },

  getRoomInfo: function (): RoomInfo {
    return {
      roomName: this.roomSetting.roomName,
      numberOfUser: this.getNumOfUser(),
      maximumOfUser: this.roomSetting.maximumOfUser,
      totalRound: this.roomSetting.totalRound,
      isPlaying: this.isPlaying(),
      isLocked: this.roomSetting.isLocked,
    };
  },

  toggleReady: function ({ socketId, isReady }): void {
    const index = this.getIndexOfUser(socketId);
    if (index < 0) return;
    this.users[index].isReady = isReady;
  },

  isReady: function (): boolean {
    return this.users.some(({ socketId, isReady }) => {
      if (!this.isHost(socketId) && !isReady) return true;
      return false;
    });
  },

  getCurrUserId: function (): string {
    return this.users[this.getCurrOrder()].socketId;
  },

  getCurrOrder: function (): number {
    return this.gameState.currOrder;
  },

  getCurrRound: function (): number {
    return this.gameState.currRound;
  },

  getHostId: function (): string {
    return this.hostId;
  },
};

export { Room };

// export const Room = (function () {
//   function Room({
//     hostId,
//     roomSetting,
//   }: {
//     hostId: string;
//     roomSetting: RoomSetting;
//   }) {
//     this.hostId = hostId;
//     this.users = [];
//     this.gameState = {
//       isPlaying: false,
//       game: null,
//       answer: "",
//       currOrder: 0,
//       currRound: 0,
//     };
//     this.roomSetting = roomSetting;
//   }
//   Room.prototype.getNumOfUser = function (): number {
//     return this.users.length;
//   };

//   Room.prototype.isFull = function (): boolean {
//     return this.gameState.maximumOfUser <= this.getNumOfUser();
//   };

//   Room.prototype.isDone = function (): boolean {
//     return this.gameState.currRound > this.roomSetting.totalRound;
//   };

//   Room.prototype.isPlaying = function (): boolean {
//     return this.gameState.isPlaying;
//   };

//   Room.prototype.isCorrect = function (message): boolean {
//     return this.gameState.answer === message;
//   };

//   Room.prototype.isHost = function (socketId): boolean {
//     return socketId === this.hostId;
//   };

//   Room.prototype.nextTurn = function (val): void {
//     this.clearGame();
//     this.gameState.currOrder += val;
//     if (this.gameState.currOrder === this.getNumOfUser())
//       this.gameState.currOrder = 0;
//     ++this.gameState.currRound;
//   };

//   Room.prototype.startGame = function ({ answer, game }): void {
//     this.gameState.answer = answer;
//     this.gameState.isPlaying = true;
//     this.gameState.game = game;
//   };

//   Room.prototype.clearGame = function (): void {
//     if (this.gameState.game) clearTimeout(this.gameState.game);
//   };

//   Room.prototype.initGameState = function (): void {
//     this.clearGame();
//     this.gameState = {
//       isPlaying: false,
//       game: null,
//       answer: "",
//       currOrder: 0,
//       currRound: 0,
//     };
//   };

//   Room.prototype.addUser = function (user: User): void {
//     this.users.push(user);
//   };
//   Room.prototype.deleteUser = function ({ index }): void {
//     this.users = this.users.filter((_, idx) => idx !== index);
//   };

//   Room.prototype.getIndexOfUser = function (socketId): number {
//     for (let i = 0; i < this.getNumOfUser(); i++) {
//       if (this.users[i].id === socketId) return i;
//     }
//     return -1;
//   };

//   Room.prototype.getRoomInfo = function (): RoomInfo {
//     return {
//       roomName: this.roomSetting.roomName,
//       numberOfUser: this.getNumOfUser(),
//       maximumOfUser: this.roomSetting.maximumOfUser,
//       totalRound: this.roomSetting.totalRound,
//       isPlaying: this.isPlaying(),
//       isLocked: this.roomSetting.isLocked,
//     };
//   };

//   Room.prototype.toggleReady = function ({ socketId, isReady }): void {
//     const index = this.getIndexOfUser(socketId);
//     if (index < 0) return;
//     this.users[index].isReady = isReady;
//   };

//   Room.prototype.isReady = function (): boolean {
//     return this.users.some(({ id, isReady }) => {
//       if (!this.isHost(id) && !isReady) return true;
//       return false;
//     });
//   };

//   Room.prototype.getCurrUserId = function (): string {
//     return this.users[this.gameState.currOrder].id;
//   };

//   Room.prototype.getCurrOrder = function (): number {
//     return this.gameState.currOrder;
//   };

//   Room.prototype.getCurrRound = function (): number {
//     return this.gameState.currRound;
//   };

//   return Room;
// })();

// const Room = ({
//   hostId,
//   roomSetting,
// }: {
//   hostId: string;
//   roomSetting: RoomSetting;
// }) => {
//   const initValueOfGameState = () => {
//     return {
//       isPlaying: false,
//       game: null,
//       answer: "",
//       currOrder: 0,
//       currRound: 0,
//     };
//   };

//   const room: type = {
//     hostId,
//     users: [],
//     gameState: initValueOfGameState(),
//     roomSetting,
//   };

//   //get
//   const getRoom = () => room;
//   const getRoomSetting = () => room.roomSetting;
//   const getGameState = () => room.gameState;
//   const getUsers = () => room.users;
//   const getMaximumOfUser = () => room.roomSetting.maximumOfUser;
//   const getCurrRound = () => room.gameState.currRound;
//   const getTotalRound = () => room.roomSetting.totalRound;
//   const getNumOfUsers = () => room.users.length;

//   const isFull = () => getNumOfUsers() >= getMaximumOfUser();
//   const isDone = () => getCurrRound() === getTotalRound();
//   const isPlaying = () => room.gameState.isPlaying;

//   const nextTurn = () => {
//     if (++room.gameState.currOrder === getNumOfUsers())
//       room.gameState.currOrder = 0;
//     ++room.gameState.currRound;
//   };

//   const initGameState = () => {
//     room.gameState = initValueOfGameState();
//   };

//   return {
//     getRoom,
//     getRoomSetting,
//     getGameState,
//     getUsers,

//     getMaximumOfUser,
//     getCurrRound,
//     getTotalRound,
//     getNumOfUsers,

//     isFull,
//     isDone,
//     isPlaying,
//     nextTurn,
//     initGameState,
//   };
// };

// export default Room;
