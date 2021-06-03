import { Timer, TimerSubscriber } from "../types";

export interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
    timer: Timer | undefined;
}

export function createInternalState(): TimerInternalState {
    return {
        timeout: undefined,
        lastUpdate: undefined,
        subscribers: [],
        nextSubscriberIdx: 0,
        timer: undefined,
    };
}
