export declare function fallback(fb: (...args: any) => any, fallBackContext: any, when?: (...args: any) => any): (fn: (...args: any) => any, context: any, ...args: any) => Promise<any>;
