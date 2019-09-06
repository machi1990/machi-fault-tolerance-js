interface RetryArgs {
    maxRetries: number;
    retryOnFn?: (...args: any) => any;
    abortOnFn?: (...args: any) => any;
}
export declare function retry(retryArg: RetryArgs): (fn: (...args: any) => any, context: any, ...args: any) => Promise<any>;
export {};
