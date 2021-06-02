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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimer = void 0;
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
    var internalState = createInternalState();
    var createTimeout = function () { return setTimeout(update, options.updateInterval); };
    var play = function () {
        if (timer.isPlaying || timer.isFinished) {
            return false;
        }
        timer.isPlaying = true;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.timeout = createTimeout();
        updateTime();
        updateSubscribers({ type: "play" });
        return true;
    };
    var pause = function () {
        if (!timer.isPlaying || timer.isFinished) {
            return false;
        }
        timer.isPlaying = false;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        updateTime();
        updateSubscribers({ type: "pause" });
        internalState.lastUpdate = undefined;
        return true;
    };
    var togglePlay = function () { return (timer.isPlaying ? timer.pause() : timer.play()); };
    var reset = function () {
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.lastUpdate = undefined;
        timer.time = 0;
        timer.isPlaying = false;
        timer.isFinished = false;
        updateSubscribers({ type: "reset" });
    };
    var getTime = function () { return timer.time; };
    var setTime = function (time) {
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.lastUpdate = undefined;
        timer.time = time;
        updateSubscribers({ type: "setTime" });
        update();
    };
    var getIsPlaying = function () { return timer.isPlaying; };
    var subscribe = function (subscriber) {
        var idx = internalState.nextSubscriberIdx++;
        internalState.subscribers[idx] = subscriber;
        return function () { return delete internalState.subscribers[idx]; };
    };
    var update = function () {
        updateTime();
        updateIsFinished();
        updateSubscribers({ type: timer.isFinished ? "finish" : "update" });
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        if (!timer.isFinished && timer.isPlaying) {
            internalState.timeout = createTimeout();
        }
    };
    var updateTime = function () {
        var _a;
        var lastUpdate = (_a = internalState.lastUpdate) !== null && _a !== void 0 ? _a : new Date().getTime();
        var now = new Date().getTime();
        var diff = now - lastUpdate;
        timer.time += diff;
        internalState.lastUpdate = now;
    };
    var updateIsFinished = function () {
        var wasFinished = timer.isFinished;
        timer.isFinished =
            options.duration === "infinite"
                ? false
                : timer.time >= options.duration;
        if (timer.isFinished && timer.isFinished !== wasFinished) {
            timer.isPlaying = false;
        }
    };
    var updateSubscribers = function (event) {
        for (var _i = 0, _a = Object.values(internalState.subscribers); _i < _a.length; _i++) {
            var subscriber = _a[_i];
            subscriber(timer, event);
        }
    };
    var api = {
        getTime: getTime,
        setTime: setTime,
        play: play,
        pause: pause,
        togglePlay: togglePlay,
        reset: reset,
        getIsPlaying: getIsPlaying,
        subscribe: subscribe,
    };
    var timer = __assign(__assign({}, createState()), api);
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
function createInternalState() {
    return {
        timeout: undefined,
        lastUpdate: undefined,
        subscribers: [],
        nextSubscriberIdx: 0,
    };
}
