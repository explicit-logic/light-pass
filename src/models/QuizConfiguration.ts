import type { FIELDS, ORDERS, TIME_LIMIT_TYPES } from '@/constants/configuration';

export class QuizConfiguration {
  readonly quizId: number;
  public basePath: string;
  public fields: (typeof FIELDS)[keyof typeof FIELDS][];
  public order: (typeof ORDERS)[keyof typeof ORDERS];
  public timeLimit: string;

  constructor(data: Partial<QuizConfiguration>) {
    Object.assign(this, data);
  }

  public get timeLimitDuration() {
    if (!this.timeLimit) return null;
    const duration = Number(this.timeLimit.substring(1));

    return duration;
  }

  public get timeLimitType() {
    if (!this.timeLimit) return null;

    const type = this.timeLimit.substring(0, 1) as (typeof TIME_LIMIT_TYPES)[keyof typeof TIME_LIMIT_TYPES];

    return type;
  }

  public static toText(data: Partial<QuizConfiguration>) {
    return JSON.stringify({
      basePath: data.basePath ? `/${data.basePath}` : '',
      fields: data.fields,
      order: data.order,
      timeLimit: data.timeLimit,
    });
  }

  public static fromText(text: string) {
    const data = parse(text) as QuizConfiguration;
    data.basePath = data.basePath?.replace(/^\//, '');

    return new QuizConfiguration(data);
  }
}

function parse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}
