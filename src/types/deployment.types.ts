// Constants
import type { STAGES } from '@/constants/deployment';

export type ProcessParams = {
  repo: string;
  owner: string;
  quizId: number;
};

export type StageHandler = (params: ProcessParams) => Promise<unknown>;

export type StageHandlers = Partial<Record<(typeof STAGES)[keyof typeof STAGES], StageHandler>>;
