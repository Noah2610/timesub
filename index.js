"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimer = void 0;
var api_1 = require("./api");
var internal_1 = require("./internal");
__exportStar(require("./types"), exports);
var DEFAULT_TIMER_OPTIONS = {
    duration: "infinite",
    updateInterval: 100,
};
/**
 * Call this function to initialize a new `Timer`.
 * Optionally pass an options object. Every options property can be omitted.
 */
function createTimer(opts) {
    var options = __assign(__assign({}, DEFAULT_TIMER_OPTIONS), opts);
    var state = createState();
    var internalState = internal_1.createInternalState(options);
    var api = api_1.createApi(state, internalState);
    // Note:
    // This `Object.assign` is very important!
    // The `state` needs to stay the same object, so all references
    // to the state within the API functions stay valid.
    var timer = Object.assign(state, api);
    // This is an ugly workaround.
    // Internally in the `InternalApi["update"]` function, we have to call
    // all the subscriber callback functions with the actual `Timer` object.
    // Through this assignment, the already defined update function gets
    // access to the complete `Timer` object.
    internalState.timer = timer;
    return timer;
}
exports.createTimer = createTimer;
function createState() {
    return {
        time: 0.0,
        isPlaying: false,
        isFinished: false,
    };
}
