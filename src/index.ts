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

    const play = () => {
        const wasPlaying = state.isPlaying;
        state.isPlaying = true;
        state.lastUpdate = undefined;
        state.timeout !== undefined && clearTimeout(state.timeout);
        state.timeout = createTimeout();
        return state.isPlaying !== wasPlaying;
    };

    const pause = () => {
        const wasPlaying = state.isPlaying;
        state.isPlaying = false;

        if (state.lastUpdate !== undefined) {
            state.time += new Date().getTime() - state.lastUpdate;
            state.lastUpdate = undefined;
        }

        state.timeout !== undefined && clearTimeout(state.timeout);
        return state.isPlaying !== wasPlaying;
    };

    const togglePlay = () => (state.isPlaying ? pause() : play());

    const getTime = () => {
        return state.time;
    };

    const setTime = (time: number) => {
        state.time = time;
    };

    const isPlaying = () => state.isPlaying;

    const subscribe: TimerApiSubscribe = (_) => () => {};

    const api: TimerApi = {
        getTime,
        setTime,
        play,
        pause,
        togglePlay,
        isPlaying,
        subscribe,
    };

    update = () => {
        const lastUpdate = state.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        state.time += diff;

        console.log(`Update! ${state.time}`);

        state.lastUpdate = now;

        state.timeout = createTimeout();
    };

    return api;
}
