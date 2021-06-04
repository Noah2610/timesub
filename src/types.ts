/**
 * The Timer context, containing both the state and API functions.
 */
export interface Timer extends TimerState, TimerApi {}

/**
 * Timer state values.
 */
export interface TimerState {
    /**
     * Current playback time.
     */
    time: Time;

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
     * Get the current time.
     */
    getTime(): Time;

    /**
     * Set the time to the given `time` in milliseconds.
     */
    setTime(time: Time): void;

    /**
     * Get playback status.
     */
    getIsPlaying(): boolean;

    /**
     * Subscribe to time updates.
     * The given callback function will be called anytime the state changes.
     * The callback gets two arguments:
     *   1. The `Timer` context, including state and API functions,
     *   2. A `TimerEvent` object, that contains a `type` property,
     *      informing what caused the update.
     * Returns a function that can be called to unsubscribe.
     */
    subscribe(cb: TimerSubscriber): () => void;

    /**
     * Set a new duration for the timer.
     * The duration is the max time before the timer finishes.
     */
    setDuration(duration: Time): void;

    /**
     * Set a new update interval for the timer.
     * This is the delay time in milliseconds between every time update.
     */
    setUpdateInterval(updateInterval: Time): void;
}

export type TimerApiSubscribe = TimerApi["subscribe"];

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
    /**
     * When the `setTime()` function triggered the update.
     * Also gets the target `time`, used with the `setTime` call.
     * */
    | {
          type: "setTime";
          time: Time;
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
    duration: Time | "infinite";

    /**
     * The delay in milliseconds between every update.
     * Time itself is always calculated with `Date`, this is just
     * how often it recalculates and calls all subscriber functions.
     *
     * Default: 100
     */
    updateInterval: Time;
}

/**
 * Wrapper type for time representation.
 * Just a number in milliseconds.
 */
export type Time = number;
