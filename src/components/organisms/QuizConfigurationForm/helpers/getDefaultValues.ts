import slugify from '@sindresorhus/slugify';

import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';

import { DEFAULT_FIELDS, DEFAULT_ORDER } from '@/constants/configuration';

export function getDefaultValues(quiz: Quiz): QuizConfiguration {
  const basePath = slugify(quiz.name);

  return {
    basePath,
    fields: DEFAULT_FIELDS,
    order: DEFAULT_ORDER,
  };
}
