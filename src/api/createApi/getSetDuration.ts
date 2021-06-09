import { CreateApiFn } from ".";

export const createGetDuration: CreateApiFn<"getDuration"> =
    (_state, internalState, _internalApi) => () =>
        internalState.options.duration;

export const createSetDuration: CreateApiFn<"setDuration"> =
    (_state, internalState, internalApi) => (duration) => {
        internalState.options.duration = duration;
        // Update to reflect changes immediately
        internalApi.update();
        internalApi.emit({
            type: "setDuration",
            duration,
        });
    };
