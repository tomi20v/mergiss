import { describe, expect, test } from "vitest";
import {angleToOrthogonal} from "./angleToOrthogonal";

describe('angleToOrthogonal', () => {

  test.each([0, 90, -90, 180, -180, 270, -270, 360, -360, 450, -450])('normalizes angle %d', (angle) => {
    const result = angleToOrthogonal(angle);
    expect([0, 90, 180, 270]).toContain(result);
  })

  test.each([90, 91, 98, 110, 144, 145, 146, 151, 178, 179])('converts to 90 from angle %d', (angle) => {
    expect(angleToOrthogonal(angle)).toBe(90);
  })

})