import { TimerEvent, TimerState, TimerListener } from "../types";
import { TimerInternalState } from "./internalState";

export interface TimerInternalApi {
    startTimeout(): void;
    stopTimeout(): void;
    update(): void;
    updateTime(): void;
    updateIsFinished(): void;
    emit(event: TimerEvent): void;
}

export function createInternalApi(
    state: TimerState,
    internalState: TimerInternalState,
): TimerInternalApi {
    const startTimeout = () => {
        internalApi.stopTimeout();
        internalState.timeout = setTimeout(
            update,
            internalState.options.updateInterval,
        );
    };

    const stopTimeout = () => {
        if (internalState.timeout !== undefined) {
            clearTimeout(internalState.timeout);
            internalState.timeout = undefined;
        }
    };

    const updateTime = () => {
        const lastUpdate = internalState.lastUpdate ?? new Date().getTime();
        const now = new Date().getTime();
        const diff = now - lastUpdate;
        state.time += diff;
        internalState.lastUpdate = now;
    };

    const updateIsFinished = () => {
        const wasFinished = state.isFinished;
        state.isFinished =
            internalState.options.duration === "infinite"
                ? false
                : state.time >= internalState.options.duration;
        if (state.isFinished && state.isFinished !== wasFinished) {
            state.isPlaying = false;
        }
    };

    const emit = (event: TimerEvent) => {
        if (!internalState.timer) {
            throw new Error(
                "[timesub] Internal state doesn't have its Timer! " +
                    "Can't call subscriber functions without timer object. " +
                    "This is a `timesub` bug.",
            );
        }

        for (const subscriber of Object.values(
            internalState.subscribers.subscribers,
        )) {
            subscriber(internalState.timer, event);
        }

        const listeners = internalState.listeners.listeners[event.type] as
            | Record<number, TimerListener<typeof event.type>>
            | undefined;
        if (listeners) {
            for (const listener of Object.values(listeners)) {
                listener(internalState.timer, event);
            }
        }
    };

    const update = () => {
        internalApi.updateTime();
        internalApi.updateIsFinished();
        internalApi.emit({
            type: state.isFinished ? "finish" : "update",
        });

        internalApi.stopTimeout();
        if (!state.isFinished && state.isPlaying) {
            internalApi.startTimeout();
        }
    };

    const internalApi: TimerInternalApi = {
        startTimeout,
        stopTimeout,
        update,
        updateIsFinished,
        updateTime,
        emit,
    };

    return internalApi;
}
