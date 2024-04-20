/**
 * @example start = new Date('2024-01-01').valueOf(), end = Date.now()
 */
export function getDuration(start: number, end: number): string {
  const diff = Math.round((end - start) / 1000);

  const hours = Math.floor(diff / 60 / 60);
  const minutes = Math.floor(diff / 60) - hours * 60;
  const seconds = diff % 60;

  if (hours) {
    return hours.toString().padStart(2, '0').concat(':', minutes.toString().padStart(2, '0'), ':', seconds.toString().padStart(2, '0'));
  }

  return minutes.toString().padStart(2, '0').concat(':', seconds.toString().padStart(2, '0'));
}
