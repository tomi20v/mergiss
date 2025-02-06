import {beforeEach, describe, expect, it, test } from "vitest";
import Position from "$lib/components/Position";

const anyX = 813, anyY = 912;

describe('Position', () => {

  let p!: Position;

  beforeEach(() => {
    p = new Position(anyX, anyY);
  })

  it('constructs', () => {

    expect(p.atX).to.equal(anyX);
    expect(p.atY).to.equal(anyY);

  })

  it('clones', () => {
    const q = p.clone();
    expect(p).not.to.equal(q)
    expect(p.atX).to.equal(q.atX);
    expect(p.atY).to.equal(q.atY);
  })

  const equalMap = [
    [anyX, anyY, anyX, anyY, true],
    [anyX, anyY, anyX+1, anyY, false],
    [anyX, anyY, anyX, anyY+1, false],
    [anyX, anyY, anyX+1, anyY+1, false],
  ];

  test.each(equalMap)('equals to', (qX, qY, rX, rY, equals) => {
    const q = new Position(qX, qY);
    const r = new Position(rX, rY);
    expect(q.equalsTo(r)).to.equal(equals);
  })

  test.each(equalMap)('equals', (qX, qY, rX, rY, equals) => {
    const q = new Position(qX, qY);
    expect(q.equals(rX, rY)).to.equal(equals);
  })

  test.each(equalMap)('subtracts', (qX, qY, rX, rY) => {
    const q = new Position(qX, qY);
    const r = new Position(rX, rY);
    const s = q.sub(r);
    expect(s.atX).to.equal(qX - rX);
    expect(s.atY).to.equal(qY - rY);
  })

})