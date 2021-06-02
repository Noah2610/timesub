export type Timer = TimerState & TimerApi;

export interface TimerState {
    time: number;
    isPlaying: boolean;
    isFinished: boolean;
}

export interface TimerApi {
    getTime(): number;
    setTime(time: number): void;
    play(): boolean;
    pause(): boolean;
    togglePlay(): boolean;
    getIsPlaying(): boolean;
    subscribe: TimerApiSubscribe;
}

export type TimerApiSubscribe = (cb: TimerSubscriber) => () => void;

export type TimerSubscriber = (timer: Timer) => void;

export interface TimerOptions {
    duration: number | "infinite";
    updateInterval: number;
}

const DEFAULT_TIMER_OPTIONS: TimerOptions = {
    duration: "infinite",
    updateInterval: 100,
};

export function createTimer(opts?: Partial<TimerOptions>): Timer {
    const options = {
        ...DEFAULT_TIMER_OPTIONS,
        ...opts,
    };

    const state = createState();
    const api = createApi(state, options);

    return {
        ...state,
        ...api,
    };
}

interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
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
    };
}

function createApi(state: TimerState, options: TimerOptions): TimerApi {
    const createTimeout = () => setTimeout(update, options.updateInterval);

    const internalState = createInternalState();

    const play = () => {
        if (state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = true;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        updateTime();
        updateSubscribers();
        internalState.timeout = createTimeout();

        return true;
    };

    const pause = () => {
        if (!state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = false;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        updateTime();
        updateSubscribers();
        internalState.lastUpdate = undefined;

        return true;
    };

    const togglePlay = () => (state.isPlaying ? pause() : play());

    const getTime = () => {
        return state.time;
    };

    const setTime = (time: number) => {
        state.time = time;
    };

    const getIsPlaying = () => state.isPlaying;

    const subscribe: TimerApiSubscribe = (subscriber) => {
        const idx = internalState.nextSubscriberIdx++;
        internalState.subscribers[idx] = subscriber;
        return () => delete internalState.subscribers[idx];
    };

    const api: TimerApi = {
        getTime,
        setTime,
        play,
        pause,
        togglePlay,
        getIsPlaying,
        subscribe,
    };

    const update = () => {
        updateTime();
        updateIsFinished();
        updateSubscribers();

        if (!state.isFinished) {
            internalState.timeout = createTimeout();
        }
    };

    const updateTime = () => {
        const lastUpdate = internalState.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        state.time += diff;

        internalState.lastUpdate = now;
    };

    const updateIsFinished = () => {
        if (options.duration === "infinite") {
            state.isFinished = false;
        }
        state.isFinished = state.time >= options.duration;
    };

    const updateSubscribers = () => {
        for (const subscriber of Object.values(internalState.subscribers)) {
            subscriber({
                ...state,
                ...api,
            });
        }
    };

    return api;
}
