// tslint:disable no-any
export function fallback(
  fb: (...args: any) => any,
  fallBackContext: any,
  when?: (...args: any) => any
) {
  return async (fn: (...args: any) => any, context: any, ...args: any) => {
    try {
      return await fn.apply(context, args);
    } catch (error) {
      if (typeof when === 'function') {
        const executeFallbackWhen = await when(error);
        if (executeFallbackWhen) {
          return fb.apply(fallBackContext || context, args);
        }

        throw error;
      }

      return fb.apply(fallBackContext || context, args);
    }
  };
}
