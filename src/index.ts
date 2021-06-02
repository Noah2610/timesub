export interface TimerState {
    time: number;
    isPlaying: boolean;

    timeout: NodeJS.Timeout | undefined;
    lastUpdate: Date | undefined;
}

export interface TimerApi {
    getTime(): number;
    setTime(time: number): void;
    play(): boolean;
    pause(): boolean;
    isPlaying(): boolean;
    subscribe: TimerApiSubscribe;
}

type TimerApiSubscribe = (
    cb: (stateAndApi: TimerState & TimerApi) => void,
) => () => void;

export interface TimerOptions {
    duration?: number | "infinite";
    updateInterval?: number;
}

const DEFAULT_TIMER_OPTIONS: Required<TimerOptions> = {
    duration: "infinite",
    updateInterval: 100,
};

export function createTimer(opts?: TimerOptions): TimerApi {
    const options = {
        ...DEFAULT_TIMER_OPTIONS,
        ...opts,
    };

    let update = () => {};
    // Note, that we wrap our `update` function call in another anonymous
    // function on purpose here. This allows us to overwrite the update
    // function later, and our interval will still use the new update function.
    const createTimeout = () =>
        setTimeout(() => update(), options.updateInterval);

    const state: TimerState = {
        time: 0.0,
        isPlaying: false,

        timeout: undefined,
        lastUpdate: undefined,
    };

    const api: TimerApi = {
        getTime() {
            return state.time;
        },

        setTime(time) {
            state.time = time;
        },

        play() {
            const wasPlaying = state.isPlaying;
            state.isPlaying = true;
            state.timeout !== undefined && clearTimeout(state.timeout);
            state.timeout = createTimeout();
            return state.isPlaying !== wasPlaying;
        },

        pause() {
            const wasPlaying = state.isPlaying;
            state.isPlaying = false;
            state.timeout !== undefined && clearTimeout(state.timeout);
            return state.isPlaying !== wasPlaying;
        },

        isPlaying() {
            return state.isPlaying;
        },

        subscribe(_) {
            return () => {};
        },
    };

    update = () => {
        const lastUpdate = state.lastUpdate ?? new Date();
        const now = new Date();
        const diff = now.getTime() - lastUpdate.getTime();
        state.time = state.time + diff;

        console.log(`Update! ${state.time}`);

        state.lastUpdate = now;

        state.timeout = createTimeout();
    };

    return api;
}
