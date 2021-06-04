import { TimerApi, TimerState } from "./types";
import {
    createInternalApi,
    TimerInternalApi,
    TimerInternalState,
} from "./internal";

export function createApi(
    state: TimerState,
    internalState: TimerInternalState,
): TimerApi {
    const internalApi = createInternalApi(state, internalState);

    const play = createApiPlay(state, internalState, internalApi);
    const pause = createApiPause(state, internalState, internalApi);
    const togglePlay = createApiTogglePlay(state, internalState, internalApi, {
        play,
        pause,
    });
    const reset = createApiReset(state, internalState, internalApi);
    const getTime = createApiGetTime(state, internalState, internalApi);
    const setTime = createApiSetTime(state, internalState, internalApi);
    const getIsPlaying = createApiGetIsPlaying(
        state,
        internalState,
        internalApi,
    );
    const subscribe = createApiSubscribe(state, internalState, internalApi);
    const getDuration = createApiGetDuration(state, internalState, internalApi);
    const setDuration = createApiSetDuration(state, internalState, internalApi);
    const getUpdateInterval = createApiGetUpdateInterval(
        state,
        internalState,
        internalApi,
    );
    const setUpdateInterval = createApiSetUpdateInterval(
        state,
        internalState,
        internalApi,
    );

    const api: TimerApi = {
        play,
        pause,
        togglePlay,
        reset,
        getTime,
        setTime,
        getIsPlaying,
        subscribe,
        getDuration,
        setDuration,
        getUpdateInterval,
        setUpdateInterval,
    };

    return api;
}

type CreateApiFn<T extends keyof TimerApi, TParams = undefined> =
    TParams extends undefined
        ? (
              state: TimerState,
              internalState: TimerInternalState,
              internalApi: TimerInternalApi,
          ) => TimerApi[T]
        : (
              state: TimerState,
              internalState: TimerInternalState,
              internalApi: TimerInternalApi,
              extraParams: TParams,
          ) => TimerApi[T];

const createApiPlay: CreateApiFn<"play"> =
    (state, _internalState, internalApi) => () => {
        if (state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = true;
        internalApi.startTimeout();
        internalApi.updateTime();
        internalApi.updateSubscribers({ type: "play" });

        return true;
    };

const createApiPause: CreateApiFn<"pause"> =
    (state, internalState, internalApi) => () => {
        if (!state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = false;
        internalApi.stopTimeout();
        internalApi.updateTime();
        internalApi.updateSubscribers({ type: "pause" });
        internalState.lastUpdate = undefined;

        return true;
    };

const createApiTogglePlay: CreateApiFn<
    "togglePlay",
    { play: () => boolean; pause: () => boolean }
> =
    (state, _internalState, _internalApi, { play, pause }) =>
    () =>
        state.isPlaying ? pause() : play();

const createApiReset: CreateApiFn<"reset"> =
    (state, internalState, internalApi) => () => {
        internalApi.stopTimeout();
        internalState.lastUpdate = undefined;
        state.time = 0;
        state.isPlaying = false;
        state.isFinished = false;
        internalApi.updateSubscribers({ type: "reset" });
    };

const createApiGetTime: CreateApiFn<"getTime"> =
    (state, _internalState, _internalApi) => () =>
        state.time;

const createApiSetTime: CreateApiFn<"setTime"> =
    (state, internalState, internalApi) => (time) => {
        internalApi.stopTimeout();
        internalState.lastUpdate = undefined;
        state.time = time;
        internalApi.updateSubscribers({
            type: "setTime",
            time,
        });
        // Note:
        // We `update` here which will start the timeout again, if the timer
        // is playing. It will also update subscribers again, which may
        // not be what we want here, because we already update them above.
        internalApi.update();
    };

const createApiGetIsPlaying: CreateApiFn<"getIsPlaying"> =
    (state, _internalState, _internalApi) => () =>
        state.isPlaying;

const createApiSubscribe: CreateApiFn<"subscribe"> =
    (_state, internalState, _internalApi) => (subscriber) => {
        const idx = internalState.nextSubscriberIdx++;
        internalState.subscribers[idx] = subscriber;
        return () => delete internalState.subscribers[idx];
    };

const createApiGetDuration: CreateApiFn<"getDuration"> =
    (_state, internalState, _internalApi) => () =>
        internalState.options.duration;

const createApiSetDuration: CreateApiFn<"setDuration"> =
    (_state, internalState, internalApi) => (duration) => {
        internalState.options.duration = duration;
        // Update to reflect changes immediately
        internalApi.update();
    };

const createApiGetUpdateInterval: CreateApiFn<"getUpdateInterval"> =
    (_state, internalState, _internalApi) => () =>
        internalState.options.updateInterval;

const createApiSetUpdateInterval: CreateApiFn<"setUpdateInterval"> =
    (_state, internalState, internalApi) => (updateInterval) => {
        internalState.options.updateInterval = updateInterval;
        // Update to reflect changes immediately
        internalApi.update();
    };
