import { Timer } from "../../types";
import { CreateApiFn } from ".";

export const createCleanup: CreateApiFn<"cleanup"> =
    (_state, internalState, internalApi) => () => {
        internalApi.stopTimeout();
        internalState.subscribers = {
            subscribers: {},
            nextSubscriberIdx: 0,
        };
        internalState.listeners = {
            listeners: {},
            nextListenerIdxs: {},
        };
        internalApi.emit({
            type: "cleanup",
        });

        // Replace all API functions with function that throws an error.
        // This makes sure the timer cannot be used anymore after cleanup.
        if (internalState.timer) {
            const timerFields = Object.keys(
                internalState.timer,
            ) as (keyof Timer)[];
            for (const timerField of timerFields) {
                const value = internalState.timer[timerField];
                if (typeof value === "function") {
                    (internalState.timer[timerField] as typeof value) = () => {
                        throw new Error(
                            "[timesub] Cannot call timer API functions after `cleanup()` call!",
                        );
                    };
                }
            }

            // Remove internal reference to timer object,
            // to hopefully allow GC to free timer memory.
            delete internalState.timer;
        }
    };
