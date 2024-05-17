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
  [ORDERS.ASC]: 'Ascending',
  [ORDERS.DESC]: 'Descending',
  [ORDERS.RANDOM]: 'Random',
};
