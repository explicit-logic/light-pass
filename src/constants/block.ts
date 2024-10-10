export const TYPES = Object.freeze({
  CHECKBOX_GROUP: 'checkbox-group',
  HEADER: 'header',
  INPUT: 'input',
  IMAGE: 'image',
  RADIO_GROUP: 'radio-group',
});

export const INTERACTIVE_TYPES: Partial<{ [key in (typeof TYPES)[keyof typeof TYPES]]: boolean }> = Object.freeze({
  [TYPES.CHECKBOX_GROUP]: true,
  [TYPES.INPUT]: true,
  [TYPES.RADIO_GROUP]: true,
});
