export const MIN_MARK = 0;

export const MAX_MARK = 100;

export const MARKS = Object.freeze({
  WRONG: 0,
  HALF: 1,
  RIGHT: 2,
});

export type MARK_TYPE = (typeof MARKS)[keyof typeof MARKS];
