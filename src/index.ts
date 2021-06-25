import { Timer, TimerOptions } from "./types";
import { createApi } from "./api";
import { createState } from "./state";
import { createInternalState } from "./internal";

export * from "./types";

const DEFAULT_TIMER_OPTIONS: TimerOptions = {
    duration: "infinite",
    updateInterval: 100,
    direction: "forward",
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

    const state = createState(options);
    const internalState = createInternalState(options);
    const api = createApi(state, internalState);

    // Note:
    // This `Object.assign` is very important!
    // The `state` needs to stay the same object, so all references
    // to the state within the API functions stay valid.
    const timer: Timer = Object.assign(state, api);

    // This is an ugly workaround.
    // Internally in the `InternalApi["update"]` function, we have to call
    // all the subscriber callback functions with the actual `Timer` object.
    // Through this assignment, the already defined update function gets
    // access to the complete `Timer` object.
    internalState.timer = timer;

    return timer;
}
