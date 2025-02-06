import {afterEach, beforeEach, describe, expect, it} from "vitest";
import PieceFactory from "$lib/game/piece/PieceFactory";

describe('PieceFactory.ts', () => {

  describe('randomPiece', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    })

    const pieceFactory = new PieceFactory();

    it('should create random shapes', () => {
      const p = pieceFactory.randomPiece();
      let q;
      // this will actually hang if pieces are not random lol
      do {
        q = pieceFactory.randomPiece();
      }
      while (
        JSON.stringify(p.pixelMap) == JSON.stringify(q.pixelMap) ||
        p.color == q.color ||
        p.shadowColor == q.shadowColor
      );
      expect(JSON.stringify(p.pixelMap)).not.to.equal(JSON.stringify(q.pixelMap));
      expect(p.color).not.to.equal(q.color);
      expect(p.shadowColor).not.to.equal(q.shadowColor);
      expect(p.uniqueId).not.to.equal(q.uniqueId);
    });

  })

})
