# machi fault tolerance

Implement a light weight fault tolerance and high resilience patterns for JavaScript applications.

This package implements the following patterns
- timeout
- fallback
- retry 

# timeout

The `timeout` pattern can be implemented as shown in the example below:

```
const {timeout} = require('machi-fault-tolerance');

const fn = (arg1, arg2, arg3) => { // the function to execute
    // a very long computation
}

const Timeout = timeout(2000); // a timeout of 2000 ms

const result = await Timeout(fn, this, arg1, arg2, arg3) // execute the function fn, in a given context (null or undefined accepted), with the given args within 2 seconds or throw an error
```

The default timeout value is 1 second.

# fallback
The `fallback` pattern can be implemented as shown in the example below:

```
const {fallback} = require('machi-fault-tolerance');

const fn = (...args) => { // the function to execute
    // compute or potentially throwing an error
}

const fb = () => {console.log(" fallback executed" )}

const Fallback = fallback(fb, this); // defines a fallback function that can be executed when fn throws an error.

const result = await Fallback(fn, this, arg1, arg2, arg3, argN) // execute the function fn, in a given context (null or undefined accepted), with the given args. If fn throws an error, return results executed by fb.
```

The fallback constructor optionally accept a third parameter defined which is a function that defines conditional execution of the fallback.

e.g

```
const {fallback} = require('machi-fault-tolerance');

const fn = (...args) => { // the function to execute
    // compute or potentially throwing an error
}

const fb = () => {console.log(" fallback executed" )}

const Fallback = fallback(fb, this, (error) => error.statusCode === 502); // defines a fallback function that can be executed when an erro with statusCode 502 occurs.

const result = await Fallback(fn, this, arg1, arg2, arg3, argN).
```

# retry

The `retry` pattern can be used as follows:

1. minimum configuration
```
const expected = new Error();
const Retry = retry({maxRetries: 2}); // indicate the number of retries to do before throwing an error. The minimum value is zero. 

const result = await Retry(() => {
    // do something
}, null); // return result of execution of a given funcion or throws an error

```

2. conditional retry when error satisfies a given condition
```
const expected = new Error();
const Retry = retry({
    maxRetries: 2, 
    retryOn: () => {
    return Math.random() * 3 % 2 === 0;
}}
); // indicate the number of retries to do when the "retryOn" function is satisfied before throwing an error. The "retryOn" will receive current error as argument

const result = await Retry(() => {
    // do something
}, null); // return result of execution of a given funcion or throws an error

```

3. short circuit retries with "abortOn" function 

```
const expected = new Error();
const Retry = retry({
    maxRetries: 2, 
    abortOn: (error) => {
    return error.statusCode === 403;
}}
); // indicate the number of retries. If an error matches the given condition short circuit retries and throw the corresponding error. 

const result = await Retry(() => {
    // do something
}, null); // return result of execution of a given funcion or throws an error


# Author
Manyanda Chitimbo <manyanda.chitimbo@gmail.com>