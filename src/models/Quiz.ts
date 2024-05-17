import { STATES } from '@/constants/quizzes';

export class Quiz {
  public id: number;
  public name: string;
  public description: string;

  public localeCount: number;
  public mainLanguage?: string;
  public mainUrl?: string;

  public state: number;

  public createdAt: number;
  public updatedAt: number;

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
