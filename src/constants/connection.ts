export const STATES = Object.freeze({
  OFFLINE: 0,
  ERROR: 1,
  LOADING: 2,
  ONLINE: 3,
} as const);

export const CLIENT_EVENTS = Object.freeze({
  CLOSE: 'CLIENT:CLOSE',
  ERROR: 'CLIENT:ERROR',
  MESSAGE: 'CLIENT:MESSAGE',
  OPEN: 'CLIENT:OPEN',
} as const);

export const SERVER_EVENTS = Object.freeze({
  CLOSE: 'SERVER:CLOSE',
  ERROR: 'SERVER:ERROR',
  OPEN: 'SERVER:OPEN',
} as const);
