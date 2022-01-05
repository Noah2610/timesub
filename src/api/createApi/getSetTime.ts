import { CreateApiFn } from ".";

export const createGetTime: CreateApiFn<"getTime"> =
    (state, _internalState, _internalApi) => () =>
        state.time;

export const createSetTime: CreateApiFn<"setTime"> =
    (state, internalState, internalApi) => (time) => {
        internalApi.stopTimeout();
        internalState.lastUpdate = undefined;
        state.time = time;
        internalApi.emit({
            type: "setTime",
            time,
        });
        // Note:
        // We `update` here which will start the timeout again, if the timer
        // is playing. It will also update subscribers again, which may
        // not be what we want here, because we already update them above.
        internalApi.update();
        internalState.lastUpdate = undefined;
    };
