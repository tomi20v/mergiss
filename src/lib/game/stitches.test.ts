import { describe, it, expect } from 'vitest';
import Position from './geometry/Position';
import {EStitchLevel, stitchLevel} from "$lib/game/stitches";

describe('stitchLevel', () => {
    it('returns normal when colors do not match', () => {
        const pos1 = new Position(1, 1);
        const pos2 = new Position(1, 1);
        expect(stitchLevel(pos1, 'red', pos2, 'blue')).toBe(EStitchLevel.normal);
    });

    it('returns matchingColorsUnder when positions and colors match', () => {
        const pos1 = new Position(1, 1);
        const pos2 = new Position(1, 1);
        expect(stitchLevel(pos1, 'red', pos2, 'red')).toBe(EStitchLevel.matchingColorsOverlap);
    });

    it('returns matchingColors when colors match but positions differ', () => {
        const pos1 = new Position(1, 1);
        const pos2 = new Position(2, 2);
        expect(stitchLevel(pos1, 'red', pos2, 'red')).toBe(EStitchLevel.matchingColors);
    });

    it('returns normal for different colors regardless of position', () => {
        const pos1 = new Position(1, 1);
        const pos2 = new Position(2, 2);
        expect(stitchLevel(pos1, 'red', pos2, 'blue')).toBe(EStitchLevel.normal);
    });
});