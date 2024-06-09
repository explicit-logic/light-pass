import { MODES } from '@/constants/deployment';
import { STATES } from '@/constants/quizzes';

export class Quiz {
  public readonly id: number;
  public name: string;
  public description: string;

  public readonly localeCount: number = 0;
  public readonly mainLanguage?: string;
  public readonly mainUrl?: string;

  public readonly state: number = 0;

  public readonly mode: (typeof MODES)[keyof typeof MODES] = MODES.CREATE;

  public readonly createdAt: number;
  public readonly updatedAt: number;

  constructor(data: Partial<Quiz>) {
    Object.assign(this, data);
  }

  public get detailsCompleted() {
    return (this.state & STATES.DETAILS_COMPLETED) === STATES.DETAILS_COMPLETED;
  }

  public get configurationCompleted() {
    return (this.state & STATES.CONFIGURATION_COMPLETED) === STATES.CONFIGURATION_COMPLETED;
  }

  public get localeCompleted() {
    return (this.state & STATES.LOCALE_COMPLETED) === STATES.LOCALE_COMPLETED;
  }

  public get deployed() {
    return (this.state & STATES.DEPLOYED) === STATES.DEPLOYED;
  }
}
