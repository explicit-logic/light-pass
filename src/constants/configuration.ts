export const FIELDS = {
  EMAIL: 'email',
  GROUP: 'group',
  NAME: 'name',
};

export const DEFAULT_FIELDS = [FIELDS.EMAIL, FIELDS.NAME];

export const FIELD_LABELS = {
  [FIELDS.EMAIL]: 'Email',
  [FIELDS.GROUP]: 'Group',
  [FIELDS.NAME]: 'Name',
};

export const ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
  RANDOM: 'random',
};

export const DEFAULT_ORDER = ORDERS.ASC;

export const ORDER_LABELS = {
  [ORDERS.ASC]: 'A-Z',
  [ORDERS.DESC]: 'Z-A',
  [ORDERS.RANDOM]: 'Random',
};

export const TIME_LIMIT_TYPES = Object.freeze({
  MANY: 'M', // Many (time limit for an entire quiz)
  ONE: 'A', // One (the time limit for a questions page)
} as const);
