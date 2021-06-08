import { CreateApiFn } from ".";

export const createPause: CreateApiFn<"pause"> =
    (state, internalState, internalApi) => () => {
        if (!state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = false;
        internalApi.stopTimeout();
        internalApi.updateTime();
        internalApi.emit({ type: "pause" });
        internalState.lastUpdate = undefined;

        return true;
    };
