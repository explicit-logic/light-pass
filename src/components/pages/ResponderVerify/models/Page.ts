export class Page {
  active: boolean;
  slug: string;

  name: string;

  assessed: boolean;
  mark: number;
  threshold: number;
  verified: boolean;

  constructor(data: Page) {
    Object.assign(this, data);
  }
}
