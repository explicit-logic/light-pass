export const STATES = Object.freeze({
  OFFLINE: 0,
  ERROR: 1,
  LOADING: 2,
  ONLINE: 3,
} as const);

export const EVENTS = Object.freeze({
  CLOSE: 'CONNECTION:CLOSE',
  ERROR: 'CONNECTION:ERROR',
  MESSAGE: 'CONNECTION:MESSAGE',
  OPEN: 'CONNECTION:OPEN',
} as const);
