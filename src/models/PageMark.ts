export class PageMark {
  page: string;

  available: boolean;
  mark: number;
  threshold: number;

  constructor(data: PageMark) {
    Object.assign(this, data);
  }
}
