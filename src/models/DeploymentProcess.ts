import type { INDICATORS, STAGES } from '@/constants/deployment';

export class DeploymentProcess {
  public quizId: number;
  public stage: (typeof STAGES)[keyof typeof STAGES];

  public indicator: (typeof INDICATORS)[keyof typeof INDICATORS];
  public order: number;

  public createdAt: number;
  public updatedAt: number;

  constructor(data: Partial<DeploymentProcess>) {
    Object.assign(this, data);
  }
}
