import { describe, expect, it } from "vitest";
import Group from "./Group";
import Position from "./geometry/Position";
import Piece from "$lib/game/piece/Piece";

const anyCenter = {x: 0, y: 0};
const anyWeight = 42;
const anyScore = 421;
const anyTtl = 21;
const anyShape = 'anyShape';

describe('Goup', () => {

  it('should create an instance of Goup', () => {
    const group = new Group(anyCenter.x, anyCenter.y, anyWeight, anyScore, anyTtl);
    expect(group).toBeInstanceOf(Group);
    expect(group.centerX).toEqual(anyCenter.x);
    expect(group.centerY).toEqual(anyCenter.y);
    expect(group.weight).toEqual(anyWeight);
    expect(group.score).toEqual(anyScore);
    expect(group.ttl).toEqual(anyTtl);
  });

  it('should create from piece', () => {
    const piece = new Piece(anyShape, [], 'anyColor', 'anyShadowColor');
    const group = Group.fromPiece(new Position(anyCenter.x, anyCenter.y), piece);
    expect(group).toBeInstanceOf(Group);
    expect(group.centerX).toEqual(anyCenter.x);
    expect(group.centerY).toEqual(anyCenter.y);
    expect(group.weight).toEqual(piece.weight);
    expect(group.score).toEqual(piece.weight);
  })

})
