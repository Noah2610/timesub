import { TimerApi, TimerOptions, TimerState } from "./types";
import {
    createInternalApi,
    TimerInternalApi,
    TimerInternalState,
} from "./internal";

export function createApi(
    state: TimerState,
    internalState: TimerInternalState,
    options: TimerOptions,
): TimerApi {
    const internalApi = createInternalApi(state, internalState, options);

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

    const api: TimerApi = {
        play,
        pause,
        togglePlay,
        getTime,
        setTime,
        reset,
        getIsPlaying,
        subscribe,
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
    (state, internalState, internalApi) => () => {
        if (state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = true;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.timeout = internalApi.createTimeout();
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
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
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
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
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
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.lastUpdate = undefined;
        state.time = time;
        internalApi.updateSubscribers({ type: "setTime" });
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
