export function debounce(func: () => void, ms = 300) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: []) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), ms);
  };
}
