import { describe, expect, it, test } from "vitest";
import Piece from "$lib/game/piece/Piece";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import type {IProtoMap} from "$lib/game/piece/IProtoMap";
import { FlatteningIterator } from "@tomi20v/iterators";

const anyProtoMap = [[1,0],[1,1]];
const anyColor = 'anyColor';
const anyShadowColor = 'anyShadowColor';
const anyUniqueId = '12487';

describe('Piece.ts', () => {

  describe.each(pieceCatalogue)('with each protomap', (...eachProtoMap: IProtoMap) => {

    const p = new Piece(eachProtoMap, anyColor, anyShadowColor);

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
    const p = new Piece([], anyColor, anyShadowColor);
    expect(p.sizeX()).toEqual(0);
  })

  it('should take original unique ID', () => {
    const p = new Piece(anyProtoMap, anyColor, anyShadowColor, anyUniqueId);
    expect(p.originalUniqueId).toEqual(anyUniqueId);
  });

  it('should create from JSON', () => {
    const json = JSON.stringify({
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
    const p = new Piece([[1,0],[1,1]], anyColor, anyShadowColor);
    expect(p.weight).toEqual(3);
  })

  it('should return flat iterator', () => {
    const p = new Piece(anyProtoMap, anyColor, anyShadowColor);
    const iter = p.getFlatIterator();
    expect(iter).toBeInstanceOf(FlatteningIterator);
    expect((iter as any).data).toEqual(anyProtoMap);
    expect((iter as any).dimensions).toEqual(['y', 'x']);
  })

  it('should test equality', () => {
    const p1 = new Piece(anyProtoMap, anyColor, anyShadowColor);
    expect(p1.equals(p1)).toBe(true);
  })

  test.each([
    new Piece(anyProtoMap, anyColor, anyShadowColor),
    new Piece(anyProtoMap.concat([1,0]), anyColor, anyShadowColor),
    new Piece(anyProtoMap, anyColor, anyShadowColor),
    new Piece(anyProtoMap, anyColor, anyShadowColor),
  ])('should return false when not equal', (otherPiece) => {
    const p1 = new Piece(anyProtoMap, anyColor, anyShadowColor);
    expect(p1.equals(otherPiece)).toBe(false);
  })

})
