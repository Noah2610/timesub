/**
 * The Timer context, containing both the state and API functions.
 */
export type Timer = TimerState & TimerApi;

/**
 * Timer state values.
 */
export interface TimerState {
    /**
     * Current playback time.
     */
    time: number;

    /**
     * Current playback status.
     */
    isPlaying: boolean;

    /**
     * If you've set a duration, then this could be `true`
     * if the time has reached the duration.
     */
    isFinished: boolean;
}

/**
 * Timer API functions, to control playback and subscribe to state changes.
 */
export interface TimerApi {
    /**
     * Get the current time.
     */
    getTime(): number;

    /**
     * Set the time to the given `time` in milliseconds.
     */
    setTime(time: number): void;

    /**
     * Play the timer, if it's paused.
     */
    play(): boolean;

    /**
     * Pause the timer.
     */
    pause(): boolean;

    /**
     * Toggle between playing and paused states.
     */
    togglePlay(): boolean;

    /**
     * Resets the timer time to 0, and stops the timer if it was playing.
     * All subscriptions will be kept.
     */
    reset(): void;

    /**
     * Get playback status.
     */
    getIsPlaying(): boolean;

    /**
     * Subscribe to time updates.
     * The given callback function will be called anytime the state changes.
     * The callback gets two arguments:
     *   1. The `Timer` context, including state and API functions,
     *   2. An `TimerEvent` object, that contains a `type` property,
     *      informing what caused the update.
     * Returns a function that can be called to unsubscribe.
     */
    subscribe: TimerApiSubscribe;
}

export type TimerApiSubscribe = (cb: TimerSubscriber) => () => void;

export type TimerSubscriber = (timer: Timer, event: TimerEvent) => void;

/**
 * An object passed as the second argument to a subscriber callback.
 */
export type TimerEvent =
    /** When the `play()` function triggered the update. */
    | {
          type: "play";
      }
    /** When the `pause()` function triggered the update. */
    | {
          type: "pause";
      }
    /** When the `setTime()` function triggered the update. */
    | {
          type: "setTime";
      }
    /** When the `reset()` function triggered the update. */
    | {
          type: "reset";
      }
    /** When it's updated by the interval. */
    | {
          type: "update";
      }
    /** When the timer finishes. */
    | {
          type: "finish";
      };

/**
 * Options you can pass to the `createTimer` function.
 */
export interface TimerOptions {
    /**
     * The maximum duration for the timer in milliseconds.
     * Once the time has reached the duration, the timer will stop.
     * If "infinite", the timer will never stop on its own.
     *
     * Default: "infinite"
     */
    duration: number | "infinite";

    /**
     * The delay in milliseconds between every update.
     * Time itself is always calculated with `Date`, this is just
     * how often it recalculates and calls all subscriber functions.
     *
     * Default: 100
     */
    updateInterval: number;
}

interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
}

const DEFAULT_TIMER_OPTIONS: TimerOptions = {
    duration: "infinite",
    updateInterval: 100,
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

    const internalState = createInternalState();

    const createTimeout = () => setTimeout(update, options.updateInterval);

    const play = () => {
        if (timer.isPlaying || timer.isFinished) {
            return false;
        }

        timer.isPlaying = true;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.timeout = createTimeout();
        updateTime();
        updateSubscribers({ type: "play" });

        return true;
    };

    const pause = () => {
        if (!timer.isPlaying || timer.isFinished) {
            return false;
        }

        timer.isPlaying = false;
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        updateTime();
        updateSubscribers({ type: "pause" });
        internalState.lastUpdate = undefined;

        return true;
    };

    const togglePlay = () => (timer.isPlaying ? timer.pause() : timer.play());

    const reset = () => {
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.lastUpdate = undefined;
        timer.time = 0;
        timer.isPlaying = false;
        timer.isFinished = false;
        updateSubscribers({ type: "reset" });
    };

    const getTime = () => timer.time;

    const setTime = (time: number) => {
        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        internalState.lastUpdate = undefined;
        timer.time = time;
        updateSubscribers({ type: "setTime" });
    };

    const getIsPlaying = () => timer.isPlaying;

    const subscribe: TimerApiSubscribe = (subscriber) => {
        const idx = internalState.nextSubscriberIdx++;
        internalState.subscribers[idx] = subscriber;
        return () => delete internalState.subscribers[idx];
    };

    const update = () => {
        updateTime();
        updateIsFinished();
        updateSubscribers({ type: timer.isFinished ? "finish" : "update" });

        internalState.timeout !== undefined &&
            clearTimeout(internalState.timeout);
        if (!timer.isFinished && timer.isPlaying) {
            internalState.timeout = createTimeout();
        }
    };

    const updateTime = () => {
        const lastUpdate = internalState.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        timer.time += diff;
        internalState.lastUpdate = now;
    };

    const updateIsFinished = () => {
        const wasFinished = timer.isFinished;
        timer.isFinished =
            options.duration === "infinite"
                ? false
                : timer.time >= options.duration;
        if (timer.isFinished && timer.isFinished !== wasFinished) {
            timer.isPlaying = false;
        }
    };

    const updateSubscribers = (event: TimerEvent) => {
        for (const subscriber of Object.values(internalState.subscribers)) {
            subscriber(timer, event);
        }
    };

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

    const timer: Timer = {
        ...createState(),
        ...api,
    };

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
    };
}
