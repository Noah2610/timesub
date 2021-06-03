import {
    Timer,
    TimerApi,
    TimerEvent,
    TimerOptions,
    TimerState,
    TimerSubscriber,
} from "./types";

export * from "./types";

interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
    timer: Timer | undefined;
}

interface TimerInternalApi {
    createTimeout(): NodeJS.Timeout;
    update(): void;
    updateTime(): void;
    updateSubscribers(event: TimerEvent): void;
}

const DEFAULT_TIMER_OPTIONS: TimerOptions = {
    duration: "infinite",
    updateInterval: 100,
};

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

/**
 * Call this function to initialize a new `Timer`.
 * Optionally pass an options object. Every options property can be omitted.
 */
export function createTimer(opts?: Partial<TimerOptions>): Timer {
    const options = {
        ...DEFAULT_TIMER_OPTIONS,
        ...opts,
    };

    const state = createState();
    const internalState = createInternalState();
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
        getTime,
        setTime,
        play,
        pause,
        togglePlay,
        reset,
        getIsPlaying,
        subscribe,
    };

    // const timer: Timer = {
    //     ...state,
    //     ...api,
    // };
    const timer: Timer = Object.assign(state, api);

    internalState.timer = timer;

    return timer;
}

function createState(): TimerState {
    return {
        time: 0.0,
        isPlaying: false,
        isFinished: false,
    };
}

function createInternalState(): TimerInternalState {
    return {
        timeout: undefined,
        lastUpdate: undefined,
        subscribers: [],
        nextSubscriberIdx: 0,
        timer: undefined,
    };
}

function createInternalApi(
    state: TimerState,
    internalState: TimerInternalState,
    options: TimerOptions,
): TimerInternalApi {
    const createTimeout = () => setTimeout(update, options.updateInterval);

    const updateTime = () => {
        const lastUpdate = internalState.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        state.time += diff;
        internalState.lastUpdate = now;
    };

    const updateIsFinished = () => {
        const wasFinished = state.isFinished;
        state.isFinished =
            options.duration === "infinite"
                ? false
                : state.time >= options.duration;
        if (state.isFinished && state.isFinished !== wasFinished) {
            state.isPlaying = false;
        }
    };

    const updateSubscribers = (event: TimerEvent) => {
        if (!internalState.timer) {
            throw new Error(
                "[timesub] Internal state doesn't have its Timer! " +
                    "Can't call subscriber functions without timer object. " +
                    "This is a `timesub` bug.",
            );
        }

        for (const subscriber of Object.values(internalState.subscribers)) {
            subscriber(internalState.timer, event);
        }
    };

    const update = () => {
        updateTime();
        updateIsFinished();
        updateSubscribers({ type: state.isFinished ? "finish" : "update" });

        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        if (!state.isFinished && state.isPlaying) {
            internalState.timeout = internalApi.createTimeout();
        }
    };

    const internalApi: TimerInternalApi = {
        createTimeout,
        update,
        updateTime,
        updateSubscribers,
    };

    return internalApi;
}
