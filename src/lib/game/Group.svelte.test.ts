import { describe, expect, it } from "vitest";
import Group from "./Group.svelte";

const anyCenter = {x: 0, y: 0};
const anyWeight = 42;
const anyTtl = 21;

describe('Goup', () => {

  describe('constructor', () => {
    it('should create an instance of Goup', () => {
      const group = new Group(anyCenter.x, anyCenter.y, anyWeight, anyTtl);
      expect(group).toBeInstanceOf(Group);
      expect(group.centerX).toEqual(anyCenter.x);
      expect(group.centerY).toEqual(anyCenter.y);
      expect(group.weight).toEqual(anyWeight);
      expect(group.ttl).toEqual(anyTtl);
    });
  });

  it('should start the timer', async () => {
    const group = new Group(anyCenter.x, anyCenter.y, anyWeight, anyTtl);
    group.startTimer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const currentTtl = group.ttl;
    expect(currentTtl).toBeLessThan(anyTtl);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lastTtl = group.ttl;
    expect(lastTtl).toBeLessThan(currentTtl);
  });

  it('should stop the timer', async () => {
    const group = new Group(anyCenter.x, anyCenter.y, anyWeight, anyTtl);
    group.startTimer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const currentTtl = group.ttl;
    group.stopTimer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lastTtl = group.ttl;
    expect(lastTtl).toEqual(currentTtl);
  });

})
