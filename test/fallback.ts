import {fallback} from "../src/fallback";
import { assertEqual } from "muchi-ts";

@MuchiTs({
    name: " .fallback(fallbackArgs)(executable)"
  })
 class FallbackTestClass {
    @Test({
        it: "returns executable results"
    })
    async noErrorThrownByExecutable() {
        // Given
        const expected = 'hello world';
        const Fallback = fallback(() => 'hello');
        // When
        const result = await Fallback((...args) => args, null, 'hello world');
        // Then
        assertEqual(result, expected);
    }

    @Test({
        it: "returns fallback results"
    })
    async returnsFallbackResults() {
        // Given
        const expected = 'hello';
        const Fallback = fallback(() => 'hello');
        // When
        const result = await Fallback((...args) => { throw args;}, null, 'hello world');
        // Then
        assertEqual(result, expected);
    }

    @Test({
        it: "returns fallback when error"
    })
    async returnsFallbackResultsOnlyWhen() {
        // Given
        const expected = 'hello';
        const Fallback = fallback(() => 'hello', null, (error) => error.fallback);
        // When
        const result = await Fallback((...args) => {throw {fallback: true};}, null, 'hello world');
        // Then
        assertEqual(result, expected);
    }
 } 
