import {uniqueId} from "lui-g";

export function numericId(): number {
  return parseInt(uniqueId(''));
}
