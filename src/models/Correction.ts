export class Correction {
  id: number;
  responderId: number;
  page: string;
  question: string;

  mark: number;
  note: string;

  verified: boolean;

  createdAt: number;
  updatedAt: number;

  constructor(data: Partial<Correction>) {
    Object.assign(this, data);
  }
}
