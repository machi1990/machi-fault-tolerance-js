"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var counter = 0;
var timeOuts = {};
// tslint:disable no-any
function timeout(delay) {
    return function (fn, context) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var timeOut = counter++;
        return Promise.race([fn.apply(context, args), startTimer(counter, delay)])
            .then(function (result) {
            stopTimer(timeOut);
            return result;
        })
            .catch(function (error) {
            stopTimer(timeOut);
            throw error;
        });
    };
}
exports.timeout = timeout;
function startTimer(counter, timeout) {
    var effectiveTimeout = timeout || 1000;
    return new Promise(function (_, reject) {
        var timeoutId = setTimeout(function () {
            reject(new TimeoutError(effectiveTimeout));
        }, effectiveTimeout);
        timeOuts[counter] = timeoutId;
    });
}
function stopTimer(timeOut) {
    clearTimeout(timeOuts[timeOut]);
    delete timeOuts[timeOut];
}
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(timeout) {
        return _super.call(this, "timeout of " + timeout + "ms reached") || this;
    }
    return TimeoutError;
}(Error));
//# sourceMappingURL=timeout.js.map