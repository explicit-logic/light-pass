import * as yup from 'yup';

import { FIELDS, ORDERS } from '@/constants/configuration';
import { languages } from '@/constants/languages';
import { MAX, MIN } from '@/constants/locales';

export const editSchema = yup
  .object({
    fields: yup
      .array()
      .of(yup.string().oneOf(Object.values(FIELDS)).required())
      .min(1)
      .required(),
    language: yup
      .mixed<keyof typeof languages>()
      .oneOf(Object.keys(languages) as (keyof typeof languages)[])
      .required(),
    name: yup.string().required(),
    order: yup.string().oneOf(Object.values(ORDERS)).required(),
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

export const settingsSchema = yup
  .object({
    locales: yup
      .array()
      .min(MIN)
      .max(MAX)
      .of(
        yup.object({
          language: yup
            .mixed<keyof typeof languages>()
            .oneOf(Object.keys(languages) as (keyof typeof languages)[])
            .required(),
          main: yup.boolean().required(),
          url: yup.string().lowercase().url().required(),
        }),
      )
      .required(),
  })
  .required();
