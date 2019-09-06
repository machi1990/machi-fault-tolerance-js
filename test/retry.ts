import {retry} from "../src/retry";
import { assertEqual, assertDeepEqual } from "muchi-ts";

@MuchiTs({
    name: " .retry(retryArgs)(executable)"
  })
 class RetryTestClass {
    @Test({
        it: "returns executable results"
    })
    async noErrorThrownByExecutable() {
        // Given
        const expected = 'hello world';
        const Retry = retry({maxRetries: 1});
        // When
        const result = await Retry((...args) => args, null, 'hello world');
        // Then
        assertEqual(result, expected);
    }

    @Test({
        it: "when maxRetries is zero, throws an error if executable throws an error"
    })
    async throwsAnErrorWhenMaxRetriesIsZero() {
        // Given
        const expected = new Error();
        const Retry = retry({maxRetries: 0});
        // When
        try {
            await Retry(() => {throw expected}, null);
        } catch (error) {
            // Then
             assertDeepEqual(expected, error);
        }
    }

    @Test({
        it: "when maxRetries is defined, return the result of the last execution"
    })
    async throwsAnErrorWhenMaxRetriesIsZero() {
        // Given
        const maxRetries =  1;
        const expected = 'hello world'
        const fnCreator = (n: number) => {
            return (...args: any) => { if (n > 0) {
                n--;
                throw new Error();
            }
            
            return args[0];
            }
        }
    
        const Retry = retry({maxRetries});
        // When
        const retryFn = fnCreator(maxRetries)
        const result = await  Retry(retryFn, null, expected);
        assertEqual(expected, result);
    }

    @Test({
        it: "when maxRetries is defined, only retries when retryOn is satisfied"
    })
    async onlyRetryWhenRetryOnIsSatisfied() {
        // Given
        const maxRetries =  1;
        const expected = 'hello world'
        const fnCreator = (n: number) => {
            return (...args: any) => { if (n > 0) {
                n--;
                throw {
                    statusCode: 400
                };
            }
            
            return args[0];
            }
        }
    
        const Retry = retry({
            maxRetries, 
            retryOnFn: (error) => error.statusCode === 502
        });
        // When
        const retryFn = fnCreator(maxRetries)
        try {
            await  Retry(retryFn, null, expected);
        } catch(error) {
            assertDeepEqual(error, {statusCode: 400});
        }        
    }

    @Test({
        it: "abortFn defined, throw error when encountered even if max retries not reached"
    })
    async abortOnError() {
        // Given
        const maxRetries =  1;
        const expected = 'hello world'
        const fnCreator = (n: number) => {
            return (...args: any) => { if (n > 0) {
                n--;
                throw {
                    statusCode: 502
                };
            }
            
            return args[0];
            }
        }
    
        const Retry = retry({
            maxRetries, 
            abortOnFn: error => error.statusCode === 502
        });
        // When
        const retryFn = fnCreator(maxRetries)
        try {
            await  Retry(retryFn, null, expected);
        } catch(error) {
            assertDeepEqual(error, {statusCode: 502});
        }        
    }
 } 
