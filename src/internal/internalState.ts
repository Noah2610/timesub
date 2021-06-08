import {
    Timer,
    TimerOptions,
    TimerSubscriber,
    TimerEventType,
    TimerListener,
} from "../types";

export interface TimerInternalState {
    timeout: NodeJS.Timeout | undefined;
    lastUpdate: number | undefined;
    subscribers: TimerInternalSubscribers;
    listeners: TimerInternalListeners;
    options: TimerOptions;
    timer: Timer | undefined;
}

interface TimerInternalSubscribers {
    subscribers: Record<number, TimerSubscriber>;
    nextSubscriberIdx: number;
}

interface TimerInternalListeners {
    listeners: {
        [T in TimerEventType]?: Record<number, TimerListener<T>>;
    };
    nextListenerIdxs: {
        [T in TimerEventType]?: number;
    };
}

export function createInternalState(options: TimerOptions): TimerInternalState {
    return {
        timeout: undefined,
        lastUpdate: undefined,
        subscribers: {
            subscribers: {},
            nextSubscriberIdx: 0,
        },
        listeners: {
            listeners: {},
            nextListenerIdxs: {},
        },
        options,
        timer: undefined,
    };
}
