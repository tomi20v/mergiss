export default class ArrayIterator <T> {

  private a: Array<T>;
  private reverse: boolean = false;
  readonly length: number;
  private _position: number|undefined = undefined;

  constructor(a: Array<T>, reverse: boolean = false) {
    this.a = a;
    this.length = a.length;
    this.reverse = reverse;
  }

  get current(): T|undefined {
    if (this._position === undefined) {
      return undefined;
    }
    return this.a[this._position];
  }

  get position(): number|undefined {
    return this._position;
  }

  end(): T|undefined {
    this._position = Math.max(0, this.a.length - 1);
    return this.current;
  }

  next(): T|undefined {
    if (this.position === undefined) {
      return undefined;
    }
    const p = this.position||0;
    this._position = p + 1 < this.length
      ? p + 1
      : undefined;
    return this.current;
  }

  reset(): T|undefined {
    this._position = 0;
    return this.current;
  }

}