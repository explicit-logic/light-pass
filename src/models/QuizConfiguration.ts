import type { FIELDS, ORDERS } from '@/constants/configuration';

export class QuizConfiguration {
  public basePath: string;
  public fields: (typeof FIELDS)[keyof typeof FIELDS][];
  public order: (typeof ORDERS)[keyof typeof ORDERS];

  constructor(data: Partial<QuizConfiguration>) {
    Object.assign(this, data);
  }
}
