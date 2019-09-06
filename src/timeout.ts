let counter = 0;

const timeOuts: Record<string, NodeJS.Timer> = {};

// tslint:disable no-any
export function timeout(delay?: number) {
  return (
    fn: (...args: any) => any,
    context: any | null | undefined,
    ...args: any
  ) => {
    const timeOut = counter++;

    return Promise.race([fn.apply(context, args), startTimer(counter, delay)])
      .then(result => {
        stopTimer(timeOut);
        return result;
      })
      .catch(error => {
        stopTimer(timeOut);
        throw error;
      });
  };
}

function startTimer(counter: number, timeout?: number) {
  const effectiveTimeout = timeout || 1000;

  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(effectiveTimeout));
    }, effectiveTimeout);
    timeOuts[counter] = timeoutId;
  });
}

function stopTimer(timeOut: number) {
  clearTimeout(timeOuts[timeOut]);
  delete timeOuts[timeOut];
}

class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`timeout of ${timeout}ms reached`);
  }
}
