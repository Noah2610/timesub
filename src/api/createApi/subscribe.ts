import { CreateApiFn } from ".";

export const createSubscribe: CreateApiFn<"subscribe"> =
    (_state, internalState, _internalApi) => (subscriber) => {
        const idx = internalState.subscribers.nextSubscriberIdx++;
        internalState.subscribers.subscribers[idx] = subscriber;
        return () => delete internalState.subscribers.subscribers[idx];
    };
