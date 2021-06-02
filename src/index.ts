export interface TimerState {
    time: number;
    isPlaying: boolean;

    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
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

type TimerApiSubscribe = (cb: TimerSubscriber) => () => void;

type TimerSubscriber = (state: TimerState, api: TimerApi) => void;

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

function createState(): TimerState {
    return {
        time: 0.0,
        isPlaying: false,

        timeout: undefined,
        lastUpdate: undefined,
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

    const subscribers: TimerSubscriber[] = [];

    const play = () => {
        if (state.isPlaying || isFinished()) {
            return false;
        }

        state.isPlaying = true;
        state.timeout !== undefined && clearTimeout(state.timeout);
        updateTime();
        updateSubscribers();
        state.timeout = createTimeout();

        return true;
    };

    const pause = () => {
        if (!state.isPlaying) {
            return false;
        }

        state.isPlaying = false;
        state.timeout !== undefined && clearTimeout(state.timeout);
        updateTime();
        updateSubscribers();
        state.lastUpdate = undefined;

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
        const lastUpdate = state.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        state.time += diff;

        state.lastUpdate = now;
    };

    const update = () => {
        updateTime();
        console.log(`update: ${state.time}`);
        updateSubscribers();

        if (isFinished()) {
            // do something probably...
        } else {
            state.timeout = createTimeout();
        }
    };

    return api;
}
