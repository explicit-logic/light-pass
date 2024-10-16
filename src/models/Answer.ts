export class Answer {
  id: number;
  responderId: number;
  page: string;

  answer: Record<string, string | string[]>;

  createdAt: number;
  updatedAt: number;

  constructor(data: Partial<Answer>) {
    Object.assign(this, data);
  }
}
