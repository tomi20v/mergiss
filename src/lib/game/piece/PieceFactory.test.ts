import {afterEach, beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import PieceFactory from "$lib/game/piece/PieceFactory";
import pieceCatalogue from "$lib/game/piece/pieceCatalogue";
import {randomArrayItem} from "$lib/util/randomArrayItem";


const anyColor = 'anyColor', anyOtherColor = 'anyOtherColor';
vi.mock('$lib/game/colors', () => ({
  randomColorPair: vi.fn(() => ({color: anyColor, otherColor: anyOtherColor}))
}));
vi.mock('$lib/util/randomArrayItem', () => ({
  randomArrayItem: vi.fn(),
}));

describe('PieceFactory.ts', () => {

  describe('randomPiece', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    })

    const pieceFactory = new PieceFactory();

    test.each(Object.keys(pieceCatalogue))('should create', (eachShape) => {
      (randomArrayItem as Mock).mockReturnValue(eachShape);
      const p = pieceFactory.randomPiece();
      expect(p.shape).to.equal(eachShape);
      expect(p.pixelMap).to.equal(pieceCatalogue[eachShape]);
      expect(p.color).to.equal(anyColor);
      expect(p.shadowColor).to.equal(anyOtherColor);
      expect(p.uniqueId).not.to.equal('');
      expect(p.originalUniqueId).to.equal('');
    });

  })

})
