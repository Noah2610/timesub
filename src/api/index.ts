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

    const api: TimerApi = {
        play,
        pause,
        togglePlay: createApiFns.createTogglePlay(
            state,
            internalState,
            internalApi,
            { play, pause },
        ),
        reset: createApiFns.createReset(state, internalState, internalApi),
        getTime: createApiFns.createGetTime(state, internalState, internalApi),
        setTime: createApiFns.createSetTime(state, internalState, internalApi),
        getIsPlaying: createApiFns.createGetIsPlaying(
            state,
            internalState,
            internalApi,
        ),
        subscribe: createApiFns.createSubscribe(
            state,
            internalState,
            internalApi,
        ),
        on: createApiFns.createOn(state, internalState, internalApi),
        getOption: createApiFns.createGetOption(
            state,
            internalState,
            internalApi,
        ),
        setOption: createApiFns.createSetOption(
            state,
            internalState,
            internalApi,
        ),
        getDuration: createApiFns.createGetDuration(
            state,
            internalState,
            internalApi,
        ),
        setDuration: createApiFns.createSetDuration(
            state,
            internalState,
            internalApi,
        ),
        getUpdateInterval: createApiFns.createGetUpdateInterval(
            state,
            internalState,
            internalApi,
        ),
        setUpdateInterval: createApiFns.createSetUpdateInterval(
            state,
            internalState,
            internalApi,
        ),
    };

    return api;
}
