import {afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PieceFactory from "$lib/game/piece/PieceFactory";
import {randomColorPair} from "$lib/game/colors";

const anyColor = 'anyColor', anyOtherColor = 'anyOtherColor';
vi.mock('$lib/game/colors', () => ({
  randomColorPair: vi.fn(() => ({color: anyColor, otherColor: anyOtherColor}))
}));

describe('PieceFactory.ts', () => {

  describe('randomPiece', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    })

    const pieceFactory = new PieceFactory();

    it('should create', () => {
      const p = pieceFactory.randomPiece();
      expect(randomColorPair).toBeCalled();
      expect(p.pixelMap.length).toBeGreaterThan(0);
      expect(p.color).to.equal(anyColor);
      expect(p.shadowColor).to.equal(anyOtherColor);
      expect(p.uniqueId).not.to.equal(0);
      expect(p.originalUniqueId).to.equal(0);
    });

  })

})
