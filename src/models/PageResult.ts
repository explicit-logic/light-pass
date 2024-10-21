export class PageResult {
  id: number;
  responderId: number;
  page: string;

  points: number;
  questionCount: number;
  verified: boolean;

  createdAt: number;
  updatedAt: number;

  constructor(data: Partial<PageResult>) {
    Object.assign(this, data);
  }
}
