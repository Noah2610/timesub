/// <reference types="node" />
import { Timer, TimerOptions, TimerSubscriber } from "../types";
export interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
    options: TimerOptions;
    timer: Timer | undefined;
}
export declare function createInternalState(options: TimerOptions): TimerInternalState;
