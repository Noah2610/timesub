"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalApi = void 0;
function createInternalApi(state, internalState) {
    var startTimeout = function () {
        internalApi.stopTimeout();
        internalState.timeout = setTimeout(update, internalState.options.updateInterval);
    };
    var stopTimeout = function () {
        if (internalState.timeout !== undefined) {
            clearTimeout(internalState.timeout);
            internalState.timeout = undefined;
        }
    };
    var updateTime = function () {
        var _a;
        var lastUpdate = (_a = internalState.lastUpdate) !== null && _a !== void 0 ? _a : new Date().getTime();
        var now = new Date().getTime();
        var diff = now - lastUpdate;
        state.time += diff;
        internalState.lastUpdate = now;
    };
    var updateIsFinished = function () {
        var wasFinished = state.isFinished;
        state.isFinished =
            internalState.options.duration === "infinite"
                ? false
                : state.time >= internalState.options.duration;
        if (state.isFinished && state.isFinished !== wasFinished) {
            state.isPlaying = false;
        }
    };
    var updateSubscribers = function (event) {
        if (!internalState.timer) {
            throw new Error("[timesub] Internal state doesn't have its Timer! " +
                "Can't call subscriber functions without timer object. " +
                "This is a `timesub` bug.");
        }
        for (var _i = 0, _a = Object.values(internalState.subscribers); _i < _a.length; _i++) {
            var subscriber = _a[_i];
            subscriber(internalState.timer, event);
        }
    };
    var update = function () {
        internalApi.updateTime();
        internalApi.updateIsFinished();
        internalApi.updateSubscribers({
            type: state.isFinished ? "finish" : "update",
        });
        internalApi.stopTimeout();
        if (!state.isFinished && state.isPlaying) {
            internalApi.startTimeout();
        }
    };
    var internalApi = {
        startTimeout: startTimeout,
        stopTimeout: stopTimeout,
        update: update,
        updateIsFinished: updateIsFinished,
        updateTime: updateTime,
        updateSubscribers: updateSubscribers,
    };
    return internalApi;
}
exports.createInternalApi = createInternalApi;
