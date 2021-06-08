import { CreateApiFn } from ".";

export const createSubscribe: CreateApiFn<"subscribe"> =
    (_state, internalState, _internalApi) => (subscriber) => {
        const idx = internalState.nextSubscriberIdx++;
        internalState.subscribers[idx] = subscriber;
        return () => delete internalState.subscribers[idx];
    };
