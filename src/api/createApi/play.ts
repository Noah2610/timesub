import { CreateApiFn } from ".";

export const createPlay: CreateApiFn<"play"> =
    (state, _internalState, internalApi) => () => {
        if (state.isPlaying || state.isFinished) {
            return false;
        }

        state.isPlaying = true;
        internalApi.startTimeout();
        internalApi.updateTime();
        internalApi.updateSubscribers({ type: "play" });

        return true;
    };
