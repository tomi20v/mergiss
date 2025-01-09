const randomArrayItem = <T> (arr: Array<T>): T => arr[Math.floor(Math.random() * arr.length)];

export {
  randomArrayItem,
}
