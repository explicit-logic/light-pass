export function abortable<T = void>(task: () => Promise<T>, { signal }: { signal: AbortSignal }): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // If the signal is already aborted, immediately throw in order to reject the promise.
    if (signal.aborted) {
      reject(signal.reason);
    }

    // Perform the main purpose of the task
    // Call resolve(result) when done.
    task().then(resolve).catch(reject);

    // Watch for 'abort' signals
    signal.addEventListener('abort', () => {
      // Stop the main operation
      // Reject the promise with the abort reason.
      reject(signal.reason);
    });
  });
}
