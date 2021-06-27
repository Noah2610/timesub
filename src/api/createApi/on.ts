import { TimerEventType, TimerListener } from "../../types";
import { CreateApiFn } from ".";

export const createOn: CreateApiFn<"on"> =
    (_state, internalState, _internalApi) => (eventType, listener) => {
        const addListener = (eventType: TimerEventType): (() => void) => {
            if (!internalState.listeners.listeners[eventType]) {
                internalState.listeners.listeners[eventType] = {};
            }
            if (
                internalState.listeners.nextListenerIdxs[eventType] ===
                undefined
            ) {
                internalState.listeners.nextListenerIdxs[eventType] = 0;
            }

            const listeners = internalState.listeners.listeners[
                eventType
            ] as Record<number, TimerListener<typeof eventType>>;

            const idx = internalState.listeners.nextListenerIdxs[eventType]!++;
            listeners[idx] = listener as TimerListener<typeof eventType>;
            return () => delete listeners[idx];
        };

        if (typeof eventType === "string") {
            return addListener(eventType);
        } else {
            const unsubs = eventType.map(addListener);
            return () => unsubs.forEach((cb) => cb());
        }
    };
