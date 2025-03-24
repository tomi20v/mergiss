import EventEmitter from "eventemitter3";

export const uiBus: EventEmitter = new EventEmitter();

/**
 *
 * List of Events Used in the Project:
 *
 * accelerateGroup
 * triggers accelerating in the countdown component when a click is started on a group
 *
 * dev.score
 * A development/debugging-specific event to test receiving score
 *
 * groupExpired
 * Emitted when a group expires due to the countdown.
 *
 * pieceDrop
 * Emitted after a game piece is dropped onto the board (UI event)
 *
 * pieceDropped
 * Emitted when a piece is actually placed on the board. (triggers removal from generator)
 *
 * stitch
 * Emitted when a dropped piece forms a group with previous pieces, there is one
 * event for each contacting edge. Contains stitch count (of last action) in cnt
 *
 * stitchExpired
 * Emitted when a stitch expires, either due to timeout or gameplay logic.
 *
 */
