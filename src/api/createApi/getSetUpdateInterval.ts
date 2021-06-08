import { CreateApiFn } from ".";

export const createGetUpdateInterval: CreateApiFn<"getUpdateInterval"> =
    (_state, internalState, _internalApi) => () =>
        internalState.options.updateInterval;

export const createSetUpdateInterval: CreateApiFn<"setUpdateInterval"> =
    (_state, internalState, internalApi) => (updateInterval) => {
        internalState.options.updateInterval = updateInterval;
        // Update to reflect changes immediately
        internalApi.update();
    };
