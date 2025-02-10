import {beforeEach, describe, expect, it } from "vitest";
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

  it('initializes FW/REV', () => {
    [a,r].forEach((x) => {
      expect(x.length).to.equal(anyArray.length);
      expect(x.position).to.equal(undefined);
      expect(x.current).to.equal(undefined);
    })
  })

  it('resets FW', () => {
    expect(a.position).not.to.equal(0);
    const result = a.reset();
    expect(result).to.equal(firstItem);
    expect(a.current).to.equal(firstItem);
    expect(a.position).to.equal(0);
  })

  it('resets REV', () => {
    const lastItem = anyArray[anyArray.length-1];
    const len = anyArray.length;
    expect(r.position).not.to.equal(len);
    const result = r.reset();
    expect(result).to.equal(lastItem);
    expect(r.current).to.equal(lastItem);
    expect(r.position).to.equal(len-1);
  })

  it('returns current and next FW', () => {
    a.reset();
    expect(a.current).to.equal(anyArray[0]);
    expect(a.next()).to.equal(anyArray[1]);
    expect(a.current).to.equal(anyArray[1]);
    expect(a.next()).to.equal(anyArray[2]);
    expect(a.current).to.equal(anyArray[2]);
  })

  it('returns current and next REV', () => {
    r.reset();
    expect(r.current).to.equal(anyArray[3]);
    expect(r.next()).to.equal(anyArray[2]);
    expect(r.current).to.equal(anyArray[2]);
    expect(r.next()).to.equal(anyArray[1]);
    expect(r.current).to.equal(anyArray[1]);
  })

  it('returns undefined after all returned FW/REV', () => {
    [a,r].forEach((x) => {
      let item;
      x.reset();
      anyArray.forEach(() => item = x.next());
      expect(item).to.equal(undefined);
      expect(x.current).to.equal(undefined);
      expect(x.position).to.equal(undefined);
    })
  })

  it('forwards to end and returns last FW', () => {
    const lastItem = anyArray.findLast(() => true);
    const result = a.end();
    expect(result).to.equal(lastItem);
    expect(a.current).to.equal(lastItem);
    expect(a.position).to.equal(anyArray.length - 1);
  })

  it('forwards to end and returns last REV', () => {
    const lastItem = anyArray[0];
    const result = r.end();
    expect(result).to.equal(lastItem);
    expect(r.current).to.equal(lastItem);
    expect(r.position).to.equal(0);
  })

  it('returns undefined after end FW/REV', () => {
    [a,r].forEach(x => {
      x.end();
      const result = x.next();
      expect(result).to.equal(undefined);
      expect(x.position).to.equal(undefined);
    })
  })

})
