import { describe, it, expect } from 'vitest'
import { sortedPositionPair } from './positionPair'
import Position from './Position'

describe('sortedPositionPair', () => {
  it('returns pair in original order if p1 is above p2', () => {
    const p1 = new Position(1, 1)
    const p2 = new Position(1, 2)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1, p2 })
  })

  it('returns pair in original order if p1 is left of p2', () => {
    const p1 = new Position(1, 5)
    const p2 = new Position(2, 5)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1, p2 })
  })

  it('swaps if p2 is above p1', () => {
    const p1 = new Position(1, 2)
    const p2 = new Position(1, 1)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1: p2, p2: p1 })
  })

  it('swaps if p2 is left of p1', () => {
    const p1 = new Position(2, 5)
    const p2 = new Position(1, 5)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1: p2, p2: p1 })
  })

  it('keeps order if both are the same', () => {
    const p1 = new Position(1, 1)
    const p2 = new Position(1, 1)
    const result = sortedPositionPair(p1, p2)
    expect(result).toEqual({ p1, p2 })
  })
})
