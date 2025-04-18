import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest'
import { sortedPositionPair } from './positionPair'
import Position from './Position'
import * as numericIdModule from '$lib/util/numericId'

vi.mock('$lib/util/numericId', () => ({
  numericId: vi.fn(),
}))

describe('sortedPositionPair', () => {
  beforeEach(() => {
    // (numericIdModule.numericId as vi.Mock).mockReturnValue(42)
    (numericIdModule.numericId as Mock).mockReturnValue(42)
  })

  it('returns pair in original order if p1 is above p2', () => {
    const p1 = new Position(1, 1)
    const p2 = new Position(1, 2)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1, p2, id: 42 })
  })

  it('returns pair in original order if p1 is left of p2', () => {
    const p1 = new Position(1, 5)
    const p2 = new Position(2, 5)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1, p2, id: 42 })
  })

  it('swaps if p2 is above p1', () => {
    const p1 = new Position(1, 2)
    const p2 = new Position(1, 1)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1: p2, p2: p1, id: 42 })
  })

  it('swaps if p2 is left of p1', () => {
    const p1 = new Position(2, 5)
    const p2 = new Position(1, 5)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1: p2, p2: p1, id: 42 })
  })

  it('keeps order if both are the same', () => {
    const p1 = new Position(1, 1)
    const p2 = new Position(1, 1)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1, p2, id: 42 })
  })

  it('uses provided cnt parameter', () => {
    const p1 = new Position(1, 1)
    const p2 = new Position(1, 2)
    const result = sortedPositionPair(p1, p2, 5)
    expect(result).toEqual({ p1, p2, id: 42, cnt: 5 })
  })

})
