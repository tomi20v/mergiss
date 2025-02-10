import {beforeEach, describe, expect, it} from "vitest";
import ArrayIterator from "$lib/game/ArrayIterator";

const anyArray = [1,2,3,4];
const firstItem = anyArray[0];
let a: ArrayIterator<number>;
let r: ArrayIterator<number>;

describe('ArrayIterator', () => {

  beforeEach(() => {
    a = new ArrayIterator(anyArray);
    r = new ArrayIterator(anyArray, true);
  })

  it('initializes', () => {
    expect(a.length).to.equal(anyArray.length);
    expect(a.position).to.equal(undefined);
    expect(a.current).to.equal(undefined);
  })

  it('resets', () => {
    expect(a.position).not.to.equal(0);
    const result = a.reset();
    expect(result).to.equal(firstItem);
    expect(a.current).to.equal(firstItem);
    expect(a.position).to.equal(0);
  })

  it('returns current and next', () => {
    a.reset();
    expect(a.current).to.equal(anyArray[0]);
    expect(a.next()).to.equal(anyArray[1]);
    expect(a.current).to.equal(anyArray[1]);
    expect(a.next()).to.equal(anyArray[2]);
    expect(a.current).to.equal(anyArray[2]);
  })

  it('returns undefined after all returned', () => {
    let item;
    a.reset();
    anyArray.forEach(() => item = a.next());
    expect(item).to.equal(undefined);
    expect(a.current).to.equal(undefined);
    expect(a.position).to.equal(undefined);
  })

  it('forwards to end and returns last', () => {
    const lastItem = anyArray.findLast(() => true);
    const result = a.end();
    expect(result).to.equal(lastItem);
    expect(a.current).to.equal(lastItem);
  })

  it('returns undefined after end', () => {
    a.end();
    const result = a.next();
    expect(result).to.equal(undefined);
    expect(a.position).to.equal(undefined);
  })

})
