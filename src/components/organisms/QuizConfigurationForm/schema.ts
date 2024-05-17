import * as yup from 'yup';

import { FIELDS, ORDERS } from '@/constants/configuration';

export const schema = yup
  .object({
    basePath: yup
      .string()
      .min(1)
      .max(255)
      .matches(/^[a-z](-?[a-z])*$/, 'Valid characters: a-z, -')
      .required(),
    fields: yup
      .array()
      .of(yup.string().oneOf(Object.values(FIELDS)).required())
      .min(1)
      .required(),
    order: yup.string().oneOf(Object.values(ORDERS)).required(),
  })
  .required();
