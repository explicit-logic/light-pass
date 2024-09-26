export class Answer {
  id: number;
  responderId: number;
  page: string;

  answer: object;
  correction: object;

  score: number;
  threshold: number;

  createdAt: number;
  updatedAt: number;

  constructor(data: Partial<Answer>) {
    Object.assign(this, data);
  }
}
