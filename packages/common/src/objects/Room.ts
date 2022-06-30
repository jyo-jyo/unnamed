import { RoomProps, RoomSetting, User } from "src/types";

export const Room = (function () {
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
  Room.prototype.getNumOfUser = function () {
    return this.users.length;
  };

  Room.prototype.isFull = function () {
    return this.gameState.maximumOfUser <= this.getNumOfUser();
  };

  Room.prototype.isDone = function () {
    return this.gameState.currRound > this.roomSetting.totalRound;
  };

  Room.prototype.isPlaying = function () {
    return this.gameState.isPlaying;
  };

  Room.prototype.isCorrect = function (message) {
    return this.gameState.answer === message;
  };

  Room.prototype.nextTurn = function (val) {
    this.clearGame();
    this.gameState.currOrder += val;
    if (this.gameState.currOrder === this.getNumOfUser())
      this.gameState.currOrder = 0;
    ++this.gameState.currRound;
  };

  Room.prototype.startGame = function ({ answer, game }) {
    this.gameState.answer = answer;
    this.gameState.isPlaying = true;
    this.gameState.game = game;
  };

  Room.prototype.clearGame = function () {
    if (this.gameState.game) clearTimeout(this.gameState.game);
  };

  Room.prototype.initGameState = function () {
    this.clearGame();
    this.gameState = {
      isPlaying: false,
      game: null,
      answer: "",
      currOrder: 0,
      currRound: 0,
    };
  };

  Room.prototype.addUser = function (user: User) {
    this.users.push(user);
  };
  Room.prototype.deleteUser = function ({ index }) {
    this.users = this.users.filter((_, idx) => idx !== index);
  };

  Room.prototype.getIndexOfUser = function (socketId) {
    for (let i = 0; i < this.getNumOfUser(); i++) {
      if (this.users[i].id === socketId) return i;
    }
    return -1;
  };

  Room.prototype.toggleReady = function ({ socketId, isReady }) {
    const index = this.getIndexOfUser(socketId);
    if (index < 0) return;
    this.users[index].isReady = isReady;
  };

  Room.prototype.isReady = function () {
    return this.users.some(({ id, isReady }) => {
      if (id !== this.hostId && !isReady) return true;
      return false;
    });
  };

  Room.prototype.getCurrUserId = function () {
    return this.users[this.gameState.currOrder].id;
  };

  Room.prototype.getCurrOrder = function () {
    return this.gameState.currOrder;
  };

  Room.prototype.getCurrRound = function () {
    return this.gameState.currRound;
  };

  return Room;
})();

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
