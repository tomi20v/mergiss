import {afterEach, beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import PieceFactory from "$lib/game/piece/PieceFactory";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import {getUniqueId, randomArrayItem} from "$lib/util";

const anyColor = 'anyColor', anyOtherColor = 'anyOtherColor';
vi.mock('$lib/game/colors', () => ({
  randomColorPair: vi.fn(() => ({color: anyColor, otherColor: anyOtherColor}))
}));
vi.mock('$lib/util', () => ({
  randomArrayItem: vi.fn(),
  getUniqueId: vi.fn()
}));

const anyUniqueId = 1836;

describe('PieceFactory.ts', () => {

  describe('randomPiece', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    })

    const pieceFactory = new PieceFactory();

    test.each(pieceCatalogue)('should create', (eachProtoMap) => {
      (randomArrayItem as Mock).mockReturnValue(eachProtoMap);
      (getUniqueId as Mock).mockReturnValue(anyUniqueId);
      const p = pieceFactory.randomPiece();
      expect(p.pixelMap).to.equal(eachProtoMap);
      expect(p.color).to.equal(anyColor);
      expect(p.shadowColor).to.equal(anyOtherColor);
      expect(p.uniqueId).to.equal(anyUniqueId);
      expect(p.originalUniqueId).to.equal(0);
    });

  })

})
