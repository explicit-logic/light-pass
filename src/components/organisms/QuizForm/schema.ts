import * as yup from 'yup';

import { languages } from '@/constants/languages';
import { MAX, MIN } from '@/constants/locales';

export const schema = yup
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
    name: yup.string().required(),
  })
  .required();
