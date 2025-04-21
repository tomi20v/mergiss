import { describe, expect, it, test } from "vitest";
import {colors, complementerColorOf, randomColorPair} from "./colors";

describe('Color', () => {
  describe('randomColorPair', () => {

    it('returns a color pair', () => {
      const { color, otherColor } = randomColorPair();
      expect(color).toBeDefined();
      expect(otherColor).toBeDefined();
      expect(color).not.toEqual(otherColor);
    });

    it('returns a color pair with different colors', () => {
      const { color, otherColor } = randomColorPair();
      expect(color).not.toEqual(otherColor);
    });

    it('returns random colors', () => {
      const c1 = randomColorPair();
      let c2: { color: string; otherColor: string };
      let maxTries = 10;
      do {
        c2 = randomColorPair();
        expect(--maxTries).toBeGreaterThan(0);
      } while (c1.color === c2.color || c1.otherColor === c2.otherColor);

      expect(c1.color).not.toEqual(c2.color);
      expect(c1.otherColor).not.toEqual(c2.otherColor);
    })

  })

  describe('complementerColorOf', () => {
    test.each([
      [colors.black, colors.gray],
      [colors.white, colors.silver],
      [colors.red, colors.lightRed],
      [colors.purple, colors.lightPurple],
      [colors.yellow, colors.cyan],
      [colors.green, colors.lightGreen],
      [colors.brown, colors.lightBrown],
      [colors.blue, colors.lightBlue],
      [colors.gray, colors.black],
      [colors.silver, colors.white],
      [colors.lightRed, colors.red],
      [colors.lightPurple, colors.purple],
      [colors.cyan, colors.yellow],
      [colors.lightGreen, colors.green],
      [colors.lightBrown, colors.brown],
      [colors.lightBlue, colors.blue],
    ])('returns a complementer color', (color, expectedComplementer) => {
      const complementerColor = complementerColorOf(color);
      expect(complementerColor).toEqual(expectedComplementer);
    });
  });

})

