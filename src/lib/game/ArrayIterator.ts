export default class ArrayIterator <T> {

  readonly length: number;
  private a: Array<T>;
  private _reverse: boolean = false;
  private _position: number|undefined = undefined;

  constructor(a: Array<T>, reverse: boolean = false) {
    this.a = a;
    this.length = a.length;
    this._reverse = reverse;
  }

  get current(): ArrayIterator<T extends (infer U)[] ? U : never>|T|undefined {
    if (this._position === undefined) {
      return undefined;
    }
    const ret = this.a[this._position];
    if (ret instanceof Array) {
      return new ArrayIterator(ret);
    }
    return ret;
  }

  get position(): number|undefined {
    return this._position;
  }

  end(): ArrayIterator<T extends (infer U)[] ? U : never>|T|undefined {
    // with an empty this.a _position always remains undefined so just check the other case
    if (this.length > 0) {
      this._position = this._reverse ? 0 : Math.max(0, this.a.length - 1);
    }
    return this.current;
  }

  next(): ArrayIterator<T extends (infer U)[] ? U : never>|T|undefined {
    if (this.position === undefined) {
      return undefined;
    }
    const p = this.position||0;
    if (this._reverse) {
      this._position = p > 0 ? p - 1 : undefined;
    }
    else {
      this._position = p + 1 < this.length ? p + 1 : undefined;
    }
    return this.current;
  }

  reset(): ArrayIterator<T extends (infer U)[] ? U : never>|T|undefined {
    // with an empty this.a _position always remains undefined so just check the other case
    if (this.length > 0) {
      this._position = this._reverse ? this.length - 1 : 0;
    }
    return this.current;
  }

  reverse(): ArrayIterator<T> {
    return new ArrayIterator<T>(this.a, !this._reverse);
  }

}