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
