import type { FIELDS, ORDERS } from '@/constants/configuration';

export class QuizConfiguration {
  public basePath: string;
  public fields: (typeof FIELDS)[keyof typeof FIELDS][];
  public order: (typeof ORDERS)[keyof typeof ORDERS];

  constructor(data: Partial<QuizConfiguration>) {
    Object.assign(this, data);
  }

  public static toText(data: Partial<QuizConfiguration>) {
    return JSON.stringify({
      basePath: data.basePath ? `/${data.basePath}` : '',
      fields: data.fields,
      order: data.order,
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
