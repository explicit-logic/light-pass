export const TYPES = Object.freeze({
  CHECKBOX_GROUP: 'checkbox-group',
  HEADER: 'header',
  INPUT: 'input',
  IMAGE: 'image',
  RADIO_GROUP: 'radio-group',
});

export const QUESTION_TYPES = Object.freeze({
  [TYPES.CHECKBOX_GROUP]: true,
  [TYPES.INPUT]: true,
  [TYPES.RADIO_GROUP]: true,
} as const);
