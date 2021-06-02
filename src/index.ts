export interface TimerState {
    time: number;
    isPlaying: boolean;
}

export interface TimerApi {
    getTime(): number;
    setTime(time: number): void;
    play(): boolean;
    pause(): boolean;
    togglePlay(): boolean;
    isPlaying(): boolean;
    subscribe: TimerApiSubscribe;
}

export type TimerApiSubscribe = (cb: TimerSubscriber) => () => void;

export type TimerSubscriber = (state: TimerState, api: TimerApi) => void;

export interface TimerOptions {
    duration: number | "infinite";
    updateInterval: number;
}

const DEFAULT_TIMER_OPTIONS: TimerOptions = {
    duration: "infinite",
    updateInterval: 100,
};

export function createTimer(opts?: Partial<TimerOptions>): TimerApi {
    const options = {
        ...DEFAULT_TIMER_OPTIONS,
        ...opts,
    };

    const state = createState();
    const api = createApi(state, options);

    return api;
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

    const isFinished = () => {
        if (options.duration === "infinite") {
            return false;
        }
        return state.time >= options.duration;
    };

    const internalState = createInternalState();

    const play = () => {
        if (state.isPlaying || isFinished()) {
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
        if (!state.isPlaying) {
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

    const isPlaying = () => state.isPlaying;

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
        isPlaying,
        subscribe,
    };

    const updateSubscribers = () => {
        for (const subscriber of Object.values(internalState.subscribers)) {
            subscriber(state, api);
        }
    };

    const updateTime = () => {
        const lastUpdate = internalState.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        state.time += diff;

        internalState.lastUpdate = now;
    };

    const update = () => {
        updateTime();
        updateSubscribers();

        if (isFinished()) {
            // do something probably...
        } else {
            internalState.timeout = createTimeout();
        }
    };

    return api;
}
