import type { MARK_TYPE } from '@/constants/marks';

export class Correction {
  id: number;
  responderId: number;
  page: string;
  question: string;

  mark: MARK_TYPE;
  note: string;

  verified: boolean;

  createdAt: number;
  updatedAt: number;

  constructor(data: Partial<Correction>) {
    Object.assign(this, data);
  }
}
