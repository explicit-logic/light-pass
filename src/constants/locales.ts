export const MAX = 5;
export const MIN = 1;

export const STATES = Object.freeze({
  QUESTION_COMPLETED: 1,
  TEXT_COMPLETED: 2,
});

export const STATES_SUM = Object.values(STATES).reduce((a, b) => a + b, 0);
