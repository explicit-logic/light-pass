export function getValue<T>(obj: { [key: string]: unknown }, path: string): T {
  return path.split('.').reduce((o, i) => <{ [key: string]: unknown }>o?.[i], obj) as T;
}
