export type OrthogonalAngle = 0|90|180|270;

export function angleToOrthogonal(angle: number): OrthogonalAngle {
  const orthogonalAngle = angle - angle % 90;
  return ((orthogonalAngle % 360) + 360) % 360 as OrthogonalAngle;
}