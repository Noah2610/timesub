import { CreateApiFn } from ".";

export const createReset: CreateApiFn<"reset"> =
    (state, internalState, internalApi) => () => {
        internalApi.stopTimeout();
        internalState.lastUpdate = undefined;
        state.time = 0;
        state.isPlaying = false;
        state.isFinished = false;
        internalApi.emit({ type: "reset" });
    };
