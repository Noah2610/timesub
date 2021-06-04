"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = void 0;
var internal_1 = require("./internal");
function createApi(state, internalState) {
    var internalApi = internal_1.createInternalApi(state, internalState);
    var play = createApiPlay(state, internalState, internalApi);
    var pause = createApiPause(state, internalState, internalApi);
    var togglePlay = createApiTogglePlay(state, internalState, internalApi, {
        play: play,
        pause: pause,
    });
    var reset = createApiReset(state, internalState, internalApi);
    var getTime = createApiGetTime(state, internalState, internalApi);
    var setTime = createApiSetTime(state, internalState, internalApi);
    var getIsPlaying = createApiGetIsPlaying(state, internalState, internalApi);
    var subscribe = createApiSubscribe(state, internalState, internalApi);
    var getDuration = createApiGetDuration(state, internalState, internalApi);
    var setDuration = createApiSetDuration(state, internalState, internalApi);
    var getUpdateInterval = createApiGetUpdateInterval(state, internalState, internalApi);
    var setUpdateInterval = createApiSetUpdateInterval(state, internalState, internalApi);
    var api = {
        play: play,
        pause: pause,
        togglePlay: togglePlay,
        reset: reset,
        getTime: getTime,
        setTime: setTime,
        getIsPlaying: getIsPlaying,
        subscribe: subscribe,
        getDuration: getDuration,
        setDuration: setDuration,
        getUpdateInterval: getUpdateInterval,
        setUpdateInterval: setUpdateInterval,
    };
    return api;
}
exports.createApi = createApi;
var createApiPlay = function (state, _internalState, internalApi) { return function () {
    if (state.isPlaying || state.isFinished) {
        return false;
    }
    state.isPlaying = true;
    internalApi.startTimeout();
    internalApi.updateTime();
    internalApi.updateSubscribers({ type: "play" });
    return true;
}; };
var createApiPause = function (state, internalState, internalApi) { return function () {
    if (!state.isPlaying || state.isFinished) {
        return false;
    }
    state.isPlaying = false;
    internalApi.stopTimeout();
    internalApi.updateTime();
    internalApi.updateSubscribers({ type: "pause" });
    internalState.lastUpdate = undefined;
    return true;
}; };
var createApiTogglePlay = function (state, _internalState, _internalApi, _a) {
    var play = _a.play, pause = _a.pause;
    return function () {
        return state.isPlaying ? pause() : play();
    };
};
var createApiReset = function (state, internalState, internalApi) { return function () {
    internalApi.stopTimeout();
    internalState.lastUpdate = undefined;
    state.time = 0;
    state.isPlaying = false;
    state.isFinished = false;
    internalApi.updateSubscribers({ type: "reset" });
}; };
var createApiGetTime = function (state, _internalState, _internalApi) { return function () {
    return state.time;
}; };
var createApiSetTime = function (state, internalState, internalApi) { return function (time) {
    internalApi.stopTimeout();
    internalState.lastUpdate = undefined;
    state.time = time;
    internalApi.updateSubscribers({
        type: "setTime",
        time: time,
    });
    // Note:
    // We `update` here which will start the timeout again, if the timer
    // is playing. It will also update subscribers again, which may
    // not be what we want here, because we already update them above.
    internalApi.update();
}; };
var createApiGetIsPlaying = function (state, _internalState, _internalApi) { return function () {
    return state.isPlaying;
}; };
var createApiSubscribe = function (_state, internalState, _internalApi) { return function (subscriber) {
    var idx = internalState.nextSubscriberIdx++;
    internalState.subscribers[idx] = subscriber;
    return function () { return delete internalState.subscribers[idx]; };
}; };
var createApiGetDuration = function (_state, internalState, _internalApi) { return function () {
    return internalState.options.duration;
}; };
var createApiSetDuration = function (_state, internalState, internalApi) { return function (duration) {
    internalState.options.duration = duration;
    // Update to reflect changes immediately
    internalApi.update();
}; };
var createApiGetUpdateInterval = function (_state, internalState, _internalApi) { return function () {
    return internalState.options.updateInterval;
}; };
var createApiSetUpdateInterval = function (_state, internalState, internalApi) { return function (updateInterval) {
    internalState.options.updateInterval = updateInterval;
    // Update to reflect changes immediately
    internalApi.update();
}; };
