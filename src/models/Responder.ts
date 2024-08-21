export class Responder {
  readonly id: number;
  readonly clientId: string;
  readonly quizId: number;
  readonly language: string;

  readonly completed: boolean;
  readonly connectedAt: number;
  readonly identified = false;
  readonly verified = false;

  readonly platform: PlatformType;
  readonly progress: number;
  readonly timezone: string;
  readonly userAgent: string;

  readonly email: string;
  readonly name: string;
  readonly theme: ThemeModeType;
  readonly group?: string;

  readonly mark: number = 0;

  readonly startedAt: number;
  readonly finishedAt: number;

  readonly context?: {
    slugs: string[];
  };

  constructor(data: Partial<Responder>) {
    Object.assign(this, data);
  }
}
