export default class ArrayIterator<T> {
  readonly length: number;
  protected readonly a: Array<T>;
  protected readonly _reverse: boolean = false;

  constructor(a: Array<T>, reverse: boolean = false) {
    this.a = a;
    this.length = a.length;
    this._reverse = reverse;

    return new Proxy(this, {
      get<K extends keyof ArrayIterator<T>>(target: ArrayIterator<T>, prop: K): ArrayIterator<T>[K] {
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          return target.a[Number(prop)] as ArrayIterator<T>[K];
        }
        return target[prop];
      }
    });
  }

  *[Symbol.iterator](): Generator<T | ArrayIterator<T extends (infer U)[] ? U : never>> {
    const indices = this._reverse ? [...Array(this.length).keys()].reverse() : [...Array(this.length).keys()];

    for (const i of indices) {
      const ret = this.a[i];
      if (Array.isArray(ret)) {
        yield new ArrayIterator(ret);
      } else {
        yield ret;
      }
    }
  }

  reverse(): ArrayIterator<T> {
    return new ArrayIterator<T>(this.a, !this._reverse);
  }

}

// this will "rotate 90 degrees" an interator which iterates a 2D array
export function rotate2D<T>(iterator: ArrayIterator<T[]>): ArrayIterator<T[]> {
  const originalArray: T[][] = [];
  for (const row of iterator) {
    if (!(row instanceof ArrayIterator)) {
      throw new Error('rotate2D expects an ArrayIterator containing a 2D array.');
    }
    // @ts-expect-error neither AI will fix this
    originalArray.push([...row]);
  }
  const rotated = originalArray[0].map((_, colIndex) =>
    originalArray.map(row => row[colIndex])
  ).map(row => row.reverse());
  return new ArrayIterator<T[]>(rotated);
}
