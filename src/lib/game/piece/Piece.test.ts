import { describe, expect, it, test } from "vitest";
import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import { FlatteningIterator } from "@tomi20v/iterators";

const anyProtoMap = [[1,0],[1,1]];
const anyShape = 'anyShape';
const anyColor = 'anyColor';
const anyShadowColor = 'anyShadowColor';
const anyUniqueId = '12487';

describe('Piece.ts', () => {

  describe.each(Object.keys(pieceCatalogue))('with each protomap', (eachShape) => {

    const eachProtoMap = pieceCatalogue[eachShape];
    const p = new Piece(eachShape, eachProtoMap, anyColor, anyShadowColor);

    it('should construct', () => {
      expect(p.pixelMap).toEqual(eachProtoMap);
      expect(p.color).toEqual(anyColor);
      expect(p.shadowColor).toEqual(anyShadowColor);
      expect(p.originalUniqueId).toEqual('');
    });

    it('should return sizeX', () => {
      expect(p.sizeX()).toEqual(eachProtoMap[0].length);
    })

    it('should return sizeY', () => {
      expect(p.sizeY()).toEqual(eachProtoMap.length);
    })

  });

  it('should return default size X 0', () => {
    const p = new Piece(anyShape, [], anyColor, anyShadowColor);
    expect(p.sizeX()).toEqual(0);
  })

  it('should set rotationCount in constructor', () => {
    const rotationCount = 2;
    const p = new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor, rotationCount);
    expect(p.rotationCount).toEqual(rotationCount);
  })

  it('should take original unique ID', () => {
    const p = new Piece(anyShape, pieceCatalogue[anyShape], anyColor, anyShadowColor, 0, anyUniqueId);
    expect(p.originalUniqueId).toEqual(anyUniqueId);
  });

  it('should create from JSON', () => {
    const json = JSON.stringify({
      shape: anyShape,
      pixelMap: anyProtoMap,
      color: anyColor,
      shadowColor: anyShadowColor,
      uniqueId: anyUniqueId
    });
    const p = Piece.fromJSON(json);
    expect(p.pixelMap).toEqual(anyProtoMap);
    expect(p.color).toEqual(anyColor);
    expect(p.shadowColor).toEqual(anyShadowColor);
    expect(p.originalUniqueId).toEqual(anyUniqueId);
  })

  it('should return weight', () => {
    const p = new Piece(anyShape, [[1,0],[1,1]], anyColor, anyShadowColor);
    expect(p.weight).toEqual(3);
  })

  it('should return flat iterator', () => {
    const p = new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor);
    const iter = p.getFlatIterator();
    expect(iter).toBeInstanceOf(FlatteningIterator);
    expect((iter as any).data).toEqual(anyProtoMap);
    expect((iter as any).dimensions).toEqual(['y', 'x']);
  })

  it('should test equality', () => {
    const p1 = new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor);
    expect(p1.equals(p1)).toBe(true);
  })

  test.each([
    new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor),
    new Piece(anyShape, anyProtoMap.concat([1,0]), anyColor, anyShadowColor),
    new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor),
    new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor),
  ])('should return false when not equal', (otherPiece) => {
    const p1 = new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor);
    expect(p1.equals(otherPiece)).toBe(false);
  })

  it('should rotate', () => {
    const p = new Piece(anyShape, anyProtoMap, anyColor, anyShadowColor);
    p.rotated();
    expect(p.rotationCount).toEqual(1);
    p.rotated();
    p.rotated();
    p.rotated();
    p.rotated();
    expect(p.rotationCount).toEqual(5);
  })

})
