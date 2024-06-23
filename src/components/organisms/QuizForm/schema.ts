import * as yup from 'yup';

import { languages } from '@/constants/languages';

export const editSchema = yup
  .object({
    language: yup
      .mixed<keyof typeof languages>()
      .oneOf(Object.keys(languages) as (keyof typeof languages)[])
      .required(),
    name: yup.string().required(),
    description: yup.string(),
  })
  .required();

export const createSchema = yup
  .object({
    language: yup
      .mixed<keyof typeof languages>()
      .oneOf(Object.keys(languages) as (keyof typeof languages)[])
      .required(),
    name: yup.string().required(),
    description: yup.string(),
  })
  .required();
