import { TimerApi, TimerState } from "../types";
import { createInternalApi, TimerInternalState } from "../internal";
import { createApiFns } from "./createApi";

export function createApi(
    state: TimerState,
    internalState: TimerInternalState,
): TimerApi {
    const internalApi = createInternalApi(state, internalState);

    const play = createApiFns.createPlay(state, internalState, internalApi);
    const pause = createApiFns.createPause(state, internalState, internalApi);

    const togglePlay = createApiFns.createTogglePlay(
        state,
        internalState,
        internalApi,
        { play, pause },
    );
    const reset = createApiFns.createReset(state, internalState, internalApi);
    const getTime = createApiFns.createGetTime(
        state,
        internalState,
        internalApi,
    );
    const setTime = createApiFns.createSetTime(
        state,
        internalState,
        internalApi,
    );
    const getIsPlaying = createApiFns.createGetIsPlaying(
        state,
        internalState,
        internalApi,
    );
    const subscribe = createApiFns.createSubscribe(
        state,
        internalState,
        internalApi,
    );
    const on = createApiFns.createOn(state, internalState, internalApi);
    const getDuration = createApiFns.createGetDuration(
        state,
        internalState,
        internalApi,
    );
    const setDuration = createApiFns.createSetDuration(
        state,
        internalState,
        internalApi,
    );
    const getUpdateInterval = createApiFns.createGetUpdateInterval(
        state,
        internalState,
        internalApi,
    );
    const setUpdateInterval = createApiFns.createSetUpdateInterval(
        state,
        internalState,
        internalApi,
    );
    const cleanup = createApiFns.createCleanup(
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
        on,
        getDuration,
        setDuration,
        getUpdateInterval,
        setUpdateInterval,
        cleanup,
    };

    return api;
}
