import { Timer, TimerOptions } from "./types";
export * from "./types";
/**
 * Call this function to initialize a new `Timer`.
 * Optionally pass an options object. Every options property can be omitted.
 */
export declare function createTimer(opts?: Partial<TimerOptions>): Timer;
