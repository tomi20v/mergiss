import EventEmitter from "eventemitter3";

const randomArrayItem = <T> (arr: Array<T>): T => arr[Math.floor(Math.random() * arr.length)];

const uiBus: EventEmitter = new EventEmitter();

export {
  randomArrayItem,
  uiBus,
}
