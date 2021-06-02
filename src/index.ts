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

    const [state, internalState] = createState();
    const api = createApi(state, internalState, options);

    return api;
}

interface InternalTimerState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
}

function createState(): [TimerState, InternalTimerState] {
    return [
        {
            time: 0.0,
            isPlaying: false,
        },
        {
            timeout: undefined,
            lastUpdate: undefined,
        },
    ];
}

function createApi(
    state: TimerState,
    internalState: InternalTimerState,
    options: TimerOptions,
): TimerApi {
    const createTimeout = () => setTimeout(update, options.updateInterval);

    const isFinished = () => {
        if (options.duration === "infinite") {
            return false;
        }
        return state.time >= options.duration;
    };

    const subscribers: TimerSubscriber[] = [];

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
        subscribers.push(subscriber);
        const idx = subscribers.length - 1;
        return () => subscribers.splice(idx, 1);
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
        for (const subscriber of subscribers) {
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
        console.log(`update: ${state.time}`);
        updateSubscribers();

        if (isFinished()) {
            // do something probably...
        } else {
            internalState.timeout = createTimeout();
        }
    };

    return api;
}
