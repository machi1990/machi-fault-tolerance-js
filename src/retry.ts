// tslint:disable no-any

interface RetryArgs {
  maxRetries: number;
  retryOnFn?: (...args: any) => any;
  abortOnFn?: (...args: any) => any;
}

export function retry(retryArg: RetryArgs) {
  let counter = retryArg.maxRetries;
  if (counter < 0 || !counter) {
    counter = 0;
  }

  return async (
    fn: (...args: any) => any,
    context: any | null | undefined,
    ...args: any
  ) => {
    let error;
    do {
      try {
        return await fn.apply(context, args);
      } catch (e) {
        if (typeof retryArg.retryOnFn === 'function') {
          const canRetry = await retryArg.retryOnFn(e);
          if (!canRetry) {
            throw e;
          }
        }

        if (typeof retryArg.abortOnFn === 'function') {
          const canAbort = await retryArg.abortOnFn(e);
          if (!canAbort) {
            throw e;
          }
        }

        counter = counter - 1;
        error = e;
      }
    } while (counter > -1);

    throw error;
  };
}
