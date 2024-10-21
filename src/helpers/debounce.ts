export function debounce<T>(func: (...args: T[]) => void, ms = 300) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: T[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), ms);
  };
}
