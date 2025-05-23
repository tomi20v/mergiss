import { describe, expect, it } from "vitest";
import Group from "./Group.svelte";
import Position from "./geometry/Position";
import Piece from "$lib/game/piece/Piece";

const anyCenter = {x: 0, y: 0};
const anyWeight = 42;
const anyScore = 421;
const anyTtl = 21;
const anyShape = 'anyShape';

describe('Goup', () => {

  it('should create an instance of Group', () => {
    const anyNow = 78126;
    const group = new Group(anyCenter.x, anyCenter.y, anyWeight, anyScore, anyTtl, anyNow);
    expect(group).toBeInstanceOf(Group);
    expect(group.centerX).toEqual(anyCenter.x);
    expect(group.centerY).toEqual(anyCenter.y);
    expect(group.weight).toEqual(anyWeight);
    expect(group.score).toEqual(anyScore);
    expect(group.ttl).toEqual(anyTtl);
    expect(group.createdAt).toEqual(anyNow);
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
