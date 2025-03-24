import {beforeEach, describe, expect, it, test } from "vitest";
import Position from "$lib/game/geometry/Position";

const anyX = 813, anyY = 912, anyRotXY = 270;

describe('Position XY', () => {

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
    [anyX, anyY, anyX, anyY, 1],
    [anyX, anyY, anyX+1, anyY, 0],
    [anyX, anyY, anyX, anyY+1, 0],
    [anyX, anyY, anyX+1, anyY+1, 0],
  ];

  test.each(equalMap)('equals to', (qX, qY, rX, rY, equals) => {
    const q = new Position(qX, qY);
    const r = new Position(rX, rY);
    expect(q.equalsTo(r)).to.equal(!!equals);
  })

  test.each(equalMap)('equals', (qX, qY, rX, rY, equals) => {
    const q = new Position(qX, qY);
    expect(q.equals(rX, rY)).to.equal(!!equals);
  })

  test.each(equalMap)('subtracts', (qX, qY, rX, rY) => {
    const q = new Position(qX, qY);
    const r = new Position(rX, rY);
    const s = q.sub(r);
    expect(s.atX).to.equal(qX - rX);
    expect(s.atY).to.equal(qY - rY);
  })

})

describe('Position XY+rot', () => {

  let p!: Position;

  beforeEach(() => {
    p = new Position(anyX, anyY, anyRotXY);
  })

  it('constructs from json', () => {
    const json = JSON.stringify({
      atX: anyX,
      atY: anyY,
      rotXY: anyRotXY
    });
    const q = Position.fromJSON(json);
    expect(q.atX).to.equal(anyX);
    expect(q.atY).to.equal(anyY);
    expect(q.rotXY).to.equal(anyRotXY);
  })

  it('constructs', () => {

    expect(p.atX).to.equal(anyX);
    expect(p.atY).to.equal(anyY);
    expect(p.rotXY).to.equal(anyRotXY);

  })

  it('clones', () => {
    const q = p.clone();
    expect(p).not.to.equal(q)
    expect(p.atX).to.equal(q.atX);
    expect(p.atY).to.equal(q.atY);
    expect(p.rotXY).to.equal(q.rotXY);
  })

  it('should scale coordinates correctly', () => {
    const position = new Position(2, 3);

    // Scale by 2
    const scaledPosition = position.scale(2);
    expect(scaledPosition.atX).toBe(4);
    expect(scaledPosition.atY).toBe(6);

    // Scale by 0.5
    const scaledPositionHalf = position.scale(0.5);
    expect(scaledPositionHalf.atX).toBe(1);
    expect(scaledPositionHalf.atY).toBe(1.5);

    // Scale by -1 (negative scaling)
    const scaledPositionNegative = position.scale(-1);
    expect(scaledPositionNegative.atX).toBe(-2);
    expect(scaledPositionNegative.atY).toBe(-3);
  });

  const equalMap = [
    [anyX, anyY, anyRotXY, anyX, anyY, anyRotXY, 1],
    [anyX, anyY, anyRotXY, anyX+1, anyY, anyRotXY, 0],
    [anyX, anyY, anyRotXY, anyX, anyY+1, anyRotXY, 0],
    [anyX, anyY, anyRotXY, anyX+1, anyY+1, anyRotXY, 0],
    [anyX, anyY, anyRotXY, anyX+1, anyY, anyRotXY-90, 0],
    [anyX, anyY, anyRotXY, anyX, anyY+1, anyRotXY-90, 0],
    [anyX, anyY, anyRotXY, anyX+1, anyY+1, anyRotXY-90, 0],
  ];

  test.each(equalMap)('equals to', (qX, qY, qRot, rX, rY, rRot, equals) => {
    const q = new Position(qX, qY, qRot);
    const r = new Position(rX, rY, rRot);
    expect(q.equalsTo(r)).to.equal(!!equals);
  })

  test.each(equalMap)('equals', (qX, qY, qRot, rX, rY, rRot, equals) => {
    const q = new Position(qX, qY, qRot);
    expect(q.equals(rX, rY, rRot)).to.equal(!!equals);
  })

  test.each(equalMap)('subtracts', (qX, qY, qRot, rX, rY, rRot) => {
    const q = new Position(qX, qY, qRot);
    const r = new Position(rX, rY, rRot);
    const s = q.sub(r);
    expect(s.atX).to.equal(qX - rX);
    expect(s.atY).to.equal(qY - rY);
    expect(s.rotXY).to.equal(qRot - rRot);
  })

})