import {timeout} from "../src/timeout";
import { assertEqual } from "muchi-ts";

@MuchiTs({
    name: " .timeout(delay)(contex, fn, ...args)"
  })
 class TimeOutTestClass {
    @Test({
        it: "returns does not throw an error"
      })
    async timeoutNotReached() {
        // Given
        const expected = 'hello';
        const Timeout = timeout(2000);
        // When
        const result = await Timeout(arg => arg, null, 'hello');
        // Then
        assertEqual(result, expected);
      }

      @Test({
        it: "throws a timeout error"
      })
    async timeoutReached() {
        // Given
        const Timeout = timeout(0);
        // When
        try {
            await Timeout(arg => () => {
                setTimeout(() => {
                    console.log(arg)
                }, 2000)
            }, null, 'hello');
        } catch(error) {
            // Then
            assertEqual(error.message, 'timeout of 0ms reached');
        }
      }
 } 
