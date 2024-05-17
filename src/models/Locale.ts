import type { languages } from '@/constants/languages';

import { STATES, STATES_SUM } from '@/constants/locales';

export class Locale {
  public quizId: number;
  public language: keyof typeof languages;
  public url: string;
  public main: boolean;
  public questionCount: number;
  public pageCount: number;
  public state: number;

  public createdAt: number;
  public updatedAt: number;

  constructor(data: Partial<Locale>) {
    Object.assign(this, data);
  }

  public get questionCompleted() {
    return (this.state & STATES.QUESTION_COMPLETED) === STATES.QUESTION_COMPLETED;
  }

  public get textCompleted() {
    return (this.state & STATES.TEXT_COMPLETED) === STATES.TEXT_COMPLETED;
  }

  public get completed() {
    return this.state === STATES_SUM;
  }
}
