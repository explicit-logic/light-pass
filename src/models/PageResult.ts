export class PageResult {
  id: number;
  responderId: number;
  page: string;

  score: number;
  threshold: number;
  verified: boolean;

  createdAt: number;
  updatedAt: number;

  constructor(data: Partial<PageResult>) {
    Object.assign(this, data);
  }
}
