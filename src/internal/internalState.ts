import { Timer, TimerOptions, TimerSubscriber } from "../types";

export interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
    options: TimerOptions;
    timer: Timer | undefined;
}

export function createInternalState(options: TimerOptions): TimerInternalState {
    return {
        timeout: undefined,
        lastUpdate: undefined,
        subscribers: [],
        nextSubscriberIdx: 0,
        options,
        timer: undefined,
    };
}
