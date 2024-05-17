export function setValue(_obj: unknown, path: string, value: unknown) {
  let i: number;
  let obj = _obj;
  const parts = path.split('.');
  for (i = 0; i < parts.length - 1; i++) {
    /* @ts-expect-error it's okay */
    obj = obj[parts[i]];
  }
  /* @ts-expect-error it's okay */
  obj[parts[i]] = value;
}
