import { TimerListener } from "../../types";
import { CreateApiFn } from ".";

export const createOn: CreateApiFn<"on"> =
    (_state, internalState, _internalApi) => (eventType, listener) => {
        if (!internalState.listeners.listeners[eventType]) {
            internalState.listeners.listeners[eventType] = {};
        }
        if (internalState.listeners.nextListenerIdxs[eventType] === undefined) {
            internalState.listeners.nextListenerIdxs[eventType] = 0;
        }

        const listeners = internalState.listeners.listeners[
            eventType
        ] as Record<number, TimerListener<typeof eventType>>;

        const idx = internalState.listeners.nextListenerIdxs[eventType]!++;
        listeners[idx] = listener;
        return () => delete listeners[idx];
    };
